import React from 'react';
import { Home, ClipboardList, BookOpen, BarChart2, Settings, UtensilsCrossed, ChevronRight, UploadCloud } from 'lucide-react';
import './_shared/tokens.css';

const NAV_ITEMS = [
  { icon: Home,          label: 'Início',         href: 'Início' },
  { icon: ClipboardList, label: 'Pedidos',         href: 'Pedidos' },
  { icon: BookOpen,      label: 'Cardápio',        href: 'Cardápio' },
  { icon: BarChart2,     label: 'Relatórios',      href: 'Relatórios' },
  { icon: Settings,      label: 'Configurações',   href: 'Configurações' },
];
const ACTIVE = 'Cardápio';

export function CadastroPrato() {
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
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8 pb-32 space-y-8">
          <header className="space-y-2">
            <div className="flex items-center text-sm serv-text-secondary gap-2 mb-2">
              <a href="#" className="hover:text-[#C9623A]">Cardápio</a>
              <ChevronRight size={14} />
              <span className="font-medium serv-text-primary">Editar Prato</span>
            </div>
            <h1 className="text-2xl font-bold serv-text-primary tracking-tight">Editar Prato</h1>
          </header>

          <div className="flex gap-8 items-start">
            {/* Left Column */}
            <div className="flex-1 space-y-6 bg-white p-6 rounded-xl border serv-border shadow-sm">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium serv-text-primary">Nome do prato</label>
                  <input type="text" defaultValue="Frango Grelhado" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9623A]" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium serv-text-primary">Descrição</label>
                  <textarea rows={3} defaultValue="Peito de frango temperado e grelhado na brasa, acompanha farofa e vinagrete." className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9623A]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium serv-text-primary">Ingredientes</label>
                  <textarea rows={2} defaultValue="Frango, azeite, alho, limão, ervas finas, farofa de mandioca, vinagrete" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9623A]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium serv-text-primary">Categoria</label>
                    <select defaultValue="Quentes" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9623A] bg-white">
                      <option>Quentes</option>
                      <option>Frios</option>
                      <option>Saladas</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium serv-text-primary">Posição da cuba</label>
                    <input type="number" defaultValue="1" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9623A]" />
                    <p className="text-xs text-gray-500">Ordem de exibição no buffet</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium serv-text-primary">Preço interno</label>
                  <input type="text" defaultValue="R$ 18,90" className="w-full md:w-1/2 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9623A]" />
                  <p className="text-xs text-gray-500">Visível apenas para gestão. Clientes não veem o preço.</p>
                </div>

                <div className="pt-4 border-t serv-border flex items-center justify-between">
                  <span className="text-sm font-medium serv-text-primary">Prato disponível no buffet</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 transition-colors">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-80 space-y-4">
              <h2 className="text-base font-semibold serv-text-primary">Imagem do Prato</h2>
              <div className="bg-white p-4 rounded-xl border serv-border shadow-sm flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border serv-border bg-gray-50 mb-3">
                  <img src="/__mockup/images/frango.png" alt="Frango Grelhado" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-gray-500 mb-4 text-center">Atualizado em 28/05/2026</p>
                <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <UploadCloud size={16} />
                  Substituir imagem
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="fixed bottom-0 left-60 right-0 bg-white border-t serv-border px-8 py-4 flex justify-end gap-3 z-10">
          <button className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            Cancelar
          </button>
          <button className="px-5 py-2 rounded-lg text-sm font-medium text-white serv-bg-primary hover:opacity-90 transition-opacity shadow-sm">
            Salvar alterações
          </button>
        </div>
      </main>
    </div>
  );
}
