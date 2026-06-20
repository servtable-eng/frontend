import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '@workspace/ui/styles.css';
import { deleteDish as deleteDishRequest, disableDish, enableDish, getDishesForRestaurant } from '@/services/dishes/dish.service';
import {
  createExtraItem,
  deleteExtraItem as deleteExtraItemRequest,
  disableExtraItem,
  enableExtraItem,
  getExtraItemsForRestaurant,
  updateExtraItem,
} from '@/services/extras/extra.service';
import '@/styles/tokens.css';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { showError, showSuccess } from '@/components/ToastProvider';
import type { ExtraItem, ExtraItemResponse } from '@/types/extra';
import type { RestaurantDishDto } from '@/types/dish';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AdminPageHeader } from '@/components/admin/AdminShared';
import { BuffetDishesTab } from '@/components/admin/BuffetDishesTab';
import { ExtraItemFormModal, type ExtraItemForm } from './cardapio/ExtraItemFormModal';
import { ExtraItemsTab } from './cardapio/ExtraItemsTab';
import { ROUTES } from '@/routes/routeConstants';

const ITEMS_PER_PAGE = 10;
const EMPTY_EXTRA_FORM: ExtraItemForm = {
  name: '',
  description: '',
  imageUrl: '',
  salePrice: '',
  available: true,
};
const EXTRA_ITEM_ERROR_MESSAGE = 'Erro ao atualizar item extra.';

const categoryLabel = (category: string) => category.replaceAll('_', ' ');
const toExtraItem = (item: ExtraItemResponse): ExtraItem => ({
  ...item,
  available: item.available ?? true,
});

