import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '@workspace/ui/styles.css';
import { addDishStock, deleteDish, disableDish, enableDish, getDishesForRestaurant } from '@/services/dishes/dish.service';
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
import { ROUTES, adminDishFormPath } from '@/routes/routeConstants';

const ITEMS_PER_PAGE = 10;
const EMPTY_EXTRA_FORM: ExtraItemForm = {
  name: '',
  description: '',
  imageUrl: '',
  salePrice: '',
  available: true,
};
const EXTRA_ITEM_ERROR_MESSAGE = 'Erro ao atualizar item extra.';
const EMPTY_STOCK_FORM = {
  availableQuantityInGrams: 0,
  lowStockThresholdInGrams: 0,
};
const ADD_STOCK_MESSAGE = 'Informe uma quantidade maior que zero.';
const STOCK_AVAILABLE_MESSAGE = 'Informe uma quantidade disponível maior que zero.';
const STOCK_THRESHOLD_MESSAGE = 'O alerta de estoque baixo deve ser menor que a quantidade disponível.';

const categoryLabel = (category: string) => category.replaceAll('_', ' ');
const toExtraItem = (item: ExtraItemResponse): ExtraItem => ({
  ...item,
  available: item.available ?? true,
});

function parseWeightInputToGrams(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

function getStockValidationMessage(availableQuantityInGrams: number, lowStockThresholdInGrams: number) {
  if (availableQuantityInGrams <= 0) return STOCK_AVAILABLE_MESSAGE;
  if (lowStockThresholdInGrams <= 0) return STOCK_AVAILABLE_MESSAGE;
  if (lowStockThresholdInGrams >= availableQuantityInGrams) return STOCK_THRESHOLD_MESSAGE;

  return '';
}

function getStockStatusFromQuantities(availableQuantityInGrams: number, lowStockThresholdInGrams: number) {
  if (availableQuantityInGrams <= 0) return 'OUT_OF_STOCK';
  if (availableQuantityInGrams <= lowStockThresholdInGrams) return 'LOW';
  return 'NORMAL';
}

function isDishAvailableForSale(dish: RestaurantDishDto) {
  return dish.available && (dish.availableQuantityInGrams ?? 0) > 0;
}

function WeightGramsInput({
  valueInGrams,
  onChange,
}: {
  valueInGrams: number;
  onChange: (valueInGrams: number) => void;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        inputMode="numeric"
        value={Math.max(valueInGrams, 0)}
        onChange={event => onChange(parseWeightInputToGrams(event.target.value))}
        style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #EAE4DF', borderRadius: 10, padding: '11px 42px 11px 12px', fontSize: 14, color: '#1F2937', background: '#FAFAF9', outline: 'none' }}
      />
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 13, fontWeight: 700, pointerEvents: 'none' }}>
        g
      </span>
    </div>
  );
}

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
  const [stockDishId, setStockDishId] = useState<string | null>(null);
  const [stockForm, setStockForm] = useState(EMPTY_STOCK_FORM);
  const [stockError, setStockError] = useState('');
  const [addStockDishId, setAddStockDishId] = useState<string | null>(null);
  const [stockQuantityToAddInGrams, setStockQuantityToAddInGrams] = useState(0);
  const [addStockError, setAddStockError] = useState('');
  const [deleteDishId, setDeleteDishId] = useState<string | null>(null);
  const [isDeletingDish, setIsDeletingDish] = useState(false);
  const [deleteDishError, setDeleteDishError] = useState('');
  const [deleteExtraItemId, setDeleteExtraItemId] = useState<string | null>(null);
  const [isDeletingExtraItem, setIsDeletingExtraItem] = useState(false);
  const [deleteExtraItemError, setDeleteExtraItemError] = useState('');

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
    const shouldEnable = !next.available;

    if (shouldEnable) {
      setStockDishId(id);
      setStockForm(EMPTY_STOCK_FORM);
      setStockError('');
      return;
    }

    setDishes(prev => prev.map(d => d.id === id ? { ...d, available: false } : d));
    disableDish(id)
      .then(updatedDish => {
        setDishes(prev => prev.map(d => (
          d.id === id ? { ...d, ...updatedDish, available: false } : d
        )));
        showSuccess('Prato indisponibilizado com sucesso.');
      })
      .catch(() => {
        setDishes(current => current.map(d => d.id === id ? next : d));
        showError('Erro ao atualizar disponibilidade do prato.');
      });
  };

  const closeStockModal = () => {
    setStockDishId(null);
    setStockForm(EMPTY_STOCK_FORM);
    setStockError('');
  };

  const openAddStockModal = (id: string) => {
    setAddStockDishId(id);
    setStockQuantityToAddInGrams(0);
    setAddStockError('');
  };

  const closeAddStockModal = () => {
    setAddStockDishId(null);
    setStockQuantityToAddInGrams(0);
    setAddStockError('');
  };

  const confirmEnableDish = () => {
    if (!stockDishId) return;

    const validationMessage = getStockValidationMessage(stockForm.availableQuantityInGrams, stockForm.lowStockThresholdInGrams);
    if (validationMessage) {
      setStockError(validationMessage);
      return;
    }

    const { availableQuantityInGrams, lowStockThresholdInGrams } = stockForm;

    const currentDish = dishes.find(dish => dish.id === stockDishId);
    if (!currentDish) return;
    const nextStockStatus = getStockStatusFromQuantities(availableQuantityInGrams, lowStockThresholdInGrams);

    setDishes(prev => prev.map(dish => (
      dish.id === stockDishId
        ? { ...dish, available: true, availableQuantityInGrams, lowStockThresholdInGrams, stockStatus: nextStockStatus }
        : dish
    )));

    enableDish(stockDishId, { available: true, availableQuantityInGrams, lowStockThresholdInGrams })
      .then(updatedDish => {
        setDishes(prev => prev.map(dish => (
          dish.id === updatedDish.id
            ? {
                ...dish,
                ...updatedDish,
                available: true,
                availableQuantityInGrams,
                lowStockThresholdInGrams,
                stockStatus: getStockStatusFromQuantities(availableQuantityInGrams, lowStockThresholdInGrams),
              }
            : dish
        )));
        showSuccess('Prato disponibilizado com sucesso.');
        closeStockModal();
      })
      .catch(() => {
        setDishes(prev => prev.map(dish => (
          dish.id === currentDish.id ? currentDish : dish
        )));
        showError('Erro ao atualizar disponibilidade do prato.');
      });
  };

  const confirmAddStock = () => {
    if (!restaurant.id || !addStockDishId) return;

    if (stockQuantityToAddInGrams <= 0) {
      setAddStockError(ADD_STOCK_MESSAGE);
      return;
    }

    const currentDish = dishes.find(dish => dish.id === addStockDishId);
    if (!currentDish) return;

    addDishStock(restaurant.id, addStockDishId, { quantityToAddInGrams: stockQuantityToAddInGrams })
      .then(updatedDish => {
        setDishes(prev => prev.map(dish => (
          dish.id === addStockDishId
            ? { ...dish, ...updatedDish, available: currentDish.available }
            : dish
        )));
        showSuccess('Estoque adicionado com sucesso.');
        closeAddStockModal();
      })
      .catch(() => {
        showError('Erro ao adicionar estoque.');
      });
  };

  const openDeleteDishModal = (id: string) => {
    setDeleteDishId(id);
    setDeleteDishError('');
  };

  const closeDeleteDishModal = () => {
    if (isDeletingDish) return;
    setDeleteDishId(null);
    setDeleteDishError('');
  };

  const confirmDeleteDish = () => {
    if (!deleteDishId) return;

    setIsDeletingDish(true);
    setDeleteDishError('');
    deleteDish(deleteDishId)
      .then(() => {
        setDishes(prev => prev.filter(dish => dish.id !== deleteDishId));
        showSuccess('Prato excluído com sucesso.');
        setDeleteDishId(null);
      })
      .catch(() => {
        setDeleteDishError('Não foi possível excluir o prato. Tente novamente.');
      })
      .finally(() => {
        setIsDeletingDish(false);
      });
  };

  const openDeleteExtraItemModal = (id: string) => {
    setDeleteExtraItemId(id);
    setDeleteExtraItemError('');
  };

  const closeDeleteExtraItemModal = () => {
    if (isDeletingExtraItem) return;
    setDeleteExtraItemId(null);
    setDeleteExtraItemError('');
  };

  const confirmDeleteExtraItem = () => {
    if (!deleteExtraItemId) return;

    setIsDeletingExtraItem(true);
    setDeleteExtraItemError('');
    deleteExtraItemRequest(deleteExtraItemId)
      .then(() => {
        setExtraItems(prev => prev.filter(item => item.id !== deleteExtraItemId));
        showSuccess('Item extra excluído com sucesso.');
        setDeleteExtraItemId(null);
      })
      .catch(() => {
        setDeleteExtraItemError('Não foi possível excluir o item extra. Tente novamente.');
      })
      .finally(() => {
        setIsDeletingExtraItem(false);
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
  const stockValidationMessage = getStockValidationMessage(stockForm.availableQuantityInGrams, stockForm.lowStockThresholdInGrams);
  const isStockFormValid = stockValidationMessage === '';
  const shouldShowStockValidation = stockForm.availableQuantityInGrams > 0 || stockForm.lowStockThresholdInGrams > 0;
  const visibleStockError = stockError || (shouldShowStockValidation ? stockValidationMessage : '');

  return (
    <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <AdminPageHeader
          title="Gerenciamento de Cardápio"
          subtitle={`${dishes.length} pratos cadastrados · ${dishes.filter(isDishAvailableForSale).length} disponíveis`}
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
            onAddStock={openAddStockModal}
            onEdit={dishId => navigate(adminDishFormPath(dishId))}
            onDelete={openDeleteDishModal}
          />
        ) : (
          <ExtraItemsTab
            extraItems={extraItems}
            extraError={extraError}
            onCreate={openCreateExtraForm}
            onEdit={openEditExtraForm}
            onDelete={openDeleteExtraItemModal}
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

        {deleteDishId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 12, border: '1px solid #EAE4DF', boxShadow: '0 20px 45px rgba(17, 24, 39, 0.22)', padding: 22 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1F2937' }}>
                Excluir prato
              </h2>
              <p style={{ margin: '10px 0 0', fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>
                Tem certeza que deseja excluir este prato? Esta ação removerá o prato do cardápio.
              </p>

              {deleteDishError && (
                <p style={{ margin: '12px 0 0', fontSize: 13, color: '#DC2626' }}>{deleteDishError}</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
                <button
                  type="button"
                  onClick={closeDeleteDishModal}
                  disabled={isDeletingDish}
                  style={{ border: '1px solid #EAE4DF', background: '#fff', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontWeight: 700, color: '#374151', cursor: isDeletingDish ? 'default' : 'pointer', opacity: isDeletingDish ? 0.7 : 1 }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteDish}
                  disabled={isDeletingDish}
                  style={{ border: 'none', background: isDeletingDish ? '#D1C9C2' : '#DC2626', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontWeight: 800, color: '#fff', cursor: isDeletingDish ? 'default' : 'pointer' }}
                >
                  {isDeletingDish ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteExtraItemId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 12, border: '1px solid #EAE4DF', boxShadow: '0 20px 45px rgba(17, 24, 39, 0.22)', padding: 22 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1F2937' }}>
                Excluir item extra
              </h2>
              <p style={{ margin: '10px 0 0', fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>
                Tem certeza que deseja excluir este item extra? Esta ação removerá o item do cardápio.
              </p>

              {deleteExtraItemError && (
                <p style={{ margin: '12px 0 0', fontSize: 13, color: '#DC2626' }}>{deleteExtraItemError}</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
                <button
                  type="button"
                  onClick={closeDeleteExtraItemModal}
                  disabled={isDeletingExtraItem}
                  style={{ border: '1px solid #EAE4DF', background: '#fff', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontWeight: 700, color: '#374151', cursor: isDeletingExtraItem ? 'default' : 'pointer', opacity: isDeletingExtraItem ? 0.7 : 1 }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteExtraItem}
                  disabled={isDeletingExtraItem}
                  style={{ border: 'none', background: isDeletingExtraItem ? '#D1C9C2' : '#DC2626', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontWeight: 800, color: '#fff', cursor: isDeletingExtraItem ? 'default' : 'pointer' }}
                >
                  {isDeletingExtraItem ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        )}

        {stockDishId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 12, border: '1px solid #EAE4DF', boxShadow: '0 20px 45px rgba(17, 24, 39, 0.22)', padding: 22 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1F2937' }}>
                Disponibilizar prato
              </h2>
              <p style={{ margin: '6px 0 18px', fontSize: 13, color: '#6B7280', lineHeight: 1.45 }}>
                Para disponibilizar o prato, informe a quantidade disponí­vel e o alerta de estoque baixo em gramas.
              </p>

              <div style={{ display: 'grid', gap: 14 }}>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Quantidade disponível</span>
                  <WeightGramsInput
                    valueInGrams={stockForm.availableQuantityInGrams}
                    onChange={valueInGrams => {
                      setStockForm(prev => ({ ...prev, availableQuantityInGrams: valueInGrams }));
                      setStockError('');
                    }}
                  />
                </label>

                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Alerta de estoque baixo</span>
                  <WeightGramsInput
                    valueInGrams={stockForm.lowStockThresholdInGrams}
                    onChange={valueInGrams => {
                      setStockForm(prev => ({ ...prev, lowStockThresholdInGrams: valueInGrams }));
                      setStockError('');
                    }}
                  />
                </label>
              </div>

              {visibleStockError && (
                <p style={{ margin: '12px 0 0', fontSize: 13, color: '#DC2626' }}>{visibleStockError}</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
                <button
                  type="button"
                  onClick={closeStockModal}
                  style={{ border: '1px solid #EAE4DF', background: '#fff', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontWeight: 700, color: '#374151', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmEnableDish}
                  disabled={!isStockFormValid}
                  style={{ border: 'none', background: isStockFormValid ? '#C9623A' : '#D1C9C2', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontWeight: 800, color: '#fff', cursor: isStockFormValid ? 'pointer' : 'default' }}
                >
                  Disponibilizar
                </button>
              </div>
            </div>
          </div>
        )}

        {addStockDishId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 12, border: '1px solid #EAE4DF', boxShadow: '0 20px 45px rgba(17, 24, 39, 0.22)', padding: 22 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1F2937' }}>
                Adicionar estoque
              </h2>
              <p style={{ margin: '6px 0 18px', fontSize: 13, color: '#6B7280', lineHeight: 1.45 }}>
                Informe a quantidade a adicionar ao estoque do prato.
              </p>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Quantidade a adicionar</span>
                <WeightGramsInput
                  valueInGrams={stockQuantityToAddInGrams}
                  onChange={valueInGrams => {
                    setStockQuantityToAddInGrams(valueInGrams);
                    setAddStockError('');
                  }}
                />
              </label>

              {addStockError && (
                <p style={{ margin: '12px 0 0', fontSize: 13, color: '#DC2626' }}>{addStockError}</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
                <button
                  type="button"
                  onClick={closeAddStockModal}
                  style={{ border: '1px solid #EAE4DF', background: '#fff', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontWeight: 700, color: '#374151', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmAddStock}
                  disabled={stockQuantityToAddInGrams <= 0}
                  style={{ border: 'none', background: stockQuantityToAddInGrams > 0 ? '#C9623A' : '#D1C9C2', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontWeight: 800, color: '#fff', cursor: stockQuantityToAddInGrams > 0 ? 'pointer' : 'default' }}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
