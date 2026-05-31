import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Camera, Plus, CheckCircle2 } from 'lucide-react';
import './_shared/tokens.css';

/* ─── Mock dishes ───────────────────────────────────────────────── */
const DISHES = [
  {
    name: 'Frango Grelhado',
    category: 'Pratos Principais',
    image: '/__mockup/images/frango.png',
    available: true,
    photoDate: '28/05/2026',
    desc: 'Peito de frango suculento marinado em ervas finas, grelhado na brasa e finalizado com azeite de limão siciliano. Acompanha farofa artesanal e vinagrete de tomate com cebola roxa.',
    ingredients: ['Frango', 'Limão siciliano', 'Ervas finas', 'Azeite', 'Alho', 'Páprica', 'Farofa', 'Vinagrete'],
    allergens: ['Glúten (farofa)'],
  },
  {
    name: 'Filé de Peixe',
    category: 'Pratos Principais',
    image: '/__mockup/images/peixe.png',
    available: false,
    photoDate: '15/04/2026',
    desc: 'Filé de tilápia fresco grelhado ao molho de limão siciliano com alcaparras e ervas do mediterrâneo. Acompanha legumes no vapor e arroz integral soltinho.',
    ingredients: ['Tilápia', 'Limão siciliano', 'Alcaparras', 'Legumes', 'Arroz integral', 'Azeite', 'Ervas'],
    allergens: ['Peixe'],
  },
  {
    name: 'Feijoada Completa',
    category: 'Pratos Principais',
    image: '/__mockup/images/feijoada.png',
    available: true,
    photoDate: '27/05/2026',
    desc: 'Tradicional feijoada brasileira com feijão preto e carnes selecionadas: costela, linguiça defumada e lombo. Acompanha couve refogada, arroz, laranja e farinha.',
    ingredients: ['Feijão preto', 'Costela', 'Linguiça', 'Lombo', 'Couve', 'Arroz', 'Laranja', 'Farinha'],
    allergens: [],
  },
];

const font = 'Inter, system-ui, sans-serif';

