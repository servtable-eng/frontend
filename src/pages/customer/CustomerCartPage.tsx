import { useEffect, useMemo, useState } from 'react';
import { Edit3, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '@/components/ToastProvider';
import { useCustomerCart } from '@/contexts/CustomerCartContext';
import { useCustomerPlate } from '@/contexts/CustomerPlateContext';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { ROUTES, customerOrderPath } from '@/routes/routeConstants';
import { getExtrasForRestaurant } from '@/services/extras/extra.service';
import { createOrder } from '@/services/orders/order.service';
import { addRecentOrder, getRecentOrders } from '@/services/orders/recentOrders.storage';
import type { ExtraDto } from '@/types/extra';
import type { PlateReviewState } from '@/types/order';
import { ExtrasScroller } from '@/components/customer/PlateReviewComponents';
import { brl, customerFont, EmptyState, ImgSafe, MobilePageHeader } from '@/components/customer/CustomerShared';
import { useRestaurantPricePer100g } from '@/hooks/useRestaurantPricePer100g';
import { CartSkeleton } from '@/components/loading';
import { calculatePlateBuffetSubtotal } from '@/utils/buffetPricing';
import '../../styles/tokens.css';

const CUSTOMER_INFO_STORAGE_KEY = 'servtable_customer_info';

type CustomerInfo = {
  customerName: string;
  customerPhone: string;
};

const EMPTY_CUSTOMER_INFO: CustomerInfo = {
  customerName: '',
  customerPhone: '',
};

const onlyDigits = (value: string) => value.replace(/\D/g, '');

function loadCustomerInfo(): CustomerInfo {
  try {
    const stored = window.localStorage.getItem(CUSTOMER_INFO_STORAGE_KEY);
    if (!stored) return EMPTY_CUSTOMER_INFO;

    const parsed = JSON.parse(stored) as Partial<CustomerInfo>;

    return {
      customerName: typeof parsed.customerName === 'string' ? parsed.customerName : '',
      customerPhone: typeof parsed.customerPhone === 'string' ? onlyDigits(parsed.customerPhone).slice(0, 11) : '',
    };
  } catch {
    return EMPTY_CUSTOMER_INFO;
  }
}

function saveCustomerInfo(customerInfo: CustomerInfo) {
  window.localStorage.setItem(CUSTOMER_INFO_STORAGE_KEY, JSON.stringify(customerInfo));
}

function formatBrazilianPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getCustomerValidationErrors(customerInfo: CustomerInfo) {
  const errors: string[] = [];
  const trimmedName = customerInfo.customerName.trim();

  if (!trimmedName) {
    errors.push('Informe o nome do cliente.');
  } else if (trimmedName.length < 3) {
    errors.push('O nome deve ter pelo menos 3 caracteres.');
  }

  if (!customerInfo.customerPhone) {
    errors.push('Informe o telefone.');
  } else if (customerInfo.customerPhone.length < 10 || customerInfo.customerPhone.length > 11) {
    errors.push('O telefone deve ter 10 ou 11 digitos.');
  }

  return errors;
}

export function CustomerCartPage() {
  const navigate = useNavigate();
  const restaurant = useRestaurant();
  const { pricePer100g, isLoadingPricePer100g } = useRestaurantPricePer100g();
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
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => loadCustomerInfo());
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [tableNumberError, setTableNumberError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [hasRecentOrders, setHasRecentOrders] = useState(() => getRecentOrders().length > 0);

  useEffect(() => {
    saveCustomerInfo(customerInfo);
  }, [customerInfo]);

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
  const selectedExtraItems = useMemo(() => (
    Object.entries(extraQuantities).filter(([, quantity]) => quantity > 0)
  ), [extraQuantities]);
  const totals = useMemo(() => {
    const buffet = cartPlates.reduce(
      (sum, plate) => sum + calculatePlateBuffetSubtotal(plate.plateItems, pricePer100g),
      0,
    );
    const extrasSubtotal = availableExtras.reduce(
      (sum, item) => sum + item.salePrice * (extraQuantities[item.id] ?? 0),
      0,
    );

    return {
      buffet,
      extras: extrasSubtotal,
      total: buffet + extrasSubtotal,
    };
  }, [availableExtras, cartPlates, extraQuantities, pricePer100g]);
  const customerValidationErrors = useMemo(
    () => getCustomerValidationErrors(customerInfo),
    [customerInfo],
  );
  const hasDishItems = cartPlates.some(plate => plate.plateItems.some(item => item.quantity > 0));
  const hasExtraItems = selectedExtraItems.length > 0;
  const isCartEmpty = !hasDishItems && !hasExtraItems;
  const isCustomerInfoValid = customerValidationErrors.length === 0;
  const canSubmitOrder = !isSending;

  const updateCustomerInfo = (field: keyof CustomerInfo, value: string) => {
    const nextValue = field === 'customerName'
      ? value
      : onlyDigits(value).slice(0, 11);

    setCustomerInfo(current => {
      return { ...current, [field]: nextValue };
    });
    setSubmitMessage('');
  };

  const updateTableNumber = (value: string) => {
    setTableNumber(onlyDigits(value));
    setTableNumberError('');
  };

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
        portionWeightInGrams: item.portionWeightInGrams,
        observation: item.observation,
      })),
      extraQuantities: Object.fromEntries(
        plate.extras.map(extra => [extra.extraItemId, extra.quantity]),
      ),
    };

    loadPlate(plate.plateItems);
    navigate(ROUTES.CUSTOMER_PLATE_BUILDER, { state });
  };

  const finishOrder = () => {
    if (isSending) {
      return;
    }

    if (isCartEmpty) {
      setSubmitMessage('Adicione pelo menos um item ao pedido antes de finalizar.');
      return;
    }

    if (!isCustomerInfoValid) {
      setSubmitMessage('Revise as informacoes do cliente antes de finalizar.');
      return;
    }

    setSubmitMessage('');
    setTableNumber('');
    setTableNumberError('');
    setIsTableModalOpen(true);
  };

  const confirmOrder = async () => {
    if (isSending) {
      return;
    }

    if (!tableNumber) {
      setTableNumberError('Informe o numero da mesa.');
      return;
    }

    const parsedTableNumber = Number(tableNumber);
    if (!Number.isInteger(parsedTableNumber) || parsedTableNumber <= 0) {
      setTableNumberError('Informe um numero de mesa valido.');
      return;
    }

    setIsSending(true);
    setTableNumberError('');

    const preparedCustomerData = {
      customerName: customerInfo.customerName.trim(),
      tableNumber: parsedTableNumber,
      customerPhone: customerInfo.customerPhone,
    };

    try {
      const createdOrder = await createOrder({
        restaurantId: restaurant.id,
        customerName: preparedCustomerData.customerName,
        tableNumber: preparedCustomerData.tableNumber,
        customerPhone: preparedCustomerData.customerPhone,
        plateItems: cartPlates.flatMap(plate => (
          plate.plateItems.flatMap(item => (
            Array.from({ length: item.quantity }, () => ({
              dishId: item.dishId,
              portionWeightInGrams: item.portionWeightInGrams,
              observation: item.observation ?? '',
            }))
          ))
        )),
        extraItems: selectedExtraItems
          .map(([extraItemId, quantity]) => ({
            extraItemId,
            quantity,
          })),
      });

      addRecentOrder({
        orderId: createdOrder.id,
        customerName: preparedCustomerData.customerName,
        tableNumber: String(preparedCustomerData.tableNumber),
        createdAt: new Date().toISOString(),
      });
      setHasRecentOrders(true);
      setIsTableModalOpen(false);
      setTableNumber('');
      clearCart();
      showSuccess('Pedido enviado com sucesso.');
      navigate(customerOrderPath(createdOrder.id));
    } catch {
      const errorMessage = 'Nao foi possivel enviar seu pedido. Tente novamente em instantes.';
      setTableNumberError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingPricePer100g) {
    return <CartSkeleton />;
  }

  return (
    <div className="customer-page" style={{ height: '100dvh', maxWidth: 720, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', background: '#F8F6F4', fontFamily: customerFont, overflow: 'hidden' }}>
      <MobilePageHeader
        title="Carrinho"
        subtitle="Revise seus pedidos"
        onBack={goToBuffet}
        badge={hasRecentOrders ? (
          <button
            type="button"
            onClick={() => navigate(ROUTES.CUSTOMER_RECENT_ORDERS)}
            style={{ border: 'none', background: '#FDF5F2', color: '#C9623A', padding: '7px 9px', borderRadius: 8, fontSize: 11, fontWeight: 800, fontFamily: customerFont, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Acompanhar pedidos
          </button>
        ) : (
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
            <section style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #EAE4DF', padding: '14px 16px', marginBottom: 12 }}>
              <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Informações do Cliente
              </p>
              <div style={{ display: 'grid', gap: 10 }}>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Nome</span>
                  <input
                    type="text"
                    value={customerInfo.customerName}
                    onChange={event => updateCustomerInfo('customerName', event.target.value)}
                    placeholder="Nome do cliente"
                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #EAE4DF', borderRadius: 10, padding: '11px 12px', fontSize: 14, color: '#1F2937', background: '#FAFAF9', fontFamily: customerFont, outline: 'none' }}
                  />
                </label>

                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Telefone</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatBrazilianPhone(customerInfo.customerPhone)}
                    onChange={event => updateCustomerInfo('customerPhone', event.target.value)}
                    placeholder="(11) 99999-9999"
                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #EAE4DF', borderRadius: 10, padding: '11px 12px', fontSize: 14, color: '#1F2937', background: '#FAFAF9', fontFamily: customerFont, outline: 'none' }}
                  />
                </label>

                {customerValidationErrors.length > 0 && (
                  <div style={{ display: 'grid', gap: 4 }}>
                    {customerValidationErrors.map(error => (
                      <p key={error} style={{ margin: 0, fontSize: 12, color: '#B85632', lineHeight: 1.35 }}>
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {cartPlates.map((plate, index) => {
              const plateBuffetSubtotal = calculatePlateBuffetSubtotal(plate.plateItems, pricePer100g);

              return (
              <section key={plate.id} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #EAE4DF', padding: 14, marginBottom: 12 }}>
                <div className="customer-cart-plate-heading" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
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
                    style={{ width: 44, height: 44, borderRadius: 8, border: '1.5px solid #EAE4DF', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <Edit3 size={14} color="#6B7280" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCartPlate(plate.id)}
                    aria-label={`Remover prato ${index + 1}`}
                    style={{ width: 44, height: 44, borderRadius: 8, border: '1.5px solid #FEE2E2', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <Trash2 size={14} color="#EF4444" />
                  </button>
                </div>

                <div style={{ display: 'grid', gap: 8 }}>
                  {plate.plateItems.map(item => (
                    <div className="customer-cart-item" key={item.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderTop: '1px solid #F0EDE9' }}>
                      <ImgSafe src={item.imageUrl} alt={item.name} style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} size={18} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1F2937', lineHeight: 1.2 }}>{item.name}</p>
                        <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 600, color: '#C9623A' }}>
                          {item.quantity}x · {item.portionWeightInGrams} g
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
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{brl(plateBuffetSubtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1F2937' }}>Subtotal</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#C9623A' }}>{brl(plateBuffetSubtotal)}</span>
                  </div>
                </div>
              </section>
              );
            })}

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

          <div className="customer-bottom-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: 720, margin: '0 auto', background: '#fff', borderTop: '1px solid #EAE4DF', padding: '12px 16px', boxShadow: '0 -4px 16px rgba(0,0,0,0.06)', zIndex: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1F2937' }}>{brl(totals.total)}</span>
            </div>
            {(submitMessage || isCartEmpty || customerValidationErrors.length > 0) && (
              <p style={{ margin: '0 0 10px', fontSize: 12, color: '#B85632', lineHeight: 1.35 }}>
                {submitMessage || (isCartEmpty ? 'Adicione pelo menos um item ao pedido antes de finalizar.' : 'Preencha as informações do cliente para finalizar.')}
              </p>
            )}
            <button
              type="button"
              onClick={finishOrder}
              disabled={!canSubmitOrder}
              style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: canSubmitOrder ? '#C9623A' : '#B8A59A', color: '#fff', fontSize: 15, fontWeight: 700, cursor: canSubmitOrder ? 'pointer' : 'default', fontFamily: customerFont }}
            >
              {isSending ? 'Enviando...' : 'Finalizar pedido'}
            </button>
          </div>
        </>
      )}

      {isTableModalOpen && (
        <div className="customer-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(31, 41, 55, 0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="customer-modal" role="dialog" aria-modal="true" aria-labelledby="table-confirmation-title" style={{ width: '100%', maxWidth: 342, background: '#fff', borderRadius: 14, border: '1.5px solid #EAE4DF', padding: 16, boxShadow: '0 18px 50px rgba(31, 41, 55, 0.22)' }}>
            <h2 id="table-confirmation-title" style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 800, color: '#1F2937' }}>
              Informe sua mesa
            </h2>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Número da mesa</span>
              <input
                type="text"
                inputMode="numeric"
                value={tableNumber}
                onChange={event => updateTableNumber(event.target.value)}
                placeholder="12"
                autoFocus
                style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #EAE4DF', borderRadius: 10, padding: '11px 12px', fontSize: 14, color: '#1F2937', background: '#FAFAF9', fontFamily: customerFont, outline: 'none' }}
              />
            </label>
            {tableNumberError && (
              <p style={{ margin: '10px 0 0', fontSize: 12, color: '#B85632', lineHeight: 1.35 }}>
                {tableNumberError}
              </p>
            )}
            <div className="customer-modal-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginTop: 16 }}>
              <button
                type="button"
                onClick={() => {
                  if (isSending) return;
                  setIsTableModalOpen(false);
                  setTableNumberError('');
                }}
                disabled={isSending}
                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '1.5px solid #EAE4DF', background: '#fff', color: '#6B7280', fontSize: 14, fontWeight: 700, cursor: isSending ? 'default' : 'pointer', fontFamily: customerFont }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmOrder}
                disabled={isSending}
                style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: isSending ? '#B8A59A' : '#C9623A', color: '#fff', fontSize: 14, fontWeight: 700, cursor: isSending ? 'default' : 'pointer', fontFamily: customerFont }}
              >
                {isSending ? 'Enviando...' : 'Confirmar pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerCartPage;
