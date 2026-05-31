import { useState } from 'react';
import { Search, UtensilsCrossed, ChevronRight, Plus, Minus, ShoppingBag } from 'lucide-react';
import './_shared/tokens.css';

/* ─── Data ─────────────────────────────────────────────────────── */
type Dish = {
  id: string;
  category: string;
  name: string;
  desc: string;
  image: string;
  available: boolean;
};

const DISHES: Dish[] = [
  { id: 'd1',  category: 'entradas',   name: 'Pão de Alho',          desc: 'Fatias crocantes com manteiga de alho e ervas frescas da horta',   image: '/__mockup/images/frango.png',       available: true  },
  { id: 'd2',  category: 'entradas',   name: 'Bruschetta',            desc: 'Torrada artesanal com tomate temperado, manjericão e azeite extra',  image: '/__mockup/images/salada.png',       available: true  },
  { id: 'd3',  category: 'entradas',   name: 'Caldo de Feijão',       desc: 'Caldo encorpado com linguiça defumada e temperos da casa',          image: '/__mockup/images/feijoada.png',     available: false },
  { id: 'd4',  category: 'principais', name: 'Frango Grelhado',       desc: 'Peito de frango suculento com ervas finas e limão siciliano',       image: '/__mockup/images/frango.png',       available: true  },
  { id: 'd5',  category: 'principais', name: 'Feijoada Completa',     desc: 'Tradicional feijoada com carnes selecionadas, couve e laranja',     image: '/__mockup/images/feijoada.png',     available: true  },
  { id: 'd6',  category: 'principais', name: 'Filé de Peixe',         desc: 'Tilápia grelhada ao molho de limão com alcaparras e ervas',         image: '/__mockup/images/peixe.png',        available: false },
  { id: 'd7',  category: 'principais', name: 'Macarrão à Bolonhesa',  desc: 'Macarrão artesanal ao molho bolonhesa com carne bovina moída',     image: '/__mockup/images/arroz-feijao.png', available: true  },
  { id: 'd8',  category: 'saladas',    name: 'Salada Caesar',         desc: 'Alface romana, croutons, parmesão e molho caesar artesanal',       image: '/__mockup/images/salada.png',       available: true  },
  { id: 'd9',  category: 'saladas',    name: 'Mix de Folhas',         desc: 'Folhas frescas com tomate cereja, pepino e vinagrete leve',         image: '/__mockup/images/salada.png',       available: true  },
  { id: 'd10', category: 'sobremesas', name: 'Pudim de Leite',        desc: 'Pudim cremoso de leite condensado com calda de caramelo dourado',  image: '/__mockup/images/pudim.png',        available: true  },
  { id: 'd11', category: 'sobremesas', name: 'Brigadeiro Gourmet',    desc: 'Brigadeiro artesanal com granulado belga e flor de sal',            image: '/__mockup/images/pudim.png',        available: true  },
  { id: 'd12', category: 'bebidas',    name: 'Suco de Laranja',       desc: 'Suco natural de laranja espremido na hora, sem adição de açúcar',   image: '/__mockup/images/arroz-feijao.png', available: true  },
  { id: 'd13', category: 'bebidas',    name: 'Água Mineral',          desc: 'Água mineral gelada sem gás, servida em garrafa individual',        image: '/__mockup/images/salada.png',       available: true  },
];

type CatKey = 'todos' | 'entradas' | 'principais' | 'saladas' | 'sobremesas' | 'bebidas';

const CATEGORIES: { key: CatKey; label: string; emoji: string }[] = [
  { key: 'todos',      label: 'Todos',            emoji: '✨' },
  { key: 'entradas',   label: 'Entradas',          emoji: '🥗' },
  { key: 'principais', label: 'Pratos Principais', emoji: '🍽️' },
  { key: 'saladas',    label: 'Saladas',           emoji: '🥬' },
  { key: 'sobremesas', label: 'Sobremesas',        emoji: '🍮' },
  { key: 'bebidas',    label: 'Bebidas',           emoji: '🥤' },
];

