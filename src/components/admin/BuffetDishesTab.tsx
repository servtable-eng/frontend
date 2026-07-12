import type { ChangeEvent } from 'react';
import { Edit2, Plus, Scale, Trash2 } from 'lucide-react';
import { SearchInput, Select, Badge } from '@workspace/ui';
import type { RestaurantDishDto } from '@/types/dish';
import { AvailabilityToggle, ErrorState, ImageCell } from './AdminShared';

type BuffetDishesTabProps = {
  dishes: RestaurantDishDto[];
  currentPageItems: RestaurantDishDto[];
  categories: string[];
  search: string;
  category: string;
  error: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  categoryLabel: (category: string) => string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onToggleAvailability: (id: string) => void;
  onAddStock: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const STOCK_STATUS_LABELS: Record<string, string> = {
  NORMAL: 'Normal',
  LOW: 'Baixo',
  OUT_OF_STOCK: 'Esgotado',
};

function formatStockQuantity(value?: number | null) {
  const grams = typeof value === 'number' ? Math.max(value, 0) : 0;

  return `${grams} g`;
}

function getStockDisplay(dish: RestaurantDishDto) {
  const availableQuantityInGrams = dish.availableQuantityInGrams ?? 0;
  const lowStockThresholdInGrams = dish.lowStockThresholdInGrams ?? 0;
  const status = availableQuantityInGrams <= 0
    ? 'OUT_OF_STOCK'
    : availableQuantityInGrams <= lowStockThresholdInGrams
      ? 'LOW'
      : dish.stockStatus === 'LOW'
        ? 'LOW'
        : 'NORMAL';
  const label = STOCK_STATUS_LABELS[status] ?? status;
  const color = status === 'OUT_OF_STOCK' ? '#DC2626' : status === 'LOW' ? '#B45309' : '#15803D';
  const background = status === 'OUT_OF_STOCK' ? '#FEF2F2' : status === 'LOW' ? '#FFFBEB' : '#ECFDF5';

  return {
    label,
    color,
    background,
    quantity: formatStockQuantity(availableQuantityInGrams),
  };
}

function getAvailabilityDisplay(dish: RestaurantDishDto) {
  if (!dish.available) {
    return {
      checked: false,
      label: 'Indisponível',
      color: '#9CA3AF',
    };
  }

  return {
    checked: true,
    label: 'Disponível',
    color: '#15803D',
  };
}

export function BuffetDishesTab({
  dishes,
  currentPageItems,
  categories,
  search,
  category,
  error,
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
  categoryLabel,
  onSearchChange,
  onCategoryChange,
  onPageChange,
  onToggleAvailability,
  onAddStock,
  onEdit,
  onDelete,
}: BuffetDishesTabProps) {
  const availableDishesCount = dishes.filter(dish => getAvailabilityDisplay(dish).checked).length;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '16px 20px', borderRadius: 12, border: '1px solid #EAE4DF' }}>
        <div style={{ flex: 1, maxWidth: 320 }}>
          <SearchInput
            placeholder="Buscar prato..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          />
        </div>
        <div style={{ width: 220 }}>
          <Select
            options={categories.map(c => ({ value: c, label: c }))}
            value={category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value)}
          />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge variant="success" dot>{availableDishesCount} disponÃ­veis</Badge>
          <Badge variant="secondary" dot>{dishes.length - availableDishesCount} indisponÃ­veis</Badge>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EAE4DF', borderRadius: 12, overflow: 'hidden' }}>
        <ErrorState message={error} />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col style={{ width: 160, minWidth: 160 }} />
          </colgroup>
          <thead>
            <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #EAE4DF' }}>
              {['Imagem', 'Nome', 'Categoria', 'Disponibilidade', 'Estoque', 'Custo por kg', 'Posição da Cuba', 'Ações'].map(col => (
                <th key={col} style={{
                  padding: '12px 20px', textAlign: 'left',
                  fontSize: 11, fontWeight: 600, color: '#6B7280',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {totalItems === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                  Nenhum prato encontrado.
                </td>
              </tr>
            ) : (
              currentPageItems.map((dish, i) => {
                const stockDisplay = getStockDisplay(dish);
                const availabilityDisplay = getAvailabilityDisplay(dish);

                return (
                <tr
                  key={dish.id}
                  style={{
                    borderBottom: i === currentPageItems.length - 1 ? 'none' : '1px solid #EAE4DF',
                    background: i % 2 === 0 ? '#fff' : '#FAFAF9',
                  }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <ImageCell src={dish.imageUrl} alt={dish.name} />
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1F2937' }}>
                    {dish.name}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Badge variant="secondary">{categoryLabel(dish.category)}</Badge>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 150 }}>
                      <AvailabilityToggle
                        checked={availabilityDisplay.checked}
                        onChange={() => onToggleAvailability(dish.id)}
                      />
                      <span style={{ width: 88, fontSize: 13, color: availabilityDisplay.color, fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {availabilityDisplay.label}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4, minWidth: 96 }}>
                      <span style={{ width: 'fit-content', borderRadius: 999, padding: '3px 9px', background: stockDisplay.background, color: stockDisplay.color, fontSize: 12, fontWeight: 700 }}>
                        {stockDisplay.label}
                      </span>
                      <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
                        {stockDisplay.quantity}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#6B7280' }}>
                    R$ {dish.costPerKg.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#6B7280' }}>
                    <span style={{ background: '#F3F0ED', color: '#C9623A', fontWeight: 600, fontSize: 12, padding: '4px 10px', borderRadius: 6 }}>
                      Cuba {dish.buffetPosition}
                    </span>
                  </td>
                  <td style={{ width: 160, minWidth: 160, padding: '14px 20px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'nowrap' }}>
                      <button
                        title="Editar"
                        onClick={() => onEdit(dish.id)}
                        style={{
                          width: 44, height: 44, background: 'none', border: '1px solid #EAE4DF', borderRadius: 7,
                          padding: 0, cursor: 'pointer', color: '#6B7280',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C9623A')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        title="Adicionar estoque"
                        aria-label="Adicionar estoque"
                        onClick={() => onAddStock(dish.id)}
                        style={{
                          width: 44, height: 44, background: 'none', border: '1px solid #EAE4DF', borderRadius: 7,
                          padding: 0, cursor: 'pointer', color: '#6B7280',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s',
                          position: 'relative',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C9623A')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                      >
                        <Scale size={16} />
                        <Plus size={9} style={{ position: 'absolute', right: 9, top: 9, strokeWidth: 3 }} />
                      </button>
                      <button
                        title="Excluir"
                        aria-label="Excluir"
                        onClick={() => onDelete(dish.id)}
                        style={{
                          width: 44, height: 44, background: 'none', border: '1px solid #EAE4DF', borderRadius: 7,
                          padding: 0, cursor: 'pointer', color: '#6B7280',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div style={{ padding: '12px 20px', borderTop: '1px solid #EAE4DF', background: '#FAFAF9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            Exibindo {currentPageItems.length} de {totalItems} pratos
          </span>
          {totalItems > itemsPerPage && (
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(p => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  style={{
                    width: 30, height: 30, borderRadius: 6, border: '1px solid #EAE4DF',
                    background: p === currentPage ? '#C9623A' : '#fff',
                    color: p === currentPage ? '#fff' : '#6B7280',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
