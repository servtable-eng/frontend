import { useEffect, useMemo, useState } from 'react';
import { Edit3, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '@/components/ToastProvider';
import { useCustomerCart } from '@/contexts/CustomerCartContext';
import { useCustomerPlate } from '@/contexts/CustomerPlateContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { ROUTES } from '@/routes/routeConstants';
import { getExtrasForRestaurant } from '@/services/extras/extra.service';
import { createOrder } from '@/services/orders/order.service';
import type { ExtraDto } from '@/types/extra';
import type { PlateReviewState, PortionSize } from '@/types/order';
import { ExtrasScroller } from '@/components/customer/PlateReviewComponents';
import { brl, customerFont, EmptyState, ImgSafe, MobilePageHeader } from '@/components/customer/CustomerShared';
import '../../styles/tokens.css';

const PORTION_LABELS: Record<PortionSize, string> = {
  SMALL: 'Pequena',
  MEDIUM: 'Media',
  LARGE: 'Grande',
};

export function CustomerCartPage() {
  const navigate = useNavigate();
  const restaurant = useRestaurant();
  const {
    cartPlates,
    extraQuantities,
    setExtraQuantities,
    removeCartPlate,
    clearCart,
  } = useCustomerCart();
  const { loadPlate } = useCustomerPlate();
  const [extras, setExtras] = useState<ExtraDto[]>([]);
  const [beverages, setBeverages] = useState<ExtraDto[]>([]);
  const [isLoadingExtras, setIsLoadingExtras] = useState(true);
  const [extrasError, setExtrasError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!restaurant.id) {
      setExtrasError('Restaurante nao encontrado.');
      setIsLoadingExtras(false);
      return;
    }

    getExtrasForRestaurant(restaurant.id)
      .then(data => {
        setExtras(data.filter(extra => extra.category === 'EXTRAS_SOBREMESAS'));
        setBeverages(data.filter(extra => extra.category === 'BEBIDA'));
        setExtrasError('');
      })
      .catch(() => setExtrasError('Houve um erro ao carregar os extras.'))
      .finally(() => {
        setIsLoadingExtras(false);
      });
  }, [restaurant.id]);

  const availableExtras = useMemo(() => [...beverages, ...extras], [beverages, extras]);
  const totals = useMemo(() => {
    const buffet = cartPlates.reduce((sum, plate) => sum + plate.buffetSubtotal, 0);
    const extrasSubtotal = availableExtras.reduce(
      (sum, item) => sum + item.salePrice * (extraQuantities[item.id] ?? 0),
      0,
    );

    return {
      buffet,
      extras: extrasSubtotal,
      total: buffet + extrasSubtotal,
    };
  }, [availableExtras, cartPlates, extraQuantities]);

  const goToBuffet = () => navigate(ROUTES.CUSTOMER_HOME);

  const editPlate = (plateId: string) => {
    const plate = cartPlates.find(cartPlate => cartPlate.id === plateId);
    if (!plate) return;

    const state: PlateReviewState = {
      cartPlateId: plate.id,
      items: plate.plateItems.map(item => ({
        dishId: item.dishId,
        dishName: item.name,
        imageUrl: item.imageUrl,
        portion: item.portionSize,
        observation: item.observation,
      })),
      extraQuantities: Object.fromEntries(
        plate.extras.map(extra => [extra.extraItemId, extra.quantity]),
      ),
    };

    loadPlate(plate.plateItems);
    navigate(ROUTES.CUSTOMER_PLATE_BUILDER, { state });
  };

  const finishOrder = async () => {
    if (isSending || cartPlates.length === 0) {
      return;
    }

    setIsSending(true);

    try {
      await createOrder({
        restaurantId: restaurant.id,
        customerName: 'Cliente',
        tableNumber: '7',
        plateItems: cartPlates.flatMap(plate => (
          plate.plateItems.flatMap(item => (
            Array.from({ length: item.quantity }, () => ({
              dishId: item.dishId,
              portionSize: item.portionSize,
              observation: item.observation,
            }))
          ))
        )),
        extraItems: Object.entries(extraQuantities)
          .filter(([, quantity]) => quantity > 0)
          .map(([extraItemId, quantity]) => ({
            extraItemId,
            quantity,
          })),
      });

      clearCart();
      showSuccess('Pedido enviado com sucesso.');
      navigate(ROUTES.CUSTOMER_ORDER_CONFIRMATION);
    } catch {
      showError('Erro ao enviar pedido.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ height: '100svh', maxWidth: 390, margin: '0 auto', display: 'flex', flexDirection: 'column', background: '#F8F6F4', fontFamily: customerFont, overflow: 'hidden' }}>
      <MobilePageHeader
        title="Carrinho"
        subtitle="Revise seus pedidos"
        onBack={goToBuffet}
        badge={(
          <span style={{ fontSize: 13, fontWeight: 600, color: '#C9623A', background: '#FDF5F2', padding: '4px 10px', borderRadius: 8 }}>
            {cartPlates.length} {cartPlates.length === 1 ? 'prato' : 'pratos'}
          </span>
        )}
      />

      {cartPlates.length === 0 ? (
        <div style={{ flex: 1, padding: 16 }}>
          <EmptyState
            title="Seu carrinho está vazio"
            message="Escolha seus itens no buffet para montar um prato"
            actionLabel="Voltar ao buffet"
            onAction={goToBuffet}
          />
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 144px' }}>
            {cartPlates.map((plate, index) => (
              <section key={plate.id} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #EAE4DF', padding: 14, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FDF5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShoppingBag size={17} color="#C9623A" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1F2937', lineHeight: 1.2 }}>
                      Prato {index + 1}
                    </h2>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9CA3AF' }}>
                      {plate.plateItems.reduce((sum, item) => sum + item.quantity, 0)} itens selecionados
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => editPlate(plate.id)}
                    aria-label={`Editar prato ${index + 1}`}
                    style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #EAE4DF', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <Edit3 size={14} color="#6B7280" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCartPlate(plate.id)}
                    aria-label={`Remover prato ${index + 1}`}
                    style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #FEE2E2', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <Trash2 size={14} color="#EF4444" />
                  </button>
                </div>

                <div style={{ display: 'grid', gap: 8 }}>
                  {plate.plateItems.map(item => (
                    <div key={item.dishId} style={{ display: 'flex', gap: 10, padding: '10px 0', borderTop: '1px solid #F0EDE9' }}>
                      <ImgSafe src={item.imageUrl} alt={item.name} style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} size={18} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1F2937', lineHeight: 1.2 }}>{item.name}</p>
                        <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 600, color: '#C9623A' }}>
                          {item.quantity}x · {PORTION_LABELS[item.portionSize]}
                        </p>
                        {item.observation && (
                          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6B7280', fontStyle: 'italic', lineHeight: 1.3 }}>
                            "{item.observation}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #F0EDE9', marginTop: 12, paddingTop: 10, display: 'grid', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>Buffet</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{brl(plate.buffetSubtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1F2937' }}>Subtotal</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#C9623A' }}>{brl(plate.buffetSubtotal)}</span>
                  </div>
                </div>
              </section>
            ))}

            <ExtrasScroller
              title="Bebidas"
              items={beverages}
              quantities={extraQuantities}
              isLoading={isLoadingExtras}
              error={extrasError}
              onAdjust={setExtraQuantities}
            />

            <div style={{ marginBottom: 24 }}>
              <ExtrasScroller
                title="Extras & Sobremesas"
                items={extras}
                quantities={extraQuantities}
                isLoading={isLoadingExtras}
                error={extrasError}
                onAdjust={setExtraQuantities}
              />
            </div>

            <section style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #EAE4DF', padding: '14px 16px' }}>
              <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Resumo
              </p>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>Pratos</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{cartPlates.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>Subtotal buffet</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{brl(totals.buffet)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>Subtotal extras</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{brl(totals.extras)}</span>
                </div>
                <div style={{ height: 1, background: '#F0EDE9' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#1F2937' }}>Total do pedido</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#1F2937' }}>{brl(totals.total)}</span>
                </div>
              </div>
            </section>
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: 390, margin: '0 auto', background: '#fff', borderTop: '1px solid #EAE4DF', padding: '12px 16px', boxShadow: '0 -4px 16px rgba(0,0,0,0.06)', zIndex: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1F2937' }}>{brl(totals.total)}</span>
            </div>
            <button
              type="button"
              onClick={finishOrder}
              disabled={isSending}
              style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: isSending ? '#B8A59A' : '#C9623A', color: '#fff', fontSize: 15, fontWeight: 700, cursor: isSending ? 'default' : 'pointer', fontFamily: customerFont }}
            >
              {isSending ? 'Enviando...' : 'Finalizar pedido'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerCartPage;
