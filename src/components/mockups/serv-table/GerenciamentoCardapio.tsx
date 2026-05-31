import { useState, type ChangeEvent } from 'react';
import {
  UtensilsCrossed, Home, ClipboardList, BookOpen, BarChart2, Settings,
  Edit2, Trash2, AlertCircle,
} from 'lucide-react';
import { SearchInput, Select, Button, Badge } from '@workspace/ui';
import '@workspace/ui/styles.css';
import './_shared/tokens.css';

const NAV_ITEMS = [
  { icon: Home,          label: 'Início'       },
  { icon: ClipboardList, label: 'Pedidos'       },
  { icon: BookOpen,      label: 'Cardápio'      },
  { icon: BarChart2,     label: 'Relatórios'    },
  { icon: Settings,      label: 'Configurações' },
];
const ACTIVE = 'Cardápio';

type Dish = {
  id: number;
  name: string;
  category: string;
  position: string;
  available: boolean;
  image: string;
};

const DISHES: Dish[] = [
  { id: 1, name: 'Frango Grelhado',     category: 'Quentes',           position: 'Cuba 1', available: true,  image: '/__mockup/images/frango.png'        },
  { id: 2, name: 'Arroz com Feijão',    category: 'Quentes',           position: 'Cuba 2', available: true,  image: '/__mockup/images/arroz-feijao.png'  },
  { id: 3, name: 'Salada Caesar',       category: 'Saladas',           position: 'Cuba 3', available: true,  image: '/__mockup/images/salada.png'        },
  { id: 4, name: 'Feijoada',            category: 'Pratos Principais', position: 'Cuba 4', available: true,  image: '/__mockup/images/feijoada.png'      },
  { id: 5, name: 'Filé de Peixe',       category: 'Quentes',           position: 'Cuba 5', available: false, image: '/__mockup/images/peixe.png'         },
  { id: 6, name: 'Pudim de Leite',      category: 'Sobremesas',        position: 'Cuba 6', available: true,  image: '/__mockup/images/pudim.png'         },
  { id: 7, name: 'Macarrão à Bolonhesa',category: 'Quentes',           position: 'Cuba 7', available: true,  image: '/__mockup/images/arroz-feijao.png'  },
  { id: 8, name: 'Mousse de Maracujá',  category: 'Sobremesas',        position: 'Cuba 8', available: false, image: '/__mockup/images/pudim.png'         },
];

const CATEGORY_OPTIONS = [
  { value: '',                  label: 'Todas as Categorias' },
  { value: 'Quentes',           label: 'Quentes'             },
  { value: 'Saladas',           label: 'Saladas'             },
  { value: 'Pratos Principais', label: 'Pratos Principais'   },
  { value: 'Sobremesas',        label: 'Sobremesas'          },
  { value: 'Bebidas',           label: 'Bebidas'             },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center',
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: checked ? '#22C55E' : '#D1D5DB',
        transition: 'background 0.2s',
        padding: 0, flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

function ImageCell({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div style={{
        width: 48, height: 48, borderRadius: 10,
        background: '#F3F4F6', border: '1px solid #EAE4DF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#D1D5DB',
      }}>
        <AlertCircle size={20} />
      </div>
    );
  }
  return (
    <img
      src={src} alt={alt}
      onError={() => setFailed(true)}
      style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', border: '1px solid #EAE4DF', display: 'block' }}
    />
  );
}

