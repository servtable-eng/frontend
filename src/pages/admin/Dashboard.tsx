import { useEffect, useState } from 'react';
import { CheckCircle2, CheckSquare, ClipboardList, Clock } from 'lucide-react';
import { getConfiguredRestaurantId } from '@/services/api';
import { getRestaurantDashboard } from '@/services/restaurants/dashboard.service';
import type { RestaurantDashboard } from '@/types/dashboard';
import type { OrderStatus } from '@/types/order';
import { DashboardMetricSkeleton, RestaurantTableSkeleton } from '@/components/loading';
import '../../styles/tokens.css';

const restaurantId = getConfiguredRestaurantId();

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  RECEIVED: 'Recebido',
  PREPARING: 'Preparando',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-[#F59E0B] text-white',
  RECEIVED: 'bg-[#F59E0B] text-white',
  PREPARING: 'bg-[#C9623A] text-white',
  READY: 'bg-[#22C55E] text-white',
  DELIVERED: 'bg-[#6B7280] text-white',
  CANCELED: 'bg-[#EF4444] text-white',
};

function formatDashboardDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatOrderTime(createdAt: string) {
  const time = createdAt.match(/T(\d{2}:\d{2})/)?.[1];

  if (time) {
    return time;
  }

  const date = new Date(createdAt);
  return Number.isNaN(date.getTime())
    ? '--:--'
    : new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);
}

function getOrderDisplayId(shortId: string | null | undefined, id: string) {
  return shortId?.trim() || `#${id.replaceAll('-', '').slice(-4).toUpperCase()}`;
}

export function Dashboard() {
  const [dashboard, setDashboard] = useState<RestaurantDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    if (!restaurantId) {
      setError('Restaurante não configurado.');
      setIsLoading(false);
      return;
    }

    getRestaurantDashboard(restaurantId)
      .then(data => {
        if (isActive) {
          setDashboard(data);
          setError('');
        }
      })
      .catch(() => {
        if (isActive) {
          setError('Não foi possível carregar os dados do dashboard.');
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold serv-text-primary tracking-tight">Dashboard</h1>
          {dashboard && <p className="serv-text-secondary mt-1">{formatDashboardDate(dashboard.date)}</p>}
        </div>
      </header>

      {isLoading ? (
        <div role="status" aria-label="Carregando dashboard">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }, (_, index) => <DashboardMetricSkeleton key={index} />)}
          </div>
          <RestaurantTableSkeleton />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : dashboard && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="serv-bg-surface p-5 rounded-xl border serv-border flex flex-col">
              <div className="flex items-center gap-2 serv-text-secondary mb-2">
                <ClipboardList size={18} />
                <span className="text-sm font-medium">Pedidos Hoje</span>
              </div>
              <span className="text-3xl font-bold serv-text-primary">{dashboard.ordersToday}</span>
            </div>
            <div className="serv-bg-surface p-5 rounded-xl border serv-border flex flex-col">
              <div className="flex items-center gap-2 text-[#C9623A] mb-2">
                <Clock size={18} />
                <span className="text-sm font-medium">Em Preparo</span>
              </div>
              <span className="text-3xl font-bold serv-text-primary">{dashboard.preparingOrders}</span>
            </div>
            <div className="serv-bg-surface p-5 rounded-xl border serv-border flex flex-col">
              <div className="flex items-center gap-2 text-[#22C55E] mb-2">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">Prontos</span>
              </div>
              <span className="text-3xl font-bold serv-text-primary">{dashboard.readyOrders}</span>
            </div>
            <div className="serv-bg-surface p-5 rounded-xl border serv-border flex flex-col">
              <div className="flex items-center gap-2 serv-text-secondary mb-2">
                <CheckSquare size={18} />
                <span className="text-sm font-medium">Entregues</span>
              </div>
              <span className="text-3xl font-bold serv-text-primary">{dashboard.deliveredOrders}</span>
            </div>
          </div>

          <div className="serv-bg-surface rounded-xl border serv-border overflow-hidden">
            <div className="p-5 border-b serv-border">
              <h2 className="text-lg font-semibold serv-text-primary tracking-tight">Pedidos Recentes</h2>
            </div>
            {dashboard.recentOrders.length === 0 ? (
              <div className="p-8 text-center text-sm serv-text-secondary">
                Nenhum pedido recente encontrado.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-5 py-3 text-xs font-medium serv-text-secondary uppercase tracking-wider border-b serv-border">Pedido</th>
                    <th className="px-5 py-3 text-xs font-medium serv-text-secondary uppercase tracking-wider border-b serv-border">Mesa</th>
                    <th className="px-5 py-3 text-xs font-medium serv-text-secondary uppercase tracking-wider border-b serv-border">Status</th>
                    <th className="px-5 py-3 text-xs font-medium serv-text-secondary uppercase tracking-wider border-b serv-border text-right">Horário</th>
                  </tr>
                </thead>
                <tbody className="divide-y serv-border">
                  {dashboard.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium serv-text-primary">
                        {getOrderDisplayId(order.shortId, order.id)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm serv-text-secondary">Mesa {order.tableNumber}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-500 text-white'}`}>
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm serv-text-secondary text-right">
                        {formatOrderTime(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default Dashboard;
