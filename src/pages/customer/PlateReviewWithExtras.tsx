import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '@/components/ToastProvider';
import { useCustomerCart } from '@/contexts/CustomerCartContext';
import { useCustomerPlate } from '@/contexts/CustomerPlateContext';
import type { PlateReviewState } from '@/types/order';
import { ROUTES } from '@/routes/routeConstants';
import {
  BuffetSubtotalCard,
  PlateReviewBottomBar,
  PlateReviewItemCard,
  type PlateReviewItem,
} from '@/components/customer/PlateReviewComponents';
import { customerFont, MobilePageHeader } from '@/components/customer/CustomerShared';
import type { CustomerPlateItem } from '@/contexts/CustomerPlateContext';
import { useRestaurantPricePer100g } from '@/hooks/useRestaurantPricePer100g';
import { calculatePlateBuffetSubtotal } from '@/utils/buffetPricing';
import '../../styles/tokens.css';

type PlateItem = PlateReviewItem & { dishId: string; portionWeightInGrams: number };

export function PlateReviewWithExtras() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pricePer100g } = useRestaurantPricePer100g();
  const { addPlateToCart, cartPlates, updateCartPlate } = useCustomerCart();
  const { plateItems, removePlateItem, loadPlate } = useCustomerPlate();
  const reviewState = location.state as PlateReviewState | null;
  const currentCartPlate = reviewState?.cartPlateId
    ? cartPlates.find(cartPlate => cartPlate.id === reviewState.cartPlateId)
    : null;

  const plateFromContext: PlateItem[] = plateItems.map(item => ({
    id: item.id,
    dishId: item.dishId,
    name: item.name,
    image: item.imageUrl,
    portion: `${item.portionWeightInGrams} g`,
    portionWeightInGrams: item.portionWeightInGrams,
    note: item.observation,
  }));
  const plateFromRouteState: PlateItem[] = reviewState?.items?.map((item, index) => ({
    id: `${item.dishId}-${index}`,
    dishId: item.dishId,
    name: item.dishName,
    image: item.imageUrl,
    portion: `${item.portionWeightInGrams} g`,
    portionWeightInGrams: item.portionWeightInGrams,
    note: item.observation,
  })) ?? [];
  const plate = plateFromContext.length > 0 ? plateFromContext : plateFromRouteState;
  const routePlateItems = useMemo<CustomerPlateItem[]>(() => plateFromRouteState.map(item => ({
    id: item.id,
    dishId: item.dishId,
    name: item.name,
    description: '',
    imageUrl: item.image,
    portionWeightInGrams: item.portionWeightInGrams,
    hasConfirmedWeight: true,
    observation: item.note,
    quantity: 1,
  })), [plateFromRouteState]);
  const [placed, setPlaced] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const selectedExtras = currentCartPlate?.extras ?? [];
  const extrasTotal = currentCartPlate?.extrasSubtotal ?? 0;
  const activePlateItems = plateItems.length > 0 ? plateItems : routePlateItems;
  const totalWeightInGrams = activePlateItems.reduce(
    (sum, item) => sum + item.portionWeightInGrams * item.quantity,
    0,
  );
  const buffetSubtotal = calculatePlateBuffetSubtotal(activePlateItems, pricePer100g);
  const total = buffetSubtotal + extrasTotal;
  const goToBuffet = () => navigate(ROUTES.CUSTOMER_HOME);
  const goToCart = () => navigate(ROUTES.CUSTOMER_CART);

  const ensurePlateContext = () => {
    if (plateItems.length > 0 || routePlateItems.length === 0) {
      return;
    }

    loadPlate(routePlateItems);
  };

  const editItem = (itemId: string) => {
    const itemExists = plate.some(item => item.id === itemId);
    if (!itemExists) {
      showError('Nao foi possivel encontrar este item para editar.');
      return;
    }

    ensurePlateContext();
    navigate(ROUTES.CUSTOMER_PLATE_BUILDER, {
      state: {
        ...reviewState,
        editItemId: itemId,
      },
    });
  };

  const removeItem = (itemId: string) => {
    if (plateItems.length === 0 && routePlateItems.length > 0) {
      loadPlate(routePlateItems.filter(item => item.id !== itemId));
      return;
    }

    removePlateItem(itemId);
  };

  const submitOrder = () => {
    if (isSending) {
      return;
    }

    setIsSending(true);

    try {
      const cartPlateItems = plateItems.length > 0 ? plateItems : routePlateItems;
      const cartBuffetSubtotal = calculatePlateBuffetSubtotal(cartPlateItems, pricePer100g);

      if (cartPlateItems.length === 0) {
        showError('Adicione itens ao prato antes de continuar.');
        return;
      }

      const cartPlate = {
        plateItems: cartPlateItems,
        extras: selectedExtras,
        buffetSubtotal: cartBuffetSubtotal,
        extrasSubtotal: extrasTotal,
        total: cartBuffetSubtotal + extrasTotal,
      };

      if (reviewState?.cartPlateId) {
        updateCartPlate(reviewState.cartPlateId, cartPlate);
      } else {
        addPlateToCart(cartPlate);
      }

      setPlaced(true);
      showSuccess(reviewState?.cartPlateId ? 'Prato atualizado no carrinho.' : 'Prato adicionado ao carrinho.');
      goToCart();
    } catch {
      showError('Erro ao adicionar prato ao carrinho.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="customer-page" style={{ height: '100dvh', maxWidth: 720, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', background: '#F8F6F4', fontFamily: customerFont, overflow: 'hidden' }}>
      <MobilePageHeader
        title="Meu prato"
        subtitle="Revise seu pedido"
        onBack={goToBuffet}
        badge={(
          <span style={{ fontSize: 13, fontWeight: 600, color: '#C9623A', background: '#FDF5F2', padding: '4px 10px', borderRadius: 8 }}>
            {plate.length} {plate.length === 1 ? 'item' : 'itens'}
          </span>
        )}
      />

      <div className="customer-review-scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 130 }}>
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
              onEdit={() => editItem(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>

        <BuffetSubtotalCard
          subtotal={buffetSubtotal}
          pricePer100g={pricePer100g}
          totalWeightInGrams={totalWeightInGrams}
        />

        {plate.length > 0 && (
          <div style={{ padding: '12px 14px 0' }}>
            <button
              type="button"
              onClick={goToBuffet}
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: '1.5px dashed #D1C9C2', background: 'transparent', color: '#6B7280', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: customerFont }}
            >
              Adicionar mais itens
            </button>
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>

      <PlateReviewBottomBar
        buffetSubtotal={buffetSubtotal}
        extrasTotal={extrasTotal}
        total={total}
        placed={placed}
        isSending={isSending}
        submitLabel="Ir para o carrinho"
        sendingLabel="Adicionando..."
        placedLabel="Prato adicionado!"
        onSubmit={submitOrder}
      />
    </div>
  );
}

export default PlateReviewWithExtras;