export function GerenciamentoCardapio() {
  const [dishes, setDishes]       = useState<Dish[]>(DISHES);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('');

  const filtered = dishes.filter(d => {
    const matchSearch   = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === '' || d.category === category;
    return matchSearch && matchCategory;
  });

  const toggleAvailability = (id: number) => {
    setDishes(prev => prev.map(d => d.id === id ? { ...d, available: !d.available } : d));
  };

  const deleteDish = (id: number) => {
    setDishes(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8F6F4', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{ width: 240, background: '#fff', borderRight: '1px solid #EAE4DF', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#C9623A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#C9623A', letterSpacing: '-0.01em' }}>ServTable</span>
        </div>

        <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <a key={item.label} href="#" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
              fontSize: 14, fontWeight: 500,
              background: item.label === ACTIVE ? '#C9623A' : 'transparent',
              color:      item.label === ACTIVE ? '#fff'    : '#6B7280',
            }}>
              <item.icon size={18} />
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #EAE4DF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F3F0ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13, color: '#C9623A' }}>
              AG
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1F2937' }}>Ana Gerente</p>
              <p style={{ margin: 0, fontSize: 11, color: '#6B7280' }}>Gerente</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em' }}>
                Gerenciamento de Cardápio
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6B7280' }}>
                {dishes.length} pratos cadastrados · {dishes.filter(d => d.available).length} disponíveis
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => {}}>
              + Adicionar prato
            </Button>
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '16px 20px', borderRadius: 12, border: '1px solid #EAE4DF' }}>
            <div style={{ flex: 1, maxWidth: 320 }}>
              <SearchInput
                placeholder="Buscar prato..."
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ width: 220 }}>
              <Select
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
              />
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge variant="success" dot>{dishes.filter(d => d.available).length} disponíveis</Badge>
              <Badge variant="secondary" dot>{dishes.filter(d => !d.available).length} indisponíveis</Badge>
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid #EAE4DF', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#FAFAF9', borderBottom: '1px solid #EAE4DF' }}>
                  {['Imagem', 'Nome', 'Categoria', 'Disponibilidade', 'Posição da Cuba', 'Ações'].map(col => (
                    <th key={col} style={{
                      padding: '12px 20px', textAlign: 'left',
                      fontSize: 11, fontWeight: 600, color: '#6B7280',
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                      Nenhum prato encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((dish, i) => (
                    <tr
                      key={dish.id}
                      style={{
                        borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #EAE4DF',
                        background: i % 2 === 0 ? '#fff' : '#FAFAF9',
                      }}
                    >
                      {/* Imagem */}
                      <td style={{ padding: '14px 20px' }}>
                        <ImageCell src={dish.image} alt={dish.name} />
                      </td>

                      {/* Nome */}
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1F2937' }}>
                        {dish.name}
                      </td>

                      {/* Categoria */}
                      <td style={{ padding: '14px 20px' }}>
                        <Badge variant="secondary">{dish.category}</Badge>
                      </td>

                      {/* Disponibilidade */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Toggle
                            checked={dish.available}
                            onChange={() => toggleAvailability(dish.id)}
                          />
                          <span style={{ fontSize: 13, color: dish.available ? '#15803D' : '#9CA3AF', fontWeight: 500 }}>
                            {dish.available ? 'Disponível' : 'Indisponível'}
                          </span>
                        </div>
                      </td>

                      {/* Posição da Cuba */}
                      <td style={{ padding: '14px 20px', color: '#6B7280' }}>
                        <span style={{ background: '#F3F0ED', color: '#C9623A', fontWeight: 600, fontSize: 12, padding: '4px 10px', borderRadius: 6 }}>
                          {dish.position}
                        </span>
                      </td>

                      {/* Ações */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            title="Editar"
                            style={{
                              background: 'none', border: '1px solid #EAE4DF', borderRadius: 7,
                              padding: '6px 8px', cursor: 'pointer', color: '#6B7280',
                              display: 'flex', alignItems: 'center', transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#C9623A')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            title="Excluir"
                            onClick={() => deleteDish(dish.id)}
                            style={{
                              background: 'none', border: '1px solid #EAE4DF', borderRadius: 7,
                              padding: '6px 8px', cursor: 'pointer', color: '#6B7280',
                              display: 'flex', alignItems: 'center', transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #EAE4DF', background: '#FAFAF9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>
                Exibindo {filtered.length} de {dishes.length} pratos
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3].map(p => (
                  <button key={p} style={{
                    width: 30, height: 30, borderRadius: 6, border: '1px solid #EAE4DF',
                    background: p === 1 ? '#C9623A' : '#fff',
                    color: p === 1 ? '#fff' : '#6B7280',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
