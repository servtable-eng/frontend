import { useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CountdownTimer } from '@/components/CountdownTimer';
import { brl, customerFont, EmptyState, LoadingState, MobilePageHeader } from '@/components/customer/CustomerShared';
import { ROUTES } from '@/routes/routeConstants';
import { getOrder } from '@/services/orders/order.service';
import type { OrderDetails, OrderStatus } from '@/types/order';

const STATUS_LABELS: Partial<Record<OrderStatus, string>> = {
  RECEIVED: 'Pedido recebido',
  PREPARING: 'Preparando',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
};

const STATUS_STEP: Partial<Record<OrderStatus, number>> = {
  RECEIVED: 1,
  PREPARING: 2,
  READY: 3,
  DELIVERED: 4,
};

const PROGRESS_STEPS = ['Recebido', 'Preparando', 'Pronto', 'Entregue'];

const isTerminalStatus = (status: OrderStatus) => status === 'DELIVERED' || status === 'CANCELED';

const shortOrderId = (orderId: string) => orderId.slice(0, 8).toUpperCase();

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #EAE4DF', padding: '14px 16px' }}>
      <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </p>
      {children}
    </section>
  );
}

function ProgressIndicator({ status }: { status: OrderStatus }) {
  if (status === 'CANCELED') {
    return (
      <div style={{ border: '1.5px solid #FECACA', background: '#FFF5F5', borderRadius: 14, padding: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
        <XCircle size={22} color="#DC2626" />
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#991B1B' }}>Pedido cancelado</p>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#B91C1C' }}>Este pedido nao seguira para preparo.</p>
        </div>
      </div>
    );
  }

  const activeStep = STATUS_STEP[status] ?? 1;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
      {PROGRESS_STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber <= activeStep;
        const isCurrent = stepNumber === activeStep;

        return (
          <div key={step} style={{ display: 'grid', gap: 7, minWidth: 0 }}>
            <div style={{ height: 6, borderRadius: 999, background: isComplete ? '#C9623A' : '#EAE4DF' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
              {isComplete ? <CheckCircle2 size={13} color="#C9623A" /> : <Clock3 size={13} color="#C9B8AD" />}
              <span style={{ fontSize: 10, fontWeight: isCurrent ? 800 : 700, color: isComplete ? '#1F2937' : '#9CA3AF', lineHeight: 1.2 }}>
                {step}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OrderTrackingPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('Pedido nao encontrado.');
      setIsLoading(false);
      return undefined;
    }

    let isMounted = true;
    let intervalId: ReturnType<typeof window.setInterval> | undefined;

    const loadOrder = async () => {
      try {
        const nextOrder = await getOrder(orderId);
        if (!isMounted) return undefined;

        setOrder(nextOrder);
        setError('');
        setIsLoading(false);

        if (isTerminalStatus(nextOrder.status) && intervalId) {
          window.clearInterval(intervalId);
        }

        return nextOrder.status;
      } catch {
        if (!isMounted) return undefined;
        setError('Nao foi possivel carregar o pedido. Tente novamente em instantes.');
        setIsLoading(false);
        return undefined;
      }
    };

    const startPolling = async () => {
      const currentStatus = await loadOrder();
      if (!isMounted) return;
      if (currentStatus && isTerminalStatus(currentStatus)) return;

      intervalId = window.setInterval(loadOrder, 5000);
    };

    startPolling();

    return () => {
      isMounted = false;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [orderId]);

  return (
    <div style={{ height: '100svh', maxWidth: 390, margin: '0 auto', display: 'flex', flexDirection: 'column', background: '#F8F6F4', fontFamily: customerFont, overflow: 'hidden' }}>
      <MobilePageHeader
        title="Acompanhar pedido"
        subtitle={orderId ? `Pedido ${shortOrderId(orderId)}` : 'Pedido'}
        onBack={() => navigate(ROUTES.CUSTOMER_RECENT_ORDERS)}
        badge={(
          <span style={{ fontSize: 12, fontWeight: 800, color: order?.status === 'CANCELED' ? '#DC2626' : '#C9623A', background: order?.status === 'CANCELED' ? '#FFF5F5' : '#FDF5F2', padding: '5px 9px', borderRadius: 8 }}>
            {order ? STATUS_LABELS[order.status] ?? order.status : 'Carregando'}
          </span>
        )}
      />

      {isLoading ? (
        <LoadingState message="Carregando pedido..." />
      ) : error ? (
        <div style={{ flex: 1, padding: 16 }}>
          <EmptyState title="Nao encontramos o pedido" message={error} actionLabel="Meus pedidos" onAction={() => navigate(ROUTES.CUSTOMER_RECENT_ORDERS)} />
        </div>
      ) : order ? (
        <main style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gap: 12, alignContent: 'start' }}>
          <Section title="Status">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1F2937', lineHeight: 1.2 }}>
                  Pedido {shortOrderId(order.id)}
                </h1>
                <p style={{ margin: '5px 0 0', fontSize: 13, color: '#6B7280' }}>
                  {order.customerName} - Mesa {String(order.tableNumber)}
                </p>
              </div>
              <CountdownTimer
                estimatedDeliveryAt={order.estimatedDeliveryAt}
                status={order.status}
                style={{ alignSelf: 'flex-start', fontSize: 12, fontWeight: 800, color: '#C9623A', background: '#FDF5F2', padding: '6px 9px', borderRadius: 8, whiteSpace: 'nowrap' }}
              />
            </div>
            <ProgressIndicator status={order.status} />
          </Section>

          <Section title="Resumo">
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Subtotal buffet</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#374151' }}>{brl(order.buffetSubtotal ?? 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Subtotal extras</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#374151' }}>{brl(order.extrasSubtotal ?? 0)}</span>
              </div>
              <div style={{ height: 1, background: '#F0EDE9' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#1F2937' }}>Total</span>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#1F2937' }}>{brl(order.total)}</span>
              </div>
            </div>
          </Section>

          <Section title="Pratos">
            {order.plateItems.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>Nenhum prato neste pedido.</p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {order.plateItems.map((item, index) => (
                  <div key={`${item.dishId}-${index}`} style={{ borderTop: index === 0 ? 'none' : '1px solid #F0EDE9', paddingTop: index === 0 ? 0 : 10 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1F2937' }}>{item.dishName}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: '#C9623A' }}>{item.portionWeightInGrams} g</p>
                    {item.observation && (
                      <p style={{ margin: '5px 0 0', fontSize: 12, color: '#6B7280', lineHeight: 1.35 }}>
                        {item.observation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Extras">
            {order.extraItems.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>Nenhum extra neste pedido.</p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {order.extraItems.map(item => (
                  <div key={item.extraItemId} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1F2937' }}>{item.name}</p>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6B7280' }}>{item.quantity}x {brl(item.unitPrice)}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#374151', whiteSpace: 'nowrap' }}>{brl(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </main>
      ) : null}
    </div>
  );
}

export default OrderTrackingPage;