const font = 'Inter, system-ui, sans-serif';

/* ─── Sub-components ────────────────────────────────────────────── */
function ImageWithFallback({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [err, setErr] = useState(false);
  return err ? (
    <div style={{ ...style, background: '#F0EDE9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1C4BB' }}>
      <UtensilsCrossed size={40} />
    </div>
  ) : (
    <img src={src} alt={alt} onError={() => setErr(true)} style={{ ...style, objectFit: 'cover', display: 'block' }} />
  );
}

/* ─── Main screen ───────────────────────────────────────────────── */
export function CustomerBuffetHome() {
  const [activeCat, setActiveCat] = useState<CatKey>('todos');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = DISHES.filter(d => {
    const matchesCat   = activeCat === 'todos' || d.category === activeCat;
    const matchesSearch = !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);

  const setQty = (id: string, delta: number) => {
    setQuantities(prev => {
      const cur = prev[id] ?? 0;
      const next = Math.max(0, cur + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  return (
    <div style={{
      height: '100svh', maxWidth: 390, margin: '0 auto',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: '#F8F6F4', fontFamily: font, position: 'relative',
    }}>
      {/* Hide scrollbars globally for this screen */}
      <style>{`
        .cbh-scroll::-webkit-scrollbar { display: none; }
        .cbh-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── Header ── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #EAE4DF', padding: '14px 16px 12px', flexShrink: 0 }}>
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#C9623A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UtensilsCrossed size={18} color="#fff" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Buffet São Paulo
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>Auto-serviço · Mesa 7</p>
            </div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F8F6F4', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EAE4DF' }}>
            {totalItems > 0 ? (
              <div style={{ position: 'relative' }}>
                <ShoppingBag size={18} color="#C9623A" />
                <span style={{ position: 'absolute', top: -8, right: -8, width: 16, height: 16, borderRadius: '50%', background: '#C9623A', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {totalItems}
                </span>
              </div>
            ) : (
              <ShoppingBag size={18} color="#9CA3AF" />
            )}
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar pratos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 14px 10px 36px',
              borderRadius: 10, border: '1px solid #EAE4DF',
              background: '#F8F6F4', fontSize: 14, color: '#1F2937',
              outline: 'none', fontFamily: font,
            }}
          />
        </div>
      </header>

      {/* ── Categories ── */}
      <div className="cbh-scroll" style={{ background: '#fff', borderBottom: '1px solid #EAE4DF', overflowX: 'auto', flexShrink: 0, padding: '10px 0 10px 14px' }}>
        <div style={{ display: 'flex', gap: 8, width: 'max-content', paddingRight: 14 }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCat === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCat(cat.key)}
                style={{
                  padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  fontFamily: font, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: isActive ? '#C9623A' : '#F0EDE9',
                  color:      isActive ? '#fff'    : '#6B7280',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Swipe hint ── */}
      <div style={{ padding: '10px 16px 6px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>
          {filtered.length} {filtered.length === 1 ? 'prato' : 'pratos'} · deslize para explorar
        </span>
        <ChevronRight size={13} color="#C9623A" />
      </div>

      {/* ── Card carousel ── */}
      {filtered.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
          <div style={{ fontSize: 40 }}>🍽️</div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#6B7280', textAlign: 'center' }}>Nenhum prato encontrado</p>
          <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>Tente outra categoria ou limpe a busca</p>
        </div>
      ) : (
        <div
          className="cbh-scroll"
          style={{
            flex: 1, overflowX: 'auto', overflowY: 'hidden',
            display: 'flex', alignItems: 'stretch',
            gap: 12, paddingLeft: 16, paddingBottom: 4,
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {filtered.map((dish, i) => {
            const qty = quantities[dish.id] ?? 0;
            const isLast = i === filtered.length - 1;

            return (
              <div
                key={dish.id}
                style={{
                  /* Card takes ~85% of viewport, letting next peek through */
                  minWidth: 318, maxWidth: 318,
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  marginRight: isLast ? 16 : 0,
                  borderRadius: 20,
                  background: '#fff',
                  border: `1.5px solid ${qty > 0 ? '#C9623A' : '#EAE4DF'}`,
                  boxShadow: qty > 0 ? '0 0 0 3px rgba(201,98,58,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                {/* Image with gradient overlay */}
                <div style={{ position: 'relative', flex: '0 0 56%' }}>
                  <ImageWithFallback
                    src={dish.image}
                    alt={dish.name}
                    style={{
                      width: '100%', height: '100%',
                      filter: dish.available ? 'none' : 'grayscale(70%)',
                      opacity: dish.available ? 1 : 0.75,
                    }}
                  />

                  {/* Bottom gradient for name overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    padding: '14px 16px',
                  }}>
                    <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      {dish.name}
                    </h2>

                    {/* Availability badge on gradient */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: dish.available ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                        border: `1px solid ${dish.available ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}`,
                        borderRadius: 99, padding: '3px 10px',
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: dish.available ? '#4ADE80' : '#F87171',
                          flexShrink: 0,
                        }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: dish.available ? '#4ADE80' : '#F87171' }}>
                          {dish.available ? 'Disponível agora' : 'Indisponível'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Quantity badge when qty > 0 */}
                  {qty > 0 && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#C9623A', color: '#fff',
                      fontSize: 13, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(201,98,58,0.4)',
                    }}>
                      {qty}
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.55, flex: 1 }}>
                    {dish.desc}
                  </p>

                  {/* Quantity control */}
                  {dish.available ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {qty === 0 ? (
                        <button
                          onClick={() => setQty(dish.id, 1)}
                          style={{
                            flex: 1, padding: '13px 0',
                            borderRadius: 12, border: 'none',
                            background: '#C9623A', color: '#fff',
                            fontSize: 14, fontWeight: 700, fontFamily: font,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                          }}
                        >
                          <Plus size={16} />
                          Adicionar ao prato
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setQty(dish.id, -1)}
                            style={{
                              width: 44, height: 44, borderRadius: 12, border: '1.5px solid #EAE4DF',
                              background: '#F8F6F4', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Minus size={16} color="#374151" />
                          </button>

                          <div style={{ flex: 1, textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#C9623A', lineHeight: 1 }}>{qty}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>{qty === 1 ? 'porção' : 'porções'}</p>
                          </div>

                          <button
                            onClick={() => setQty(dish.id, 1)}
                            style={{
                              width: 44, height: 44, borderRadius: 12, border: 'none',
                              background: '#C9623A', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Plus size={16} color="#fff" />
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      padding: '13px 0', borderRadius: 12,
                      background: '#F3F4F6', textAlign: 'center',
                      fontSize: 13, fontWeight: 600, color: '#9CA3AF',
                    }}>
                      Indisponível no momento
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Sticky bottom bar ── */}
      <div style={{
        flexShrink: 0,
        background: '#fff', borderTop: '1px solid #EAE4DF',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          {totalItems === 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>Nenhum item selecionado</p>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF', lineHeight: 1 }}>Meu prato</p>
              <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 700, color: '#1F2937', lineHeight: 1 }}>
                {totalItems} {totalItems === 1 ? 'item selecionado' : 'itens selecionados'}
              </p>
            </>
          )}
        </div>

        <button
          disabled={totalItems === 0}
          style={{
            padding: '13px 22px', borderRadius: 12, border: 'none',
            background: totalItems > 0 ? '#C9623A' : '#EAE4DF',
            color: totalItems > 0 ? '#fff' : '#9CA3AF',
            fontSize: 14, fontWeight: 700, fontFamily: font,
            cursor: totalItems > 0 ? 'pointer' : 'default',
            whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          Ver Meu Prato
          {totalItems > 0 && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}

export default CustomerBuffetHome;
