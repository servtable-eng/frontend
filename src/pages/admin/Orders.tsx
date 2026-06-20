import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CookingPot,
  PackageCheck,
  ReceiptText,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { showError, showSuccess } from '@/components/ToastProvider';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { getOrder, getOrdersForRestaurant, updateOrderStatus } from '@/services/orders/order.service';
import type { OrderDetails, OrderPlateItem, OrderStatus, OrderSummary } from '@/types/order';
import '../../styles/tokens.css';

const OPERATION_STATUSES: OrderStatus[] = ['PENDING', 'RECEIVED', 'PREPARING', 'READY', 'DELIVERED'];

const STATUS_COLUMNS: { status: OrderStatus; label: string; icon: LucideIcon; border: string; badge: string }[] = [
  { status: 'RECEIVED', label: 'Recebidos', icon: ReceiptText, border: 'border-l-[#F59E0B]', badge: 'bg-amber-50 text-amber-700' },
  { status: 'PREPARING', label: 'Preparando', icon: CookingPot, border: 'border-l-[#C9623A]', badge: 'bg-[#C9623A]/10 text-[#C9623A]' },
  { status: 'READY', label: 'Prontos', icon: PackageCheck, border: 'border-l-[#22C55E]', badge: 'bg-green-50 text-green-700' },
  { status: 'DELIVERED', label: 'Entregues', icon: CheckCircle2, border: 'border-l-[#6B7280]', badge: 'bg-gray-100 text-gray-600' },
];

const PORTION_LABELS: Record<OrderPlateItem['portionSize'], string> = {
  SMALL: 'Pequena',
  MEDIUM: 'Média',
  LARGE: 'Grande',
};

const brl = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

const onlyDigits = (value: string) => value.replace(/\D/g, '');

function formatBrazilianPhone(value: string) {
  const digits = onlyDigits(value);

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  return value;
}

function formatShortOrderId(id: string) {
  return `#${id.slice(0, 8)}`;
}

