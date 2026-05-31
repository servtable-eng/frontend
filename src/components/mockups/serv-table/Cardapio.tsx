import { useState } from 'react';
import { Home, ClipboardList, BookOpen, BarChart2, Settings, UtensilsCrossed, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import './_shared/tokens.css';

const NAV_ITEMS = [
  { icon: Home,          label: 'Início',         href: 'Início' },
  { icon: ClipboardList, label: 'Pedidos',         href: 'Pedidos' },
  { icon: BookOpen,      label: 'Cardápio',        href: 'Cardápio' },
  { icon: BarChart2,     label: 'Relatórios',      href: 'Relatórios' },
  { icon: Settings,      label: 'Configurações',   href: 'Configurações' },
];
const ACTIVE = 'Cardápio';

const DISHES = [
  { id: 1, name: 'Frango Grelhado', category: 'Quentes', position: 'Cuba 1', available: true, image: '/__mockup/images/frango.png' },
  { id: 2, name: 'Arroz com Feijão', category: 'Quentes', position: 'Cuba 2', available: true, image: '/__mockup/images/arroz-feijao.png' },
  { id: 3, name: 'Salada Caesar', category: 'Saladas', position: 'Cuba 3', available: true, image: '/__mockup/images/salada.png' },
  { id: 4, name: 'Feijoada', category: 'Pratos Principais', position: 'Cuba 4', available: true, image: '/__mockup/images/feijoada.png' },
  { id: 5, name: 'Filé de Peixe', category: 'Quentes', position: 'Cuba 5', available: false, image: '/__mockup/images/peixe.png' },
  { id: 6, name: 'Pudim de Leite', category: 'Sobremesas', position: 'Cuba 6', available: true, image: '/__mockup/images/pudim.png' },
];

export function Cardapio() {
  const [dishes, setDishes] = useState(DISHES);

  const toggleAvailability = (id: number) => {
    setDishes(dishes.map(d => d.id === id ? { ...d, available: !d.available } : d));
  };

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
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex justify-between items-center">
            <h1 className="text-2xl font-bold serv-text-primary tracking-tight">Cardápio</h1>
            <button className="flex items-center gap-2 serv-bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              <Plus size={18} />
              Novo prato
            </button>
          </header>

          <div className="flex justify-between items-center bg-white p-4 rounded-xl serv-border border shadow-sm">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar prato..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9623A] focus:border-transparent text-sm"
              />
            </div>
            <select className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9623A] focus:border-transparent text-sm text-gray-700 bg-white">
              <option>Todos</option>
              <option>Quentes</option>
              <option>Frios</option>
              <option>Saladas</option>
              <option>Sobremesas</option>
              <option>Bebidas</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border serv-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b serv-border serv-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium w-20">Imagem</th>
                  <th className="px-6 py-4 font-medium">Nome do Prato</th>
                  <th className="px-6 py-4 font-medium">Categoria</th>
                  <th className="px-6 py-4 font-medium">Posição</th>
                  <th className="px-6 py-4 font-medium">Disponibilidade</th>
                  <th className="px-6 py-4 font-medium w-24">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y serv-border">
                {dishes.map((dish, idx) => (
                  <tr key={dish.id} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-[#FAFAFA] hover:bg-gray-50'}>
                    <td className="px-6 py-3">
                      <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-lg object-cover border" />
                    </td>
                    <td className="px-6 py-3 font-medium serv-text-primary">{dish.name}</td>
                    <td className="px-6 py-3 serv-text-secondary">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-full text-xs font-medium text-gray-600">
                        {dish.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 serv-text-secondary">{dish.position}</td>
                    <td className="px-6 py-3">
                      <button 
                        onClick={() => toggleAvailability(dish.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dish.available ? 'bg-green-500' : 'bg-gray-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dish.available ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-400 hover:text-[#C9623A] transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
