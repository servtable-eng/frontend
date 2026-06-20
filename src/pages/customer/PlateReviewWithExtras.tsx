import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '@/components/ToastProvider';
import { useCustomerCart } from '@/contexts/CustomerCartContext';
import { useCustomerPlate } from '@/contexts/CustomerPlateContext';
import type { PlateReviewState, PortionSize } from '@/types/order';
import { ROUTES } from '@/routes/routeConstants';
import {
  BuffetSubtotalCard,
  PlateReviewBottomBar,
  PlateReviewItemCard,
  type PlateReviewItem,
} from '@/components/customer/PlateReviewComponents';
import { customerFont, MobilePageHeader } from '@/components/customer/CustomerShared';
import '../../styles/tokens.css';

type PlateItem = PlateReviewItem & { portionSize: PortionSize };

const PORTION_LABELS: Record<PortionSize, string> = {
  SMALL: 'Pequena - 150g',
  MEDIUM: 'Media - 250g',
  LARGE: 'Grande - 350g',
};

const INITIAL_PLATE: PlateItem[] = [
  { id: 'p1', name: 'Frango Grelhado', image: '/__mockup/images/frango.png', portion: 'Media 250g', portionSize: 'MEDIUM', note: 'Sem cebola' },
  { id: 'p2', name: 'Arroz Branco', image: '/__mockup/images/arroz-feijao.png', portion: 'Pequena 100g', portionSize: 'SMALL', note: '' },
  { id: 'p3', name: 'Salada Caesar', image: '/__mockup/images/salada.png', portion: 'Media 100g', portionSize: 'MEDIUM', note: 'Pouco molho' },
];

const BUFFET_SUBTOTAL = 40.46;

export function PlateReviewWithExtras() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addPlateToCart, cartPlates, updateCartPlate } = useCustomerCart();
  const { plateItems, removePlateItem, clearPlate } = useCustomerPlate();
  const reviewState = location.state as PlateReviewState | null;
  const currentCartPlate = reviewState?.cartPlateId
    ? cartPlates.find(cartPlate => cartPlate.id === reviewState.cartPlateId)
    : null;

  const plateFromContext: PlateItem[] = plateItems.map(item => ({
    id: item.dishId,
    name: item.name,
    image: item.imageUrl,
    portion: PORTION_LABELS[item.portionSize],
    portionSize: item.portionSize,
    note: item.observation,
  }));
  const plateFromRouteState: PlateItem[] = reviewState?.items?.map(item => ({
    id: item.dishId,
    name: item.dishName,
    image: item.imageUrl,
    portion: PORTION_LABELS[item.portion],
    portionSize: item.portion,
    note: item.observation,
  })) ?? [];
  const plate = plateFromContext.length > 0 ? plateFromContext : plateFromRouteState.length > 0 ? plateFromRouteState : INITIAL_PLATE;
  const [placed, setPlaced] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const selectedExtras = currentCartPlate?.extras ?? [];
  const extrasTotal = currentCartPlate?.extrasSubtotal ?? 0;
  const total = BUFFET_SUBTOTAL + extrasTotal;

  const submitOrder = () => {
    if (isSending) {
      return;
    }

    setIsSending(true);

    try {
      const cartPlateItems = plateItems.length > 0
        ? plateItems
        : plate.map(item => ({
          dishId: item.id,
          name: item.name,
          description: '',
          imageUrl: item.image,
          portionSize: item.portionSize,
          observation: item.note,
          quantity: 1,
        }));

      if (cartPlateItems.length === 0) {
        showError('Adicione itens ao prato antes de continuar.');
        return;
      }

      const cartPlate = {
        plateItems: cartPlateItems,
        extras: selectedExtras,
        buffetSubtotal: BUFFET_SUBTOTAL,
        extrasSubtotal: extrasTotal,
        total,
      };

      if (reviewState?.cartPlateId) {
        updateCartPlate(reviewState.cartPlateId, cartPlate);
      } else {
        addPlateToCart(cartPlate);
      }

      clearPlate();
      setPlaced(true);
      showSuccess(reviewState?.cartPlateId ? 'Prato atualizado no carrinho.' : 'Prato adicionado ao carrinho.');
      navigate(ROUTES.CUSTOMER_CART);
    } catch {
      showError('Erro ao adicionar prato ao carrinho.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ height: '100svh', maxWidth: 390, margin: '0 auto', display: 'flex', flexDirection: 'column', background: '#F8F6F4', fontFamily: customerFont, overflow: 'hidden' }}>
      <MobilePageHeader
        title="Meu prato"
        subtitle="Revise seu pedido"
        badge={(
          <span style={{ fontSize: 13, fontWeight: 600, color: '#C9623A', background: '#FDF5F2', padding: '4px 10px', borderRadius: 8 }}>
            {plate.length} {plate.length === 1 ? 'item' : 'itens'}
          </span>
        )}
      />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 130 }}>
        <div style={{ padding: '16px 14px 0' }}>
          <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Prato personalizado
          </p>

          {plate.length === 0 && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1.5px dashed #EAE4DF', padding: '24px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>Nenhum item no prato</p>
            </div>
          )}

          {plate.map(item => (
            <PlateReviewItemCard
              key={item.id}
              item={item}
              onRemove={() => removePlateItem(item.id)}
            />
          ))}
        </div>

        <BuffetSubtotalCard subtotal={BUFFET_SUBTOTAL} />

        <div style={{ height: 8 }} />
      </div>

      <PlateReviewBottomBar
        buffetSubtotal={BUFFET_SUBTOTAL}
        extrasTotal={extrasTotal}
        total={total}
        placed={placed}
        isSending={isSending}
        submitLabel="Adicionar ao carrinho"
        sendingLabel="Adicionando..."
        placedLabel="Prato adicionado!"
        onSubmit={submitOrder}
      />
    </div>
  );
}

export default PlateReviewWithExtras;
