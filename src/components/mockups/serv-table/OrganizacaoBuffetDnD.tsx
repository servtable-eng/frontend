import { useRef, useState } from 'react';
import {
  UtensilsCrossed, Home, ClipboardList, BookOpen, BarChart2, Settings,
  GripVertical, CheckCircle2, RotateCcw, Save,
} from 'lucide-react';
import { Button, Badge } from '@workspace/ui';
import '@workspace/ui/styles.css';
import './_shared/tokens.css';

/* ─── Nav ─────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: Home,          label: 'Início'       },
  { icon: ClipboardList, label: 'Pedidos'       },
  { icon: BookOpen,      label: 'Cardápio'      },
  { icon: BarChart2,     label: 'Relatórios'    },
  { icon: Settings,      label: 'Configurações' },
];
const ACTIVE = 'Cardápio';

/* ─── Types ────────────────────────────────────────────────────── */
type Dish = { id: string; name: string; cuba: string; available: boolean };
type Category = { id: string; name: string; emoji: string; accent: string; dishes: Dish[] };

/* ─── Mock data ────────────────────────────────────────────────── */
const INITIAL: Category[] = [
  {
    id: 'entradas', name: 'Entradas', emoji: '🥗', accent: '#22C55E',
    dishes: [
      { id: 'e1', name: 'Pão de Alho',      cuba: 'Cuba 1', available: true  },
      { id: 'e2', name: 'Bruschetta',        cuba: 'Cuba 2', available: true  },
      { id: 'e3', name: 'Caldo de Feijão',   cuba: 'Cuba 3', available: false },
    ],
  },
  {
    id: 'principais', name: 'Pratos Principais', emoji: '🍽️', accent: '#C9623A',
    dishes: [
      { id: 'p1', name: 'Frango Grelhado',      cuba: 'Cuba 4', available: true  },
      { id: 'p2', name: 'Feijoada',             cuba: 'Cuba 5', available: true  },
      { id: 'p3', name: 'Filé de Peixe',        cuba: 'Cuba 6', available: false },
      { id: 'p4', name: 'Macarrão à Bolonhesa', cuba: 'Cuba 7', available: true  },
    ],
  },
  {
    id: 'saladas', name: 'Saladas', emoji: '🥬', accent: '#84CC16',
    dishes: [
      { id: 's1', name: 'Salada Caesar',   cuba: 'Cuba 8',  available: true },
      { id: 's2', name: 'Salada Caprese',  cuba: 'Cuba 9',  available: true },
      { id: 's3', name: 'Mix de Folhas',   cuba: 'Cuba 10', available: true },
    ],
  },
  {
    id: 'sobremesas', name: 'Sobremesas', emoji: '🍮', accent: '#A855F7',
    dishes: [
      { id: 'so1', name: 'Pudim de Leite',     cuba: 'Cuba 11', available: true  },
      { id: 'so2', name: 'Mousse de Maracujá', cuba: 'Cuba 12', available: false },
      { id: 'so3', name: 'Brigadeiro',         cuba: 'Cuba 13', available: true  },
    ],
  },
  {
    id: 'bebidas', name: 'Bebidas', emoji: '🥤', accent: '#0EA5E9',
    dishes: [
      { id: 'b1', name: 'Suco de Laranja',  cuba: 'Cuba 14', available: true },
      { id: 'b2', name: 'Água Mineral',     cuba: 'Cuba 15', available: true },
      { id: 'b3', name: 'Refrigerante Cola',cuba: 'Cuba 16', available: true },
    ],
  },
];

const clone = () => JSON.parse(JSON.stringify(INITIAL)) as Category[];
const font  = 'Inter, system-ui, sans-serif';