export function GerenciamentoCardapio() {
  const restaurant = useRestaurant();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState<RestaurantDishDto[]>([]);
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);
  const [activeTab, setActiveTab] = useState<'buffet' | 'extras'>('buffet');
  const [extraForm, setExtraForm] = useState<ExtraItemForm>(EMPTY_EXTRA_FORM);
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);
  const [isExtraFormOpen, setIsExtraFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [extraError, setExtraError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const loadExtraItems = () => {
    if (!restaurant.id) return Promise.resolve();

    setExtraError('');
    return getExtraItemsForRestaurant(restaurant.id)
      .then(data => setExtraItems(data.map(toExtraItem)))
      .catch(() => {
        setExtraError(EXTRA_ITEM_ERROR_MESSAGE);
        showError(EXTRA_ITEM_ERROR_MESSAGE);
      });
  };

  useEffect(() => {
    if (!restaurant.id) {
      setError('Restaurante não configurado.');
      return;
    }

    getDishesForRestaurant(restaurant.id)
      .then(data => setDishes(data))
      .catch(() => setError('Não foi possível carregar o cardápio.'));
  }, [restaurant.id]);

  useEffect(() => {
    loadExtraItems();
  }, [restaurant.id]);

  useEffect(() => {
    setCategories([...new Set(dishes.map(d => categoryLabel(d.category)))]);
  }, [dishes]);

  const filtered = dishes.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === '' || categoryLabel(d.category) === category;
    return matchSearch && matchCategory;
  });
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentPageItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  useEffect(() => {
    setCurrentPage(page => Math.min(page, Math.max(totalPages, 1)));
  }, [totalPages]);

  const toggleAvailability = (id: string) => {
    const next = dishes.find(d => d.id === id);
    if (!next) return;
    const nextAvailable = !next.available;

    setDishes(prev => prev.map(d => d.id === id ? { ...d, available: nextAvailable } : d));
    (nextAvailable ? enableDish(id) : disableDish(id))
      .then(() => {
        showSuccess(nextAvailable ? 'Prato disponibilizado com sucesso.' : 'Prato removido do buffet.');
      })
      .catch(() => {
        setDishes(current => current.map(d => d.id === id ? { ...d, available: next.available } : d));
        showError('Erro ao atualizar disponibilidade do prato.');
      });
  };

  const deleteDish = (id: string) => {
    const next = dishes.find(d => d.id === id);
    if (!next) return;

    setDishes(prev => prev.filter(d => d.id !== id));
    deleteDishRequest(id)
      .then(() => showSuccess('Prato excluído com sucesso.'))
      .catch(() => {
        setDishes(current => [...current, next]);
        showError('Erro ao excluir prato.');
      });
  };

  const deleteExtraItem = (id: string) => {
    const next = extraItems.find(item => item.id === id);
    if (!next) return;

    setExtraItems(prev => prev.filter(item => item.id !== id));
    deleteExtraItemRequest(id)
      .then(() => showSuccess('Item extra excluído com sucesso.'))
      .catch(() => {
        setExtraItems(current => [...current, next]);
        showError(EXTRA_ITEM_ERROR_MESSAGE);
      });
  };

  const openCreateExtraForm = () => {
    setEditingExtraId(null);
    setExtraForm(EMPTY_EXTRA_FORM);
    setIsExtraFormOpen(true);
  };

  const openEditExtraForm = (item: ExtraItem) => {
    setEditingExtraId(item.id);
    setExtraForm({
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      salePrice: String(item.salePrice),
      available: item.available,
    });
    setIsExtraFormOpen(true);
  };

  const closeExtraForm = () => {
    setIsExtraFormOpen(false);
    setEditingExtraId(null);
    setExtraForm(EMPTY_EXTRA_FORM);
  };

  const updateExtraForm = (field: keyof ExtraItemForm, value: string | boolean) => {
    setExtraForm(prev => ({ ...prev, [field]: value }));
  };

  const saveExtraItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const salePrice = Number(extraForm.salePrice);
    if (!restaurant.id || !extraForm.name.trim() || Number.isNaN(salePrice)) return;

    const payload = {
      name: extraForm.name.trim(),
      description: extraForm.description.trim(),
      imageUrl: extraForm.imageUrl.trim(),
      salePrice,
      available: extraForm.available,
    };

    if (editingExtraId) {
      updateExtraItem(editingExtraId, payload)
        .then(() => loadExtraItems())
        .then(() => {
          showSuccess('Item extra atualizado com sucesso.');
          closeExtraForm();
        })
        .catch(() => showError(EXTRA_ITEM_ERROR_MESSAGE));
      return;
    }

    createExtraItem(restaurant.id, payload)
      .then(() => loadExtraItems())
      .then(() => {
        showSuccess('Item extra criado com sucesso.');
        closeExtraForm();
      })
      .catch(() => showError(EXTRA_ITEM_ERROR_MESSAGE));
  };

  const toggleExtraAvailability = (id: string) => {
    const next = extraItems.find(item => item.id === id);
    if (!next) return;
    const nextAvailable = !next.available;

    setExtraItems(prev => prev.map(item => (
      item.id === id ? { ...item, available: nextAvailable } : item
    )));
    (nextAvailable ? enableExtraItem(id) : disableExtraItem(id))
      .then(() => {
        showSuccess(nextAvailable ? 'Item extra disponibilizado.' : 'Item extra indisponibilizado.');
      })
      .catch(() => {
        setExtraItems(current => current.map(item => (
          item.id === id ? { ...item, available: next.available } : item
        )));
        showError(EXTRA_ITEM_ERROR_MESSAGE);
      });
  };

  const isExtraFormValid = extraForm.name.trim() !== '' && !Number.isNaN(Number(extraForm.salePrice));

  return (
    <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <AdminPageHeader
          title="Gerenciamento de Cardápio"
          subtitle={`${dishes.length} pratos cadastrados · ${dishes.filter(d => d.available).length} disponíveis`}
          action={activeTab === 'buffet' && (
            <PrimaryButton text="+ Adicionar prato" onClick={() => navigate(ROUTES.ADMIN_CARDAPIO_FORM)} />
          )}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #EAE4DF' }}>
          {[
            { id: 'buffet', label: 'Pratos do buffet' },
            { id: 'extras', label: 'Bebidas e extras' },
          ].map(tab => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'buffet' | 'extras')}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: selected ? '2px solid #C9623A' : '2px solid transparent',
                  color: selected ? '#C9623A' : '#6B7280',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '0 4px 12px',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'buffet' ? (
          <BuffetDishesTab
            dishes={dishes}
            currentPageItems={currentPageItems}
            categories={categories}
            search={search}
            category={category}
            error={error}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            categoryLabel={categoryLabel}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onPageChange={setCurrentPage}
            onToggleAvailability={toggleAvailability}
            onDelete={deleteDish}
          />
        ) : (
          <ExtraItemsTab
            extraItems={extraItems}
            extraError={extraError}
            onCreate={openCreateExtraForm}
            onEdit={openEditExtraForm}
            onDelete={deleteExtraItem}
            onToggleAvailability={toggleExtraAvailability}
          />
        )}

        {isExtraFormOpen && (
          <ExtraItemFormModal
            editingExtraId={editingExtraId}
            extraForm={extraForm}
            isValid={isExtraFormValid}
            onClose={closeExtraForm}
            onSubmit={saveExtraItem}
            onChange={updateExtraForm}
          />
        )}
      </div>
    </main>
  );
}
