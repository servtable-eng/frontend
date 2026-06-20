import { Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@workspace/ui';
import type { ExtraItem } from '@/types/extra';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AvailabilityToggle, ErrorState, ImageCell } from '@/components/admin/AdminShared';

type ExtraItemsTabProps = {
  extraItems: ExtraItem[];
  extraError: string;
  onCreate: () => void;
  onEdit: (item: ExtraItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
};

export function ExtraItemsTab({
  extraItems,
  extraError,
  onCreate,
  onEdit,
  onDelete,
  onToggleAvailability,
}: ExtraItemsTabProps) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '16px 20px', borderRadius: 12, border: '1px solid #EAE4DF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge variant="success" dot>{extraItems.filter(item => item.available).length} disponiveis</Badge>
          <Badge variant="secondary" dot>{extraItems.filter(item => !item.available).length} indisponiveis</Badge>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <PrimaryButton text="+ Novo item extra" onClick={onCreate} />
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #EAE4DF', borderRadius: 12, overflow: 'hidden' }}>
        <ErrorState message={extraError} />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #EAE4DF' }}>
              {['Imagem', 'Nome', 'Descricao', 'Preco de venda', 'Disponibilidade', 'Acoes'].map(col => (
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
            {extraItems.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                  Nenhum item extra encontrado.
                </td>
              </tr>
            ) : (
              extraItems.map((item, i) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: i === extraItems.length - 1 ? 'none' : '1px solid #EAE4DF',
                    background: i % 2 === 0 ? '#fff' : '#FAFAF9',
                  }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <ImageCell src={item.imageUrl} alt={item.name} />
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1F2937' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#6B7280', maxWidth: 280 }}>
                    {item.description}
                  </td>
                  <td style={{ padding: '14px 20px', color: '#6B7280' }}>
                    R$ {item.salePrice.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 150 }}>
                      <AvailabilityToggle
                        checked={item.available}
                        onChange={() => onToggleAvailability(item.id)}
                      />
                      <span style={{ width: 88, fontSize: 13, color: item.available ? '#15803D' : '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {item.available ? 'Disponivel' : 'Indisponivel'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        title="Editar"
                        onClick={() => onEdit(item)}
                        style={{
                          background: 'none', border: '1px solid #EAE4DF', borderRadius: 7,
                          padding: '6px 8px', cursor: 'pointer', color: '#6B7280',
                          display: 'flex', alignItems: 'center', transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#C9623A')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        title="Excluir"
                        onClick={() => onDelete(item.id)}
                        style={{
                          background: 'none', border: '1px solid #EAE4DF', borderRadius: 7,
                          padding: '6px 8px', cursor: 'pointer', color: '#6B7280',
                          display: 'flex', alignItems: 'center', transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