function formatCreatedTime(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusLabel(status: OrderStatus) {
  if (status === 'PENDING') return 'Pendente';
  return STATUS_COLUMNS.find(column => column.status === status)?.label ?? status;
}

function getOrderColumnStatus(status: OrderStatus) {
  return status === 'PENDING' ? 'RECEIVED' : status;
}

function getNextStatus(status: OrderStatus): OrderStatus | null {
  if (status === 'PENDING') return 'PREPARING';
  if (status === 'RECEIVED') return 'PREPARING';
  if (status === 'PREPARING') return 'READY';
  if (status === 'READY') return 'DELIVERED';
  return null;
}

function getActionLabel(status: OrderStatus) {
  if (status === 'PENDING') return 'Iniciar preparo';
  if (status === 'RECEIVED') return 'Iniciar preparo';
  if (status === 'PREPARING') return 'Marcar como pronto';
  if (status === 'READY') return 'Marcar como entregue';
  return '';
}

function getPlateItemsCount(order: OrderSummary) {
  if (typeof order.plateItemsCount === 'number') return order.plateItemsCount;
  return 'plateItems' in order && Array.isArray(order.plateItems) ? order.plateItems.length : 0;
}

function getExtraItemsCount(order: OrderSummary) {
  if (typeof order.extraItemsCount === 'number') return order.extraItemsCount;
  return 'extraItems' in order && Array.isArray(order.extraItems)
    ? order.extraItems.reduce((sum, extra) => sum + extra.quantity, 0)
    : 0;
}

function orderHasObservations(order: OrderSummary) {
  if (typeof order.hasObservations === 'boolean') return order.hasObservations;
  return 'plateItems' in order && Array.isArray(order.plateItems)
    ? order.plateItems.some(item => Boolean(item.observation))
    : false;
}

function OrderCard({
  order,
  active,
  onClick,
}: {
  order: OrderSummary;
  active: boolean;
  onClick: () => void;
}) {
  const statusConfig = STATUS_COLUMNS.find(column => column.status === getOrderColumnStatus(order.status)) ?? STATUS_COLUMNS[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-w-0 overflow-hidden text-left serv-bg-surface rounded-lg shadow-sm border serv-border border-l-4 ${statusConfig.border} p-4 flex flex-col gap-3 transition ${active ? 'ring-2 ring-[#C9623A]/30' : 'hover:shadow-md'}`}
    >
      <div className="flex justify-between items-start gap-3 min-w-0">
        <div className="min-w-0">
          <span className="block text-lg font-bold serv-text-primary tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
            {formatShortOrderId(order.id)}
          </span>
          <p className="text-xs serv-text-secondary mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
            {formatCreatedTime(order.createdAt)}
          </p>
        </div>
        <span className={`shrink-0 max-w-[120px] whitespace-nowrap overflow-hidden text-ellipsis text-xs font-bold px-2 py-1 rounded-full ${statusConfig.badge}`}>
          {statusConfig.label}
        </span>
      </div>

      <div className="min-w-0">
        <p className="font-semibold serv-text-primary text-base whitespace-nowrap overflow-hidden text-ellipsis">
          Mesa {order.tableNumber}
        </p>
        <p className="text-sm serv-text-secondary mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
          Nome: {order.customerName}
        </p>
        <p className="text-xs serv-text-secondary mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
          Telefone: {formatBrazilianPhone(order.customerPhone)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs serv-text-secondary min-w-0">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{getPlateItemsCount(order)} itens do prato</span>
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">{getExtraItemsCount(order)} extras</span>
      </div>

      <div className="pt-3 border-t serv-border flex justify-between items-center gap-3 mt-1 min-w-0">
        <div className="min-w-0 flex items-center gap-2">
          {orderHasObservations(order) && (
            <span className="min-w-0 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
              <AlertTriangle size={12} className="shrink-0" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              Observações
              </span>
            </span>
          )}
        </div>
        <span className="shrink-0 font-semibold serv-text-primary whitespace-nowrap">{brl(order.total)}</span>
      </div>
    </button>
  );
}

function EmptyColumnState() {
  return (
    <div className="h-full min-h-[160px] rounded-lg border border-dashed serv-border bg-white/60 flex flex-col items-center justify-center text-center p-5">
      <UtensilsCrossed size={24} className="text-gray-300 mb-2" />
      <p className="text-sm font-medium serv-text-secondary">Nenhum pedido neste status.</p>
    </div>
  );
}

function OrderDetailPanel({
  order,
  isLoading,
  onAdvance,
}: {
  order: OrderDetails | null;
  isLoading: boolean;
  onAdvance: (order: OrderDetails) => void;
}) {
  if (isLoading) {
    return (
      <aside className="w-[360px] shrink-0 serv-bg-surface border serv-border rounded-xl p-6 flex items-center justify-center text-center">
        <p className="text-sm serv-text-secondary">Carregando detalhes...</p>
      </aside>
    );
  }

  if (!order) {
    return (
      <aside className="w-[360px] shrink-0 serv-bg-surface border serv-border rounded-xl p-6 flex items-center justify-center text-center">
        <div>
          <ReceiptText size={28} className="mx-auto text-gray-300 mb-3" />
          <p className="font-semibold serv-text-primary">Selecione um pedido</p>
          <p className="text-sm serv-text-secondary mt-1">Os detalhes aparecem aqui.</p>
        </div>
      </aside>
    );
  }

  const actionLabel = getActionLabel(order.status);

  return (
    <aside className="w-[360px] shrink-0 serv-bg-surface border serv-border rounded-xl overflow-hidden flex flex-col">
      <div className="p-5 border-b serv-border">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold serv-text-secondary uppercase tracking-[0.08em]">Pedido</p>
            <h2 className="text-xl font-bold serv-text-primary mt-1">{order.id}</h2>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 serv-text-secondary">
            {getStatusLabel(order.status)}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xs font-bold serv-text-secondary uppercase tracking-[0.08em] mb-3">
            Informações do Cliente
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="serv-text-secondary">Nome</p>
            <p className="font-semibold serv-text-primary">{order.customerName}</p>
          </div>
          <div>
            <p className="serv-text-secondary">Mesa</p>
            <p className="font-semibold serv-text-primary">{order.tableNumber}</p>
          </div>
          <div className="col-span-2">
            <p className="serv-text-secondary">Telefone</p>
            <p className="font-semibold serv-text-primary">{formatBrazilianPhone(order.customerPhone)}</p>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <section>
          <h3 className="text-xs font-bold serv-text-secondary uppercase tracking-[0.08em] mb-3">Itens do Pedido</h3>
          <div className="space-y-3">
            {order.plateItems.map(item => (
              <div key={`${item.dishId}-${item.portionSize}-${item.observation}`} className="rounded-lg border serv-border p-3">
                <div className="flex justify-between gap-3">
                  <p className="font-semibold serv-text-primary text-sm">{item.dishName}</p>
                  <span className="text-xs font-semibold text-[#C9623A] bg-[#C9623A]/10 px-2 py-1 rounded-full h-fit">
                    {PORTION_LABELS[item.portionSize]}
                  </span>
                </div>
                {typeof item.unitPrice === 'number' && (
                  <p className="text-sm serv-text-secondary mt-1">
                    {brl(item.unitPrice)}
                    {typeof item.subtotal === 'number' ? ` · Subtotal: ${brl(item.subtotal)}` : ''}
                  </p>
                )}
                {item.observation && (
                  <p className="text-sm serv-text-secondary italic mt-2">"{item.observation}"</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-xs font-bold serv-text-secondary uppercase tracking-[0.08em] mb-3">Extras</h3>
          {order.extraItems.length === 0 ? (
            <p className="text-sm serv-text-secondary">Nenhum extra selecionado.</p>
          ) : (
            <div className="space-y-3">
              {order.extraItems.map(extra => (
                <div key={extra.extraItemId} className="rounded-lg border serv-border p-3">
                  <p className="font-semibold serv-text-primary text-sm">{extra.name}</p>
                  <p className="text-sm serv-text-secondary mt-1">
                    {extra.quantity}x &middot; {brl(extra.unitPrice)}
                  </p>
                  <p className="text-sm font-semibold serv-text-secondary mt-1">
                    Subtotal: {brl(extra.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-lg bg-gray-50 border serv-border p-4 space-y-2">
          {typeof order.buffetSubtotal === 'number' && (
            <div className="flex justify-between text-sm">
              <span className="serv-text-secondary">Subtotal buffet</span>
              <span className="font-semibold serv-text-primary">{brl(order.buffetSubtotal)}</span>
            </div>
          )}
          {typeof order.extrasSubtotal === 'number' && (
            <div className="flex justify-between text-sm">
              <span className="serv-text-secondary">Subtotal extras</span>
              <span className="font-semibold serv-text-primary">{brl(order.extrasSubtotal)}</span>
            </div>
          )}
          {(typeof order.buffetSubtotal === 'number' || typeof order.extrasSubtotal === 'number') && (
            <div className="h-px bg-[#EAE4DF]" />
          )}
          <div className="flex justify-between">
            <span className="font-bold serv-text-primary">Total</span>
            <span className="font-bold serv-text-primary">{brl(order.total)}</span>
          </div>
        </section>
      </div>

      {actionLabel && (
        <div className="p-5 border-t serv-border">
          <button
            type="button"
            onClick={() => onAdvance(order)}
            className="w-full rounded-lg bg-[#C9623A] text-white font-semibold text-sm px-4 py-3 hover:bg-[#B85632] transition"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </aside>
  );
}

export function Orders() {
  const restaurant = useRestaurant();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    if (!restaurant.id) {
      setOrdersError('Restaurante não encontrado.');
      setIsLoadingOrders(false);
      return;
    }

    setIsLoadingOrders(true);
    setOrdersError('');

    getOrdersForRestaurant(restaurant.id)
      .then(data => {
        const operationOrders = data.filter(order => OPERATION_STATUSES.includes(order.status));

        setOrders(operationOrders);
        setSelectedOrderId(currentId => (
          currentId && operationOrders.some(order => order.id === currentId)
            ? currentId
            : operationOrders[0]?.id ?? ''
        ));
      })
      .catch(() => {
        setOrders([]);
        setSelectedOrderId('');
        setSelectedOrder(null);
        setOrdersError('Erro ao carregar pedidos.');
      })
      .finally(() => setIsLoadingOrders(false));
  }, [restaurant.id]);

  useEffect(() => {
    if (!selectedOrderId) {
      setSelectedOrder(null);
      return;
    }

    setIsLoadingDetails(true);

    getOrder(selectedOrderId)
      .then(setSelectedOrder)
      .catch(() => {
        setSelectedOrder(null);
        setOrdersError('Erro ao carregar detalhes do pedido.');
      })
      .finally(() => setIsLoadingDetails(false));
  }, [selectedOrderId]);

  const ordersByStatus = useMemo(() => (
    STATUS_COLUMNS.reduce<Record<OrderStatus, OrderSummary[]>>((groups, column) => {
      groups[column.status] = orders.filter(order => getOrderColumnStatus(order.status) === column.status);
      return groups;
    }, {
      PENDING: [],
      RECEIVED: [],
      PREPARING: [],
      READY: [],
      DELIVERED: [],
      CANCELED: [],
    })
  ), [orders]);

  const advanceOrder = async (order: OrderDetails) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    try {
      const updatedOrder = await updateOrderStatus(order.id, nextStatus);

      setOrders(currentOrders => currentOrders.map(currentOrder => (
        currentOrder.id === updatedOrder.id
          ? { ...currentOrder, status: updatedOrder.status }
          : currentOrder
      )));
      setSelectedOrder(updatedOrder);
      showSuccess('Status do pedido atualizado.');
    } catch {
      showError('Erro ao atualizar status do pedido.');
    }
  };

  return (
    <main className="flex-1 p-6 overflow-hidden flex flex-col h-screen">
      <header className="mb-6 flex items-end justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold serv-text-primary tracking-tight">Pedidos</h1>
          <p className="text-sm serv-text-secondary mt-1">Acompanhe a operação do restaurante.</p>
        </div>
        <div className="text-sm font-medium serv-text-secondary flex items-center gap-2">
          <Clock size={16} /> Última atualização: agora
        </div>
      </header>

      {ordersError && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {ordersError}
        </div>
      )}

      {isLoadingOrders ? (
        <div className="flex-1 rounded-xl border serv-border serv-bg-surface flex items-center justify-center">
          <p className="text-sm serv-text-secondary">Carregando pedidos...</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden flex gap-4">
          <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden pb-2">
          <div
            className="grid gap-4 min-w-[1168px] w-full h-full"
            style={{ gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))' }}
          >
            {STATUS_COLUMNS.map(column => {
              const columnOrders = ordersByStatus[column.status];
              const Icon = column.icon;

              return (
                <section key={column.status} className={`min-w-0 flex flex-col bg-gray-50/50 rounded-xl border serv-border overflow-hidden ${column.status === 'DELIVERED' ? 'opacity-80' : ''}`}>
                  <div className="p-4 border-b serv-border flex justify-between items-center gap-3 serv-bg-surface shrink-0 min-w-0">
                    <div className="min-w-0 flex items-center gap-2">
                      <Icon size={16} className="serv-text-secondary" />
                      <h3 className="font-semibold serv-text-primary whitespace-nowrap overflow-hidden text-ellipsis">{column.label}</h3>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-gray-100 text-xs font-bold serv-text-secondary">
                      {columnOrders.length}
                    </span>
                  </div>
                  <div className="p-3 flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-3">
                    {columnOrders.length === 0 ? (
                      <EmptyColumnState />
                    ) : (
                      columnOrders.map(order => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          active={selectedOrderId === order.id}
                          onClick={() => setSelectedOrderId(order.id)}
                        />
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
          </div>

          <OrderDetailPanel
            order={selectedOrder}
            isLoading={isLoadingDetails}
            onAdvance={advanceOrder}
          />
        </div>
      )}
    </main>
  );
}

export default Orders;
