import { Home, ClipboardList, BookOpen, BarChart2, Settings, UtensilsCrossed, ImagePlus, AlertCircle } from 'lucide-react';
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
  { id: 1, name: 'Frango Grelhado', date: '28/05/2026', image: '/__mockup/images/frango.png', stale: false },
  { id: 2, name: 'Arroz com Feijão', date: '12/03/2026', image: '/__mockup/images/arroz-feijao.png', stale: true },
  { id: 3, name: 'Salada Caesar', date: '25/05/2026', image: '/__mockup/images/salada.png', stale: false },
  { id: 4, name: 'Feijoada', date: '05/01/2026', image: '/__mockup/images/feijoada.png', stale: true },
  { id: 5, name: 'Filé de Peixe', date: '27/05/2026', image: '/__mockup/images/peixe.png', stale: false },
  { id: 6, name: 'Pudim de Leite', date: '10/02/2026', image: '/__mockup/images/pudim.png', stale: true },
];

export function AtualizacaoImagens() {
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
        <div className="max-w-5xl mx-auto space-y-8">
          <header>
            <h1 className="text-2xl font-bold serv-text-primary tracking-tight">Atualização de Imagens</h1>
          </header>

          <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4 group-hover:scale-105 transition-transform">
              <ImagePlus className="text-[#C9623A]" size={24} />
            </div>
            <p className="text-base font-medium text-gray-800 mb-1">Arraste imagens aqui ou clique para selecionar</p>
            <p className="text-sm text-gray-500">PNG, JPG ou WEBP · Máx. 5MB por arquivo</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold serv-text-primary">Pratos Cadastrados</h2>
              <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">{DISHES.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DISHES.map(dish => (
                <div key={dish.id} className="bg-white border serv-border rounded-xl overflow-hidden shadow-sm group">
                  <div className="relative aspect-video bg-gray-100">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {dish.stale && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded shadow flex items-center gap-1.5 backdrop-blur-sm bg-opacity-90">
                        <AlertCircle size={12} />
                        Foto desatualizada
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-snug truncate">{dish.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Atualizado em {dish.date}</p>
                    </div>
                    <button className="w-full py-2 border border-gray-200 hover:border-[#C9623A] hover:text-[#C9623A] rounded-lg text-sm font-medium text-gray-700 transition-colors">
                      Atualizar imagem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
