import { Search, UtensilsCrossed, ChevronRight } from 'lucide-react';
import './_shared/tokens.css';

const FOOD_ITEMS = [
  {
    id: 1,
    name: 'Frango Grelhado',
    description: 'Peito de frango temperado e grelhado na brasa, acompanha farofa e vinagrete.',
    available: true,
    image: '/__mockup/images/frango.png',
  },
  {
    id: 2,
    name: 'Arroz com Feijão',
    description: 'Arroz branco soltinho com feijão carioca cremoso, preparo tradicional.',
    available: true,
    image: '/__mockup/images/arroz-feijao.png',
  },
  {
    id: 3,
    name: 'Salada Caesar',
    description: 'Alface romana fresca com croutons, parmesão e molho caesar artesanal.',
    available: true,
    image: '/__mockup/images/salada.png',
  },
  {
    id: 4,
    name: 'Feijoada Completa',
    description: 'Feijoada tradicional com carnes nobres, couve refogada e laranja.',
    available: true,
    image: '/__mockup/images/feijoada.png',
  },
  {
    id: 5,
    name: 'Filé de Peixe',
    description: 'Filé grelhado ao molho de limão siciliano com ervas finas.',
    available: false,
    image: '/__mockup/images/peixe.png',
  },
  {
    id: 6,
    name: 'Pudim de Leite',
    description: 'Pudim cremoso com calda de caramelo dourado, receita da casa.',
    available: true,
    image: '/__mockup/images/pudim.png',
  },
];

const CATEGORIES = ['Todos', 'Quentes', 'Frios', 'Saladas', 'Sobremesas', 'Bebidas'];

export function CustomerHome() {
  return (
    <div
      className="serv-theme serv-bg-background flex flex-col relative overflow-hidden"
      style={{ minHeight: '100dvh', maxWidth: 390, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <header
        className="serv-bg-surface border-b serv-border px-4 py-4 flex flex-col gap-3"
        style={{ flexShrink: 0 }}
      >
        <div className="flex items-center gap-2">
          <div
            className="serv-bg-primary flex items-center justify-center text-white"
            style={{ width: 32, height: 32, borderRadius: 8 }}
          >
            <UtensilsCrossed size={18} />
          </div>
          <span className="font-semibold serv-text-primary" style={{ fontSize: 16, letterSpacing: '-0.01em' }}>
            Restaurante Sabor &amp; Arte
          </span>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="serv-text-secondary"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Buscar pratos..."
            style={{
              width: '100%',
              paddingLeft: 36,
              paddingRight: 16,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 8,
              border: '1px solid #EAE4DF',
              background: '#F8F6F4',
              fontSize: 14,
              color: '#1F2937',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </header>

      {/* Categories */}
      <div
        className="serv-bg-surface border-b serv-border"
        style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 16, overflowX: 'auto', flexShrink: 0 }}
      >
        <div style={{ display: 'flex', gap: 8, width: 'max-content', paddingRight: 16 }}>
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              style={{
                padding: '6px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                background: i === 0 ? '#C9623A' : '#F0EDE9',
                color: i === 0 ? '#fff' : '#6B7280',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Buffet hint */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          paddingLeft: 16,
          paddingTop: 16,
          paddingBottom: 8,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, color: '#6B7280' }}>Deslize para explorar o buffet</span>
        <ChevronRight size={14} color="#C9623A" />
      </div>

      {/* Horizontal Carousel */}
      <div
        style={{
          overflowX: 'auto',
          display: 'flex',
          gap: 12,
          paddingLeft: 16,
          paddingBottom: 16,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          flexShrink: 0,
        }}
      >
        {FOOD_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            style={{
              scrollSnapAlign: 'start',
              flexShrink: 0,
              width: 318,
              borderRadius: 16,
              background: '#FFFFFF',
              border: '1px solid #EAE4DF',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              /* peek-through: last card partial */
              marginRight: idx === FOOD_ITEMS.length - 1 ? 16 : 0,
            }}
          >
            {/* Food Image */}
            <div style={{ position: 'relative', height: 220, background: '#F0EDE9', flexShrink: 0 }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: item.available ? 'none' : 'grayscale(60%)',
                  opacity: item.available ? 1 : 0.7,
                }}
              />
              {!item.available && (
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(255,255,255,0.92)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#EF4444',
                  }}
                >
                  Indisponível
                </div>
              )}
              {item.available && (
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(255,255,255,0.92)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#22C55E',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E' }} />
                  Disponível
                </div>
              )}
            </div>

            {/* Card Content */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1F2937', lineHeight: 1.2 }}>
                {item.name}
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                {item.description}
              </p>

              <button
                disabled={!item.available}
                style={{
                  marginTop: 8,
                  width: '100%',
                  padding: '12px 0',
                  borderRadius: 10,
                  border: 'none',
                  cursor: item.available ? 'pointer' : 'not-allowed',
                  background: item.available ? '#C9623A' : '#EAE4DF',
                  color: item.available ? '#fff' : '#6B7280',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                {item.available ? 'Adicionar ao prato' : 'Indisponível'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Section: more items below hint */}
      <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 4, paddingBottom: 8, flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF', textAlign: 'center', letterSpacing: '0.02em' }}>
          {FOOD_ITEMS.length} pratos disponíveis hoje
        </p>
      </div>

      {/* Spacer so content doesn't hide behind sticky bar */}
      <div style={{ flex: 1, minHeight: 80 }} />

      {/* Bottom Sticky Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#FFFFFF',
          borderTop: '1px solid #EAE4DF',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>Meu prato</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>2 itens selecionados</span>
        </div>
        <button
          style={{
            background: '#C9623A',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 24px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Ver meu prato
        </button>
      </div>
    </div>
  );
}

export default CustomerHome;
