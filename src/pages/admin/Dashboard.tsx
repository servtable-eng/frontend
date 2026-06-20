import { ClipboardList, Clock, CheckCircle2, CheckSquare } from 'lucide-react';
import '../../styles/tokens.css';

const RECENT_ORDERS = [
  { id: '#047', table: 'Mesa 12', status: 'Recebido', time: '12:45' },
  { id: '#046', table: 'Mesa 04', status: 'Preparando', time: '12:42' },
  { id: '#045', table: 'Mesa 08', status: 'Preparando', time: '12:38' },
  { id: '#044', table: 'Mesa 15', status: 'Pronto', time: '12:35' },
  { id: '#043', table: 'Mesa 02', status: 'Pronto', time: '12:30' },
  { id: '#042', table: 'Balcão', status: 'Entregue', time: '12:25' },
  { id: '#041', table: 'Mesa 07', status: 'Entregue', time: '12:20' },
];

const STATUS_COLORS: Record<string, string> = {
  'Recebido': 'bg-[#F59E0B] text-white',
  'Preparando': 'bg-[#C9623A] text-white',
  'Pronto': 'bg-[#22C55E] text-white',
  'Entregue': 'bg-[#6B7280] text-white',
};

export function Dashboard() {
  return (
    <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold serv-text-primary tracking-tight">Dashboard</h1>
            <p className="serv-text-secondary mt-1">30 de maio de 2026</p>
          </div>
        </header>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="serv-bg-surface p-5 rounded-xl border serv-border flex flex-col">
            <div className="flex items-center gap-2 serv-text-secondary mb-2">
              <ClipboardList size={18} />
              <span className="text-sm font-medium">Pedidos Hoje</span>
            </div>
            <span className="text-3xl font-bold serv-text-primary">47</span>
          </div>
          <div className="serv-bg-surface p-5 rounded-xl border serv-border flex flex-col">
            <div className="flex items-center gap-2 text-[#C9623A] mb-2">
              <Clock size={18} />
              <span className="text-sm font-medium">Em Preparo</span>
            </div>
            <span className="text-3xl font-bold serv-text-primary">8</span>
          </div>
          <div className="serv-bg-surface p-5 rounded-xl border serv-border flex flex-col">
            <div className="flex items-center gap-2 text-[#22C55E] mb-2">
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">Prontos</span>
            </div>
            <span className="text-3xl font-bold serv-text-primary">5</span>
          </div>
          <div className="serv-bg-surface p-5 rounded-xl border serv-border flex flex-col">
            <div className="flex items-center gap-2 serv-text-secondary mb-2">
              <CheckSquare size={18} />
              <span className="text-sm font-medium">Entregues</span>
            </div>
            <span className="text-3xl font-bold serv-text-primary">34</span>
          </div>
        </div>

        {/* Table */}
        <div className="serv-bg-surface rounded-xl border serv-border overflow-hidden">
          <div className="p-5 border-b serv-border">
            <h2 className="text-lg font-semibold serv-text-primary tracking-tight">Pedidos Recentes</h2>
          </div>
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
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap text-sm font-medium serv-text-primary">{order.id}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm serv-text-secondary">{order.table}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm serv-text-secondary text-right">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </main>
  );
}

export default Dashboard;
