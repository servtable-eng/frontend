import { Clock } from 'lucide-react';
import '../../styles/tokens.css';

const KANBAN_DATA = {
  recebido: [
    { id: '#049', table: 'Mesa 03', items: 2, total: 'R$ 38,80', time: '12:52' },
    { id: '#048', table: 'Balcão', items: 1, total: 'R$ 14,50', time: '12:49' },
    { id: '#047', table: 'Mesa 12', items: 4, total: 'R$ 82,60', time: '12:45' },
  ],
  preparando: [
    { id: '#046', table: 'Mesa 04', items: 3, total: 'R$ 56,30', time: '12:42' },
    { id: '#045', table: 'Mesa 08', items: 2, total: 'R$ 33,40', time: '12:38' },
  ],
  pronto: [
    { id: '#044', table: 'Mesa 15', items: 5, total: 'R$ 112,00', time: '12:35' },
    { id: '#043', table: 'Mesa 02', items: 2, total: 'R$ 41,80', time: '12:30' },
  ],
  entregue: [
    { id: '#042', table: 'Balcão', items: 1, total: 'R$ 8,50', time: '12:25' },
    { id: '#041', table: 'Mesa 07', items: 3, total: 'R$ 49,70', time: '12:20' },
    { id: '#040', table: 'Mesa 11', items: 2, total: 'R$ 29,00', time: '12:15' },
    { id: '#039', table: 'Mesa 05', items: 4, total: 'R$ 95,20', time: '12:10' },
  ]
};

const BORDER_COLORS = {
  recebido: 'border-l-[#F59E0B]',
  preparando: 'border-l-[#C9623A]',
  pronto: 'border-l-[#22C55E]',
  entregue: 'border-l-[#6B7280]',
};

export function Orders() {
  return (
    <main className="flex-1 p-6 overflow-hidden flex flex-col h-screen">
        <header className="mb-6 flex items-end justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold serv-text-primary tracking-tight">Pedidos em Tempo Real</h1>
          </div>
          <div className="text-sm font-medium serv-text-secondary flex items-center gap-2">
            <Clock size={16} /> Última atualização: agora
          </div>
        </header>

        {/* Kanban Board */}
        <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden">
          {/* Recebido */}
          <div className="flex flex-col bg-gray-50/50 rounded-xl border serv-border overflow-hidden">
            <div className="p-4 border-b serv-border flex justify-between items-center serv-bg-surface shrink-0">
              <h3 className="font-semibold serv-text-primary">Recebido</h3>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-bold serv-text-secondary">{KANBAN_DATA.recebido.length}</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {KANBAN_DATA.recebido.map(order => (
                <div key={order.id} className={`serv-bg-surface rounded-lg shadow-sm border serv-border border-l-4 ${BORDER_COLORS.recebido} p-4 flex flex-col gap-3`}>
                  <div className="flex justify-between items-start">
                    <span className="text-lg font-bold serv-text-primary tracking-tight">{order.id}</span>
                    <span className="text-sm font-medium serv-text-secondary bg-gray-100 px-2 py-1 rounded">{order.time}</span>
                  </div>
                  <div>
                    <p className="font-semibold serv-text-primary text-base">{order.table}</p>
                    <p className="text-sm serv-text-secondary mt-0.5">{order.items} itens</p>
                  </div>
                  <div className="pt-3 border-t serv-border flex justify-between items-center mt-1">
                    <span className="text-sm serv-text-secondary">Total</span>
                    <span className="font-semibold serv-text-primary">{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preparando */}
          <div className="flex flex-col bg-gray-50/50 rounded-xl border serv-border overflow-hidden">
            <div className="p-4 border-b serv-border flex justify-between items-center serv-bg-surface shrink-0">
              <h3 className="font-semibold serv-text-primary">Preparando</h3>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-bold serv-text-secondary">{KANBAN_DATA.preparando.length}</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {KANBAN_DATA.preparando.map(order => (
                <div key={order.id} className={`serv-bg-surface rounded-lg shadow-sm border serv-border border-l-4 ${BORDER_COLORS.preparando} p-4 flex flex-col gap-3`}>
                  <div className="flex justify-between items-start">
                    <span className="text-lg font-bold serv-text-primary tracking-tight">{order.id}</span>
                    <span className="text-sm font-medium text-[#C9623A] bg-[#C9623A]/10 px-2 py-1 rounded">{order.time}</span>
                  </div>
                  <div>
                    <p className="font-semibold serv-text-primary text-base">{order.table}</p>
                    <p className="text-sm serv-text-secondary mt-0.5">{order.items} itens</p>
                  </div>
                  <div className="pt-3 border-t serv-border flex justify-between items-center mt-1">
                    <span className="text-sm serv-text-secondary">Total</span>
                    <span className="font-semibold serv-text-primary">{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pronto */}
          <div className="flex flex-col bg-gray-50/50 rounded-xl border serv-border overflow-hidden">
            <div className="p-4 border-b serv-border flex justify-between items-center serv-bg-surface shrink-0">
              <h3 className="font-semibold serv-text-primary">Pronto</h3>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-bold serv-text-secondary">{KANBAN_DATA.pronto.length}</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {KANBAN_DATA.pronto.map(order => (
                <div key={order.id} className={`serv-bg-surface rounded-lg shadow-sm border serv-border border-l-4 ${BORDER_COLORS.pronto} p-4 flex flex-col gap-3`}>
                  <div className="flex justify-between items-start">
                    <span className="text-lg font-bold serv-text-primary tracking-tight">{order.id}</span>
                    <span className="text-sm font-medium serv-text-secondary bg-gray-100 px-2 py-1 rounded">{order.time}</span>
                  </div>
                  <div>
                    <p className="font-semibold serv-text-primary text-base">{order.table}</p>
                    <p className="text-sm serv-text-secondary mt-0.5">{order.items} itens</p>
                  </div>
                  <div className="pt-3 border-t serv-border flex justify-between items-center mt-1">
                    <span className="text-sm serv-text-secondary">Total</span>
                    <span className="font-semibold serv-text-primary">{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Entregue */}
          <div className="flex flex-col bg-gray-50/50 rounded-xl border serv-border overflow-hidden opacity-75">
            <div className="p-4 border-b serv-border flex justify-between items-center serv-bg-surface shrink-0">
              <h3 className="font-semibold serv-text-primary">Entregue</h3>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-bold serv-text-secondary">{KANBAN_DATA.entregue.length}</span>
            </div>
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {KANBAN_DATA.entregue.map(order => (
                <div key={order.id} className={`serv-bg-surface rounded-lg shadow-sm border serv-border border-l-4 ${BORDER_COLORS.entregue} p-4 flex flex-col gap-3`}>
                  <div className="flex justify-between items-start">
                    <span className="text-lg font-bold serv-text-primary tracking-tight">{order.id}</span>
                    <span className="text-sm font-medium serv-text-secondary bg-gray-100 px-2 py-1 rounded">{order.time}</span>
                  </div>
                  <div>
                    <p className="font-semibold serv-text-primary text-base">{order.table}</p>
                    <p className="text-sm serv-text-secondary mt-0.5">{order.items} itens</p>
                  </div>
                  <div className="pt-3 border-t serv-border flex justify-between items-center mt-1">
                    <span className="text-sm serv-text-secondary">Total</span>
                    <span className="font-semibold serv-text-primary">{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </main>
  );
}

export default Orders;
