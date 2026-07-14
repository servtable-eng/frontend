import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { ClientDishDto } from '@/types/dish';
import { brl, customerFont, ImgSafe } from './CustomerShared';

export function PlateDishCard({
  item,
  portionWeightInGrams,
  hasConfirmedWeight,
  note,
  price,
  onSetPortionWeight,
  onSetNote,
  onRemove,
}: {
  item: ClientDishDto;
  portionWeightInGrams: number;
  hasConfirmedWeight: boolean;
  note: string;
  price: number;
  onSetPortionWeight: (portionWeightInGrams: number) => void;
  onSetNote: (note: string) => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #EAE4DF', marginBottom: 12, overflow: 'hidden' }}>
      <div className="customer-item-heading" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px 0' }}>
        <ImgSafe src={item.imageUrl} alt={item.name} style={{ width: 68, height: 68, borderRadius: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1F2937', lineHeight: 1.2 }}>{item.name}</p>
          <p style={{ margin: '2px 0 6px', fontSize: 11, color: '#9CA3AF' }}>{item.description}</p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#C9623A' }}>{brl(price)}</p>
        </div>
        <div className="customer-item-actions" style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            onClick={onRemove}
            style={{ width: 44, height: 44, borderRadius: 8, border: '1px solid #FEE2E2', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Trash2 size={15} color="#EF4444" />
          </button>
        </div>
      </div>

      <div style={{ height: 1, background: '#F3F0ED', margin: '10px 14px 10px' }} />

      <div style={{ padding: '0 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Peso da porção</p>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#C9623A' }}>{portionWeightInGrams} g</span>
        </div>
        <input
          type="range"
          min={25}
          max={1000}
          step={25}
          value={portionWeightInGrams}
          onChange={event => onSetPortionWeight(Number(event.target.value))}
          style={{ width: '100%', accentColor: '#C9623A', cursor: 'pointer' }}
        />
        <p style={{ margin: '5px 0 10px', fontSize: 11, color: hasConfirmedWeight ? '#6B7280' : '#B85632', lineHeight: 1.35 }}>
          Sugestão do restaurante. Ajuste conforme desejar.
        </p>
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

function formatWeight(weightInGrams: number) {
  if (weightInGrams < 1000) {
    return `${weightInGrams} g`;
  }

  return `${(weightInGrams / 1000).toFixed(3)} kg`;
}

export function PlateBuilderSummary({ itemCount, totalWeight, pricePer100g, totalPrice }: { itemCount: number; totalWeight: number; pricePer100g: number; totalPrice: number }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #EAE4DF', padding: '16px', marginBottom: 14, boxShadow: '0 2px 10px rgba(31,41,55,0.04)' }}>
      <p style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: '#1F2937' }}>Meu prato</p>

      <div className="customer-summary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div style={{ borderRadius: 12, background: '#F8F6F4', border: '1px solid #EAE4DF', padding: '12px' }}>
          <p style={{ margin: '0 0 5px', fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Peso total</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#1F2937', lineHeight: 1, letterSpacing: 0 }}>
            {formatWeight(totalWeight)}
          </p>
        </div>

        <div style={{ borderRadius: 12, background: '#FDF5F2', border: '1px solid #F0D2C4', padding: '12px' }}>
          <p style={{ margin: '0 0 5px', fontSize: 11, fontWeight: 700, color: '#B85632', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Valor estimado</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#C9623A', lineHeight: 1, letterSpacing: 0 }}>
            {brl(totalPrice)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {[
          { label: 'Itens selecionados', value: `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}` },
          { label: 'Preço por 100g', value: brl(pricePer100g) },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{row.value}</span>
          </div>
        ))}
        <div style={{ height: 1, background: '#EAE4DF', margin: '2px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#1F2937' }}>Subtotal</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#C9623A' }}>{brl(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}

export function PlateBuilderBottomBar({ totalPrice, confirmed, canContinue, onContinue }: { totalPrice: number; confirmed: boolean; canContinue: boolean; onContinue: () => void }) {
  return (
    <div className="customer-bottom-bar customer-bottom-summary" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: 720, margin: '0 auto', background: '#fff', borderTop: '1px solid #EAE4DF', padding: '12px 16px', zIndex: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF', lineHeight: 1 }}>Total</p>
        <p style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color: '#1F2937', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {brl(totalPrice)}
        </p>
      </div>
      <button
        onClick={onContinue}
        disabled={!canContinue}
        style={{
          flex: '0 0 auto', padding: '14px 28px', borderRadius: 14, border: 'none',
          background: !canContinue ? '#B8A59A' : confirmed ? '#15803D' : '#C9623A',
          color: '#fff', fontSize: 15, fontWeight: 700, cursor: canContinue ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', gap: 7, fontFamily: customerFont,
          transition: 'background 0.2s',
        }}
      >
        {confirmed ? 'Confirmado' : <>Continuar <ChevronRight size={17} /></>}
      </button>
    </div>
  );
}
