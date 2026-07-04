import type { Dispatch, SetStateAction } from 'react';
import { CheckCircle2, Minus, Pencil, Plus, Trash2 } from 'lucide-react';
import type { ExtraDto } from '@/types/extra';
import { brl, customerFont, ImgSafe, InlineErrorState } from './CustomerShared';

export type PlateReviewItem = { id: string; name: string; image: string; portion: string; note: string };

function QtyControl({ qty, onInc, onDec, price }: { qty: number; onInc: () => void; onDec: () => void; price: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 10 }}>
      <span style={{ minWidth: 50, whiteSpace: 'nowrap', fontSize: 13, fontWeight: 700, color: '#C9623A' }}>{brl(price)}</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, flexShrink: 0 }}>
        <button
          type="button"
          onClick={onDec}
          style={{ width: 30, height: 30, minWidth: 30, borderRadius: 8, border: '1.5px solid #EAE4DF', background: qty > 0 ? '#fff' : '#F8F6F4', cursor: qty > 0 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
        >
          <Minus size={13} color={qty > 0 ? '#374151' : '#D1C9C2'} />
        </button>
        <span style={{ width: 18, minWidth: 18, textAlign: 'center', fontSize: 14, fontWeight: 700, lineHeight: '30px', color: qty > 0 ? '#1F2937' : '#9CA3AF' }}>
          {qty}
        </span>
        <button
          type="button"
          onClick={onInc}
          style={{ width: 30, height: 30, minWidth: 30, borderRadius: 8, border: 'none', background: '#C9623A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
        >
          <Plus size={13} color="#fff" />
        </button>
      </div>
    </div>
  );
}

export function ExtraItemCard({ item, qty, onInc, onDec }: { item: ExtraDto; qty: number; onInc: () => void; onDec: () => void }) {
  return (
    <div style={{
      flex: '0 0 170px', width: 170, minWidth: 170, borderRadius: 14,
      border: `1.5px solid ${qty > 0 ? '#C9623A' : '#EAE4DF'}`,
      background: '#fff', padding: 12, boxSizing: 'border-box',
      boxShadow: qty > 0 ? '0 0 0 3px rgba(201,98,58,0.10)' : undefined,
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <ImgSafe src={item.imageUrl} alt={item.name} style={{ width: 46, height: 46, borderRadius: 10 }} size={20} />
      </div>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#1F2937', textAlign: 'center', lineHeight: 1.25, minHeight: 32, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {item.name}
      </p>
      {qty > 0 && (
        <div style={{ marginTop: 4, textAlign: 'center' }}>
          <span style={{ fontSize: 8, color: '#C9623A', fontWeight: 600, background: '#FDF5F2', padding: '2px 8px', borderRadius: 99 }}>{qty}Ã—</span>
        </div>
      )}
      <QtyControl qty={qty} onInc={onInc} onDec={onDec} price={item.salePrice} />
    </div>
  );
}

export function PlateReviewItemCard({
  item,
  onEdit,
  onRemove,
}: {
  item: PlateReviewItem;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #EAE4DF', marginBottom: 8, padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <ImgSafe src={item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: 10, flexShrink: 0 }} size={20} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1F2937', lineHeight: 1.2 }}>{item.name}</p>
        <span style={{ display: 'inline-block', marginTop: 4, padding: '3px 9px', borderRadius: 99, background: '#F0EDE9', fontSize: 11, fontWeight: 600, color: '#C9623A' }}>
          {item.portion}
        </span>
        {item.note && (
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6B7280', fontStyle: 'italic' }}>
            "{item.note}"
          </p>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          type="button"
          onClick={onEdit}
          style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #EAE4DF', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Pencil size={13} color="#6B7280" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          style={{ width: 30, height: 30, borderRadius: 8, border: '1.5px solid #FEE2E2', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Trash2 size={13} color="#EF4444" />
        </button>
      </div>
    </div>
  );
}

export function BuffetSubtotalCard({ subtotal, pricePer100g, totalWeightInGrams }: { subtotal: number; pricePer100g: number; totalWeightInGrams: number }) {
  return (
    <div style={{ margin: '12px 14px 0', background: '#fff', borderRadius: 14, border: '1.5px solid #EAE4DF', padding: '14px 16px' }}>
      <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Subtotal buffet
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'Peso estimado', value: `${totalWeightInGrams} g` },
          { label: 'R$ / 100g', value: brl(pricePer100g) },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#6B7280' }}>{r.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{r.value}</span>
          </div>
        ))}
        <div style={{ height: 1, background: '#F0EDE9', margin: '2px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>Subtotal</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#C9623A' }}>{brl(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}

export function ExtrasScroller({
  title,
  items,
  quantities,
  isLoading,
  error,
  onAdjust,
}: {
  title: string;
  items: ExtraDto[];
  quantities: Record<string, number>;
  isLoading?: boolean;
  error?: string;
  onAdjust: Dispatch<SetStateAction<Record<string, number>>>;
}) {
  const adjust = (id: string, delta: number) =>
    onAdjust(prev => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      if (next === 0) { const { [id]: _, ...rest } = prev; return rest; }
      return { ...prev, [id]: next };
    });

  return (
    <div style={{ padding: '18px 0 0' }}>
      <p style={{ margin: '0 14px 10px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </p>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 14px 4px', scrollbarWidth: 'none' }}>
        {isLoading && (
          <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>Carregando extras...</p>
        )}
        {!isLoading && error && <InlineErrorState message={error} />}
        {!isLoading && !error && items.map(e => (
          <ExtraItemCard
            key={e.id}
            item={e}
            qty={quantities[e.id] ?? 0}
            onInc={() => adjust(e.id, +1)}
            onDec={() => adjust(e.id, -1)}
          />
        ))}
      </div>
    </div>
  );
}

export function PlateReviewBottomBar({
  buffetSubtotal,
  extrasTotal,
  total,
  placed,
  isSending,
  submitLabel = 'Finalizar pedido',
  sendingLabel = 'Enviando...',
  placedLabel = 'Pedido enviado!',
  onSubmit,
}: {
  buffetSubtotal: number;
  extrasTotal: number;
  total: number;
  placed: boolean;
  isSending: boolean;
  submitLabel?: string;
  sendingLabel?: string;
  placedLabel?: string;
  onSubmit: () => void;
}) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: 390, margin: '0 auto',
      background: '#fff', borderTop: '1px solid #EAE4DF', padding: '12px 16px', zIndex: 20,
      boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Buffet</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>{brl(buffetSubtotal)}</span>
        </div>
        {extrasTotal > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>Bebidas &amp; Extras</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>{brl(extrasTotal)}</span>
          </div>
        )}
        <div style={{ height: 1, background: '#EAE4DF', margin: '2px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>Total</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', letterSpacing: '-0.01em' }}>{brl(total)}</span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSending}
        style={{
          width: '100%', padding: '15px', borderRadius: 14, border: 'none',
          background: placed ? '#15803D' : '#C9623A',
          color: '#fff', fontSize: 15, fontWeight: 700, cursor: isSending ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: customerFont, transition: 'background 0.2s',
        }}
      >
        {isSending
          ? sendingLabel
          : placed
          ? <><CheckCircle2 size={18} /> {placedLabel}</>
          : submitLabel}
      </button>
    </div>
  );
}
