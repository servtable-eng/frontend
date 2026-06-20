import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { ClientDishDto } from '@/types/dish';
import type { PortionSize } from '@/types/order';
import { brl, customerFont, ImgSafe } from './CustomerShared';

export function PlateDishCard({
  item,
  portion,
  note,
  price,
  portionWeights,
  portionLabels,
  portions,
  onSetPortion,
  onSetNote,
  onRemove,
}: {
  item: ClientDishDto;
  portion: PortionSize;
  note: string;
  price: number;
  portionWeights: Record<PortionSize, number>;
  portionLabels: Record<PortionSize, string>;
  portions: PortionSize[];
  onSetPortion: (portion: PortionSize) => void;
  onSetNote: (note: string) => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #EAE4DF', marginBottom: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px 0' }}>
        <ImgSafe src={item.imageUrl} alt={item.name} style={{ width: 68, height: 68, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1F2937', lineHeight: 1.2 }}>{item.name}</p>
          <p style={{ margin: '2px 0 6px', fontSize: 11, color: '#9CA3AF' }}>{item.description}</p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#C9623A' }}>{brl(price)}</p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {/* <button
            type="button"
            onClick={onEdit}
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #EAE4DF', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Pencil size={14} color="#6B7280" />
          </button> */}
          <button
            type="button"
            onClick={onRemove}
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #FEE2E2', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Trash2 size={15} color="#EF4444" />
          </button>
        </div>
      </div>

      <div style={{ height: 1, background: '#F3F0ED', margin: '10px 14px 10px' }} />

      <div style={{ padding: '0 14px' }}>
        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Porção</p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {portions.map(p => {
            const active = portion === p;
            return (
              <button
                key={p}
                onClick={() => onSetPortion(p)}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none',
                  background: active ? '#C9623A' : '#F0EDE9',
                  color: active ? '#fff' : '#374151',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: customerFont,
                  transition: 'all 0.15s',
                }}
              >
                <div>{portionLabels[p]}</div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>{portionWeights[p]}g</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 14px 14px' }}>
        <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Observação</p>
        <input
          type="text"
          value={note}
          onChange={e => onSetNote(e.target.value)}
          placeholder="Adicionar observação..."
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 12px', borderRadius: 10,
            border: '1.5px solid #EAE4DF', background: '#FAFAF9',
            fontSize: 13, color: '#1F2937', fontFamily: customerFont, outline: 'none',
          }}
        />
      </div>
    </div>
  );
}

export function AddMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: '100%', padding: '14px', borderRadius: 14,
      border: '1.5px dashed #D1C9C2', background: 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontSize: 14, fontWeight: 600, color: '#6B7280', cursor: 'pointer', fontFamily: customerFont,
      marginBottom: 14,
    }}>
      <Plus size={16} />
      Adicionar mais itens
    </button>
  );
}

export function PlateBuilderSummary({ itemCount, totalWeight, pricePer100g, totalPrice }: { itemCount: number; totalWeight: number; pricePer100g: number; totalPrice: number }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #EAE4DF', padding: '16px 16px', marginBottom: 8 }}>
      <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#1F2937' }}>Resumo do pedido</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Itens selecionados', value: `${itemCount} itens` },
          { label: 'Peso estimado', value: `~${totalWeight}g` },
          { label: 'Preço por 100g', value: brl(pricePer100g) },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{row.value}</span>
          </div>
        ))}
        <div style={{ height: 1, background: '#EAE4DF', margin: '2px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>Subtotal</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#C9623A' }}>{brl(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}

export function PlateBuilderBottomBar({ totalPrice, confirmed, onContinue }: { totalPrice: number; confirmed: boolean; onContinue: () => void }) {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: 390, margin: '0 auto', background: '#fff', borderTop: '1px solid #EAE4DF', padding: '12px 16px', zIndex: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF', lineHeight: 1 }}>Total</p>
        <p style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color: '#1F2937', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {brl(totalPrice)}
        </p>
      </div>
      <button
        onClick={onContinue}
        style={{
          flex: '0 0 auto', padding: '14px 28px', borderRadius: 14, border: 'none',
          background: confirmed ? '#15803D' : '#C9623A',
          color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7, fontFamily: customerFont,
          transition: 'background 0.2s',
        }}
      >
        {confirmed ? 'âœ“ Confirmado' : <>Continuar <ChevronRight size={17} /></>}
      </button>
    </div>
  );
}