/* ─── Component ─────────────────────────────────────────────────── */
export function DishDetailsV2() {
  const [idx, setIdx]     = useState(0);
  const [added, setAdded] = useState(false);

  const dish = DISHES[idx];
  const total = DISHES.length;

  const prev = () => { setIdx(i => Math.max(0, i - 1)); setAdded(false); };
  const next = () => { setIdx(i => Math.min(total - 1, i + 1)); setAdded(false); };

  const handleAdd = () => {
    if (!dish.available) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{
      height: '100svh', maxWidth: 390, margin: '0 auto',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: '#F8F6F4', fontFamily: font, position: 'relative',
    }}>

      {/* ── Hero image ── */}
      <div style={{ position: 'relative', height: 340, flexShrink: 0, overflow: 'hidden' }}>
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            filter: dish.available ? 'none' : 'grayscale(55%)',
            opacity: dish.available ? 1 : 0.8,
            transition: 'filter 0.4s, opacity 0.4s',
          }}
          onError={e => { (e.target as HTMLImageElement).style.background = '#F0EDE9'; }}
        />

        {/* Gradient scrim */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 45%, rgba(0,0,0,0.08) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Back button */}
        <button
          onClick={prev}
          style={{
            position: 'absolute', top: 16, left: 16,
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          }}
        >
          <ChevronLeft size={22} color="#1F2937" />
        </button>

        {/* Availability badge */}
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          {dish.available ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(34,197,94,0.9)', borderRadius: 999, padding: '5px 12px',
              backdropFilter: 'blur(4px)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Disponível</span>
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(239,68,68,0.92)', borderRadius: 999, padding: '5px 12px',
              backdropFilter: 'blur(4px)',
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Indisponível</span>
            </div>
          )}
        </div>

        {/* Dish navigation dots + arrows */}
        <div style={{
          position: 'absolute', bottom: 14, left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <button
            onClick={prev}
            disabled={idx === 0}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.7)', cursor: idx === 0 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: idx === 0 ? 0.4 : 1, transition: 'opacity 0.15s',
            }}
          >
            <ChevronLeft size={16} color="#1F2937" />
          </button>

          <div style={{ display: 'flex', gap: 6 }}>
            {DISHES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIdx(i); setAdded(false); }}
                style={{
                  width: i === idx ? 20 : 7, height: 7,
                  borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0,
                  background: i === idx ? '#fff' : 'rgba(255,255,255,0.55)',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={idx === total - 1}
            style={{
              width: 28, height: 28, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.7)', cursor: idx === total - 1 ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: idx === total - 1 ? 0.4 : 1, transition: 'opacity 0.15s',
            }}
          >
            <ChevronRight size={16} color="#1F2937" />
          </button>
        </div>
      </div>

      {/* ── Content card (slides up over hero) ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: '#fff', borderRadius: '20px 20px 0 0',
        marginTop: -20, position: 'relative', zIndex: 10,
        paddingBottom: 100,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E5E0DB' }} />
        </div>

        <div style={{ padding: '4px 20px 0' }}>

          {/* Availability + time */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: dish.available ? '#22C55E' : '#EF4444',
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: dish.available ? '#15803D' : '#DC2626' }}>
                {dish.available ? 'Disponível agora' : 'Indisponível'}
              </span>
            </div>
            {!dish.available && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#9CA3AF' }}>
                <Clock size={13} />
                <span style={{ fontSize: 12 }}>Previsão: 15h00</span>
              </div>
            )}
          </div>

          {/* Name + category */}
          <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, color: '#1F2937', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {dish.name}
          </h1>

          <div style={{ marginBottom: 18 }}>
            <span style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: 99,
              background: '#F0EDE9', fontSize: 12, fontWeight: 600, color: '#C9623A',
            }}>
              {dish.category}
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#EAE4DF', marginBottom: 18 }} />

          {/* Descrição */}
          <section style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Descrição
            </p>
            <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.65 }}>
              {dish.desc}
            </p>
          </section>

          {/* Ingredientes */}
          <section style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Ingredientes
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {dish.ingredients.map(ing => (
                <span
                  key={ing}
                  style={{
                    padding: '6px 14px', borderRadius: 99,
                    background: '#F8F6F4', border: '1px solid #EAE4DF',
                    fontSize: 13, color: '#1F2937', fontWeight: 500,
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>
          </section>

          {/* Alérgenos */}
          {dish.allergens.length > 0 && (
            <section style={{ marginBottom: 20 }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Contém
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {dish.allergens.map(a => (
                  <span
                    key={a}
                    style={{
                      padding: '5px 12px', borderRadius: 99,
                      background: '#FEF3C7', border: '1px solid #FDE68A',
                      fontSize: 12, color: '#92400E', fontWeight: 600,
                    }}
                  >
                    ⚠️ {a}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Photo date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF' }}>
            <Camera size={13} />
            <span style={{ fontSize: 12 }}>Foto atualizada em {dish.photoDate}</span>
          </div>

        </div>
      </div>

      {/* ── Sticky bottom bar ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid #EAE4DF',
        padding: '12px 16px', zIndex: 20,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: dish.available ? 0 : 8 }}>
          {/* Voltar */}
          <button
            onClick={prev}
            style={{
              flex: '0 0 40%', padding: '14px 0', borderRadius: 14,
              border: '1.5px solid #EAE4DF', background: '#fff',
              fontSize: 15, fontWeight: 600, color: '#374151',
              cursor: 'pointer', fontFamily: font,
            }}
          >
            ← Voltar
          </button>

          {/* Adicionar / Indisponível */}
          <button
            onClick={handleAdd}
            disabled={!dish.available}
            style={{
              flex: 1, padding: '14px 0', borderRadius: 14, border: 'none',
              background: added ? '#15803D' : dish.available ? '#C9623A' : '#EAE4DF',
              color: dish.available ? '#fff' : '#9CA3AF',
              fontSize: 15, fontWeight: 700, fontFamily: font,
              cursor: dish.available ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'background 0.25s',
            }}
          >
            {added ? (
              <>
                <CheckCircle2 size={17} />
                Adicionado!
              </>
            ) : dish.available ? (
              <>
                <Plus size={17} />
                Adicionar ao Prato
              </>
            ) : (
              'Indisponível'
            )}
          </button>
        </div>

        {!dish.available && (
          <p style={{ margin: 0, textAlign: 'center', fontSize: 11, color: '#9CA3AF' }}>
            Este prato está temporariamente indisponível
          </p>
        )}
      </div>
    </div>
  );
}

export default DishDetailsV2;
