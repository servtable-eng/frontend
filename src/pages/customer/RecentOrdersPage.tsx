import { useEffect, useState } from 'react';
import { ExternalLink, ReceiptText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CountdownTimer } from '@/components/CountdownTimer';
import { brl, customerFont, EmptyState, LoadingState, MobilePageHeader } from '@/components/customer/CustomerShared';
import { ROUTES, customerOrderPath } from '@/routes/routeConstants';
import { getOrder } from '@/services/orders/order.service';
import { getRecentOrders, removeRecentOrder, type RecentOrder } from '@/services/orders/recentOrders.storage';
import type { OrderDetails } from '@/types/order';

const shortOrderId = (orderId: string) => orderId.slice(0, 8).toUpperCase();

type RecentOrderView = {
  stored: RecentOrder;
  details: OrderDetails | null;
  error: string;
};

export function RecentOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<RecentOrderView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const storedOrders = getRecentOrders();

    if (storedOrders.length === 0) {
      setOrders([]);
      setIsLoading(false);
      return undefined;
    }

    Promise.all(
      storedOrders.map(async stored => {
        try {
          const details = await getOrder(stored.orderId);
          return { stored, details, error: '' };
        } catch {
          return { stored, details: null, error: 'Nao foi possivel atualizar este pedido.' };
        }
      }),
    ).then(nextOrders => {
      if (!isMounted) return;
      setOrders(nextOrders);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const removeOrder = (orderId: string) => {
    removeRecentOrder(orderId);
    setOrders(current => current.filter(order => order.stored.orderId !== orderId));
    setPendingRemovalId(null);
  };

  return (
    <div className="customer-page" style={{ height: '100dvh', maxWidth: 720, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', background: '#F8F6F4', fontFamily: customerFont, overflow: 'hidden' }}>
      <MobilePageHeader
        title="Meus pedidos"
        subtitle="Acompanhe seus pedidos recentes"
        onBack={() => navigate(ROUTES.CUSTOMER_HOME)}
        badge={(
          <span style={{ fontSize: 12, fontWeight: 800, color: '#C9623A', background: '#FDF5F2', padding: '5px 9px', borderRadius: 8 }}>
            {orders.length}
          </span>
        )}
      />

      {isLoading ? (
        <LoadingState message="Carregando pedidos..." />
      ) : orders.length === 0 ? (
        <div style={{ flex: 1, padding: 16 }}>
          <EmptyState
            title="Nenhum pedido recente"
            message="Finalize um pedido neste navegador para acompanhar por aqui."
            actionLabel="Ver buffet"
            onAction={() => navigate(ROUTES.CUSTOMER_HOME)}
          />
        </div>
      ) : (
        <main style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'grid', gap: 12, alignContent: 'start' }}>
          {orders.map(({ stored, details, error }) => {
            return (
              <article key={stored.orderId} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #EAE4DF', padding: 14 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FDF5F2', color: '#C9623A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ReceiptText size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="customer-order-heading" style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 0 }}>
                        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1F2937', lineHeight: 1.2 }}>
                          Pedido {shortOrderId(stored.orderId)}
                        </h2>
                        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6B7280' }}>
                          Mesa {String(details?.tableNumber ?? stored.tableNumber)}
                        </p>
                      </div>
                      {details ? (
                        <CountdownTimer
                          estimatedDeliveryAt={details.estimatedDeliveryAt}
                          status={details.status}
                          style={{ fontSize: 11, fontWeight: 800, color: '#C9623A', background: '#FDF5F2', padding: '5px 8px', borderRadius: 8, whiteSpace: 'nowrap' }}
                        />
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', background: '#F3F4F6', padding: '5px 8px', borderRadius: 8, whiteSpace: 'nowrap' }}>
                          Indisponivel
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12, paddingTop: 10, borderTop: '1px solid #F0EDE9' }}>
                      <span style={{ fontSize: 13, color: '#6B7280' }}>Total</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#1F2937' }}>
                        {details ? brl(details.total) : '--'}
                      </span>
                    </div>

                    {error && (
                      <p style={{ margin: '8px 0 0', fontSize: 12, color: '#B85632', lineHeight: 1.35 }}>
                        {error}
                      </p>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 44px', gap: 8, marginTop: 12 }}>
                      <button
                        type="button"
                        onClick={() => navigate(customerOrderPath(stored.orderId))}
                        style={{ border: 'none', borderRadius: 12, background: '#C9623A', color: '#fff', padding: '12px 14px', fontSize: 13, fontWeight: 800, fontFamily: customerFont, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                      >
                        Abrir pedido
                        <ExternalLink size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remover pedido ${shortOrderId(stored.orderId)}`}
                        onClick={() => setPendingRemovalId(stored.orderId)}
                        style={{ width: 44, height: 44, borderRadius: 12, border: '1.5px solid #FEE2E2', background: '#FFF5F5', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </main>
      )}

      {pendingRemovalId && (
        <div className="customer-modal-overlay" style={{ zIndex: 50, background: 'rgba(31, 41, 55, 0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="customer-modal" role="dialog" aria-modal="true" aria-labelledby="remove-order-title" style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #EAE4DF', boxShadow: '0 18px 50px rgba(31, 41, 55, 0.22)' }}>
            <h2 id="remove-order-title" style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: '#1F2937' }}>Remover pedido?</h2>
            <p style={{ margin: '0 0 16px', fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>Este pedido será removido da lista de pedidos recentes neste dispositivo.</p>
            <div className="customer-modal-actions">
              <button type="button" onClick={() => setPendingRemovalId(null)} style={{ padding: 12, borderRadius: 12, border: '1.5px solid #EAE4DF', background: '#fff', color: '#6B7280', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
              <button type="button" onClick={() => removeOrder(pendingRemovalId)} style={{ padding: 12, borderRadius: 12, border: 'none', background: '#DC2626', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentOrdersPage;