/* ─── Drag helpers ─────────────────────────────────────────────── */
function reorder<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/* ─── Component ────────────────────────────────────────────────── */
export function OrganizacaoBuffetDnD() {
  const [cats, setCats]       = useState<Category[]>(clone());
  const [selId, setSelId]     = useState('principais');
  const [saved, setSaved]     = useState(false);

  /* Category DnD state */
  const catSrc              = useRef<number | null>(null);
  const [catOver, setCatOver] = useState<number | null>(null);
  const [catDragging, setCatDragging] = useState<number | null>(null);

  /* Dish DnD state */
  const dishSrc               = useRef<number | null>(null);
  const [dishOver, setDishOver] = useState<number | null>(null);
  const [dishDragging, setDishDragging] = useState<number | null>(null);

  const selCat = cats.find(c => c.id === selId)!;

  /* ── Category handlers ── */
  const onCatDragStart = (idx: number) => { catSrc.current = idx; setCatDragging(idx); };
  const onCatDragOver  = (e: React.DragEvent, idx: number) => { e.preventDefault(); setCatOver(idx); };
  const onCatDrop      = (toIdx: number) => {
    const from = catSrc.current;
    if (from == null || from === toIdx) return;
    const next = reorder(cats, from, toIdx);
    setCats(next);
    setSaved(false);
  };
  const onCatDragEnd   = () => { catSrc.current = null; setCatOver(null); setCatDragging(null); };

  /* ── Dish handlers ── */
  const onDishDragStart = (idx: number) => { dishSrc.current = idx; setDishDragging(idx); };
  const onDishDragOver  = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDishOver(idx); };
  const onDishDrop      = (toIdx: number) => {
    const from = dishSrc.current;
    if (from == null || from === toIdx) return;
    setCats(prev => prev.map(c =>
      c.id !== selId ? c : { ...c, dishes: reorder(c.dishes, from, toIdx) }
    ));
    setSaved(false);
  };
  const onDishDragEnd   = () => { dishSrc.current = null; setDishOver(null); setDishDragging(null); };

  /* ── Save / reset ── */
  const handleSave  = () => setSaved(true);
  const handleReset = () => { setCats(clone()); setSaved(false); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8F6F4', fontFamily: font }}>

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
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#F3F0ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13, color: '#C9623A' }}>AG</div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1F2937' }}>Ana Gerente</p>
              <p style={{ margin: 0, fontSize: 11, color: '#6B7280' }}>Gerente</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100vh' }}>

        {/* Top bar */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid #EAE4DF', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em' }}>
              Organização do Buffet
            </h1>
            <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6B7280' }}>
              Arraste para reorganizar categorias e pratos — ordem refletida no app do cliente
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#15803D', fontWeight: 500 }}>
                <CheckCircle2 size={15} color="#15803D" />
                Ordem salva
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={handleReset}>
              <RotateCcw size={14} style={{ marginRight: 4 }} />
              Resetar
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Save size={14} style={{ marginRight: 4 }} />
              Salvar ordem
            </Button>
          </div>
        </div>

        {/* Two-panel body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── Left: category list ── */}
          <div style={{ width: 264, background: '#fff', borderRight: '1px solid #EAE4DF', overflow: 'auto', padding: '16px 12px', flexShrink: 0 }}>
            <p style={{ margin: '0 4px 10px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Ordem das categorias
            </p>
            {cats.map((cat, idx) => {
              const isActive   = cat.id === selId;
              const isDragging = catDragging === idx;
              const isOver     = catOver === idx && catDragging !== idx;

              return (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={() => onCatDragStart(idx)}
                  onDragOver={e => onCatDragOver(e, idx)}
                  onDrop={() => onCatDrop(idx)}
                  onDragEnd={onCatDragEnd}
                  onClick={() => setSelId(cat.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                    cursor: 'grab', userSelect: 'none',
                    background: isActive ? cat.accent + '12' : isOver ? '#F8F6F4' : 'transparent',
                    border: isOver
                      ? `2px dashed ${cat.accent}`
                      : isActive
                        ? `2px solid ${cat.accent}30`
                        : '2px solid transparent',
                    opacity: isDragging ? 0.35 : 1,
                    transition: 'background 0.12s, border 0.12s, opacity 0.12s',
                  }}
                >
                  <GripVertical size={15} color="#C4B9B2" style={{ flexShrink: 0 }} />

                  {/* Position number */}
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: isActive ? cat.accent : '#F0EDE9',
                    color: isActive ? '#fff' : '#9CA3AF',
                    fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s',
                  }}>
                    {idx + 1}
                  </span>

                  <span style={{ fontSize: 16, lineHeight: 1 }}>{cat.emoji}</span>

                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: isActive ? cat.accent : '#374151', transition: 'color 0.15s' }}>
                    {cat.name}
                  </span>

                  <span style={{
                    fontSize: 11, fontWeight: 600, color: isActive ? cat.accent : '#9CA3AF',
                    background: isActive ? cat.accent + '15' : '#F0EDE9',
                    padding: '2px 7px', borderRadius: 99,
                    transition: 'all 0.15s',
                  }}>
                    {cat.dishes.length}
                  </span>
                </div>
              );
            })}

            {/* Tip */}
            <div style={{ marginTop: 16, padding: '10px 12px', background: '#F8F6F4', borderRadius: 8, border: '1px solid #EAE4DF' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF', lineHeight: 1.55 }}>
                Arraste as categorias para alterar a ordem de exibição no buffet.
              </p>
            </div>
          </div>

          {/* ── Right: dish list ── */}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>

            {/* Category header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: selCat.accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {selCat.emoji}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.01em' }}>
                    {selCat.name}
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: '#6B7280' }}>
                    {selCat.dishes.length} pratos · arraste para reordenar
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{selCat.dishes.filter(d => d.available).length} disponíveis</Badge>
            </div>

            {/* Dish cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selCat.dishes.map((dish, idx) => {
                const isDragging = dishDragging === idx;
                const isOver     = dishOver === idx && dishDragging !== idx;

                return (
                  <div
                    key={dish.id}
                    draggable
                    onDragStart={() => onDishDragStart(idx)}
                    onDragOver={e => onDishDragOver(e, idx)}
                    onDrop={() => onDishDrop(idx)}
                    onDragEnd={onDishDragEnd}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      background: '#fff',
                      border: isOver
                        ? `2px dashed ${selCat.accent}`
                        : '2px solid #EAE4DF',
                      borderRadius: 12, padding: '14px 18px',
                      cursor: 'grab', userSelect: 'none',
                      opacity: isDragging ? 0.3 : 1,
                      transform: isOver ? 'scale(1.01)' : 'scale(1)',
                      boxShadow: isOver ? `0 0 0 3px ${selCat.accent}20` : undefined,
                      transition: 'border-color 0.12s, opacity 0.12s, transform 0.12s, box-shadow 0.12s',
                    }}
                  >
                    {/* Grip */}
                    <GripVertical size={18} color="#C4B9B2" style={{ flexShrink: 0 }} />

                    {/* Ordinal */}
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: selCat.accent + '15',
                      color: selCat.accent,
                      fontSize: 13, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {idx + 1}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {dish.name}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>{dish.cuba}</p>
                    </div>

                    {/* Availability badge */}
                    <Badge
                      variant={dish.available ? 'success' : 'secondary'}
                      dot
                    >
                      {dish.available ? 'Disponível' : 'Indisponível'}
                    </Badge>

                    {/* Position indicator (cuba label) */}
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: selCat.accent, background: selCat.accent + '12',
                      padding: '4px 10px', borderRadius: 6, flexShrink: 0,
                    }}>
                      {dish.cuba}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Drop zone at end */}
            <div
              onDragOver={e => { e.preventDefault(); setDishOver(selCat.dishes.length); }}
              onDrop={() => onDishDrop(selCat.dishes.length - 1)}
              onDragLeave={() => setDishOver(null)}
              style={{
                marginTop: 8, height: 48, borderRadius: 12,
                border: `2px dashed ${dishOver === selCat.dishes.length ? selCat.accent : 'transparent'}`,
                background: dishOver === selCat.dishes.length ? selCat.accent + '08' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              {dishOver === selCat.dishes.length && (
                <p style={{ margin: 0, fontSize: 12, color: selCat.accent, fontWeight: 500 }}>
                  Soltar aqui
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
