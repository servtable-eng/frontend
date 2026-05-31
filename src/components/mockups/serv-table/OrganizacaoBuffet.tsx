import { Home, ClipboardList, BookOpen, BarChart2, Settings, UtensilsCrossed, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import './_shared/tokens.css';

const NAV_ITEMS = [
  { icon: Home,          label: 'Início',         href: 'Início' },
  { icon: ClipboardList, label: 'Pedidos',         href: 'Pedidos' },
  { icon: BookOpen,      label: 'Cardápio',        href: 'Cardápio' },
  { icon: BarChart2,     label: 'Relatórios',      href: 'Relatórios' },
  { icon: Settings,      label: 'Configurações',   href: 'Configurações' },
];
const ACTIVE = 'Cardápio';

const GROUPS = [
  {
    name: 'Entradas',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    items: [
      { id: 'e1', name: 'Pão de Queijo', image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=100&h=100&fit=crop', available: true },
      { id: 'e2', name: 'Caldo Verde', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=100&h=100&fit=crop', available: true },
    ]
  },
  {
    name: 'Pratos Principais',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    items: [
      { id: 'p1', name: 'Frango Grelhado', image: '/__mockup/images/frango.png', available: true },
      { id: 'p2', name: 'Feijoada', image: '/__mockup/images/feijoada.png', available: true },
      { id: 'p3', name: 'Filé de Peixe', image: '/__mockup/images/peixe.png', available: false },
    ]
  },
  {
    name: 'Saladas',
    color: 'bg-green-100 text-green-800 border-green-200',
    items: [
      { id: 's1', name: 'Salada Caesar', image: '/__mockup/images/salada.png', available: true },
      { id: 's2', name: 'Salada Tropical', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop', available: true },
    ]
  },
  {
    name: 'Sobremesas',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    items: [
      { id: 'd1', name: 'Pudim de Leite', image: '/__mockup/images/pudim.png', available: true },
      { id: 'd2', name: 'Mousse de Maracujá', image: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?w=100&h=100&fit=crop', available: true },
    ]
  },
  {
    name: 'Bebidas',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    items: [
      { id: 'b1', name: 'Suco de Laranja', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=100&h=100&fit=crop', available: true },
      { id: 'b2', name: 'Água Mineral', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=100&h=100&fit=crop', available: true },
    ]
  }
];

export function OrganizacaoBuffet() {
  return (
    <div className="min-h-screen flex serv-bg-background font-sans serv-theme">
      {/* Sidebar */}
      <aside style={{ width: 240, background: '#fff', borderRight: '1px solid #EAE4DF', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#C9623A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#C9623A', letterSpacing: '-0.01em' }}>ServTable</span>
        </div>
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {NAV_ITEMS.map(item => (
            <a key={item.label} href="#" style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 8, marginBottom: 2, textDecoration: 'none', fontSize: 14, fontWeight: 500,
              background: item.label === ACTIVE ? '#C9623A' : 'transparent',
              color: item.label === ACTIVE ? '#fff' : '#6B7280',
            }}>
              <item.icon size={18} />
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold serv-text-primary tracking-tight mb-1">Organização do Buffet</h1>
              <p className="text-sm serv-text-secondary">Arraste os pratos para reorganizar a ordem de exibição no buffet</p>
            </div>
            <button className="serv-bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm">
              Salvar ordem
            </button>
          </header>

          <div className="space-y-6">
            {GROUPS.map((group, gIdx) => (
              <div key={group.name} className="bg-white rounded-xl shadow-sm border serv-border overflow-hidden">
                <div className={`px-4 py-3 border-b border-gray-100 flex items-center gap-2 ${group.color.split(' ')[0]} bg-opacity-20`}>
                  <h2 className={`font-semibold text-sm ${group.color.split(' ')[1]}`}>{group.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${group.color.split(' ')[2]} ${group.color.split(' ')[1]} bg-white bg-opacity-50`}>
                    {group.items.length} itens
                  </span>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {group.items.map((item, iIdx) => (
                    <div 
                      key={item.id} 
                      className={`flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors group ${!item.available ? 'opacity-50 grayscale' : ''}`}
                    >
                      <button className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing">
                        <GripVertical size={20} />
                      </button>
                      
                      <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-200">
                        {iIdx + 1}
                      </div>

                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded shadow-sm object-cover border border-gray-200" />
                      
                      <div className="flex-1">
                        <span className="font-medium text-sm text-gray-800">{item.name}</span>
                      </div>

                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                        <button className="text-gray-400 hover:text-gray-700 p-0.5 hover:bg-gray-200 rounded" disabled={iIdx === 0}>
                          <ChevronUp size={14} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-700 p-0.5 hover:bg-gray-200 rounded" disabled={iIdx === group.items.length - 1}>
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
