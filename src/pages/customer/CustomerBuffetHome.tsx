import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UtensilsCrossed, ChevronRight, Plus, ShoppingCart, ReceiptText } from 'lucide-react';
import { customerDishPath, ROUTES } from '../../routes/routeConstants';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { getDishesForClient } from '../../services/dishes/dish.service';
import '../../styles/tokens.css';
import { useCustomerCart } from '@/contexts/CustomerCartContext';
import { useCustomerPlate } from '@/contexts/CustomerPlateContext';
import { getCategoriesFromDishes, type CategoryOption } from '@/utils/categories';
import type { ClientDishDto } from '@/types/dish';
import { showSuccess } from '@/components/ToastProvider';
import { useRestaurantPricePer100g } from '@/hooks/useRestaurantPricePer100g';
import { calculateBuffetPrice } from '@/utils/buffetPricing';

const font = 'Inter, system-ui, sans-serif';
const MIN_PORTION_WEIGHT = 25;
const MAX_PORTION_WEIGHT = 1000;
const PORTION_WEIGHT_STEP = 25;
const brl = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

function normalizePortionWeight(value: unknown) {
  const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : MIN_PORTION_WEIGHT;
  const clampedValue = Math.min(MAX_PORTION_WEIGHT, Math.max(MIN_PORTION_WEIGHT, numericValue));

  return Math.round(clampedValue / PORTION_WEIGHT_STEP) * PORTION_WEIGHT_STEP;
}

function getValidRecommendedWeight(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  if (value < MIN_PORTION_WEIGHT || value > MAX_PORTION_WEIGHT) return null;
  if (value % PORTION_WEIGHT_STEP !== 0) return null;

  return value;
}

function ImageWithFallback({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [err, setErr] = useState(false);

  return err || !src ? (
    <div style={{ ...style, background: '#F0EDE9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D1C4BB' }}>
      <UtensilsCrossed size={40} />
    </div>
  ) : (
    <img src={src} alt={alt} onError={() => setErr(true)} style={{ ...style, objectFit: 'cover', display: 'block' }} />
  );
}

export function CustomerBuffetHome() {
  const restaurant = useRestaurant();
  const { pricePer100g } = useRestaurantPricePer100g();
  const navigate = useNavigate();
  const { plateItems, totalQuantity, addDishPortion } = useCustomerPlate();
  const { cartPlates } = useCustomerCart();
  const [dishes, setDishes] = useState<ClientDishDto[]>([]);
  const [error, setError] = useState('');
  const [activeCat, setActiveCat] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [expandedDishId, setExpandedDishId] = useState('');
  const [quickAddWeights, setQuickAddWeights] = useState<Record<string, number>>({});
  const [quickAddUsesRestaurantRecommendation, setQuickAddUsesRestaurantRecommendation] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!restaurant.id) {
      setError('Restaurante nao encontrado.');
      return;
    }

    getDishesForClient(restaurant.id)
      .then(data => setDishes(data))
      .catch(() => setError('Houve um erro ao carregar os pratos.'));
  }, [restaurant.id]);

  useEffect(() => {
    setCategories([{ value: 'todos', label: 'Todos' }, ...getCategoriesFromDishes(dishes)]);
  }, [dishes]);

  const filtered = dishes.filter(dish => {
    const matchesCat = activeCat === 'todos' || dish.category === activeCat;
    const matchesSearch = !searchQuery || dish.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const quantities = plateItems.reduce<Record<string, number>>((counts, item) => {
    counts[item.dishId] = (counts[item.dishId] ?? 0) + item.quantity;
    return counts;
  }, {});
  const totalItems = totalQuantity;

  const getQuickAddWeight = (dish: ClientDishDto) => normalizePortionWeight(
    quickAddWeights[dish.id] ?? dish.recommendedWeightInGrams,
  );

  const shouldShowRecommendedWeightHint = (dish: ClientDishDto) => quickAddUsesRestaurantRecommendation[dish.id] === true;

  const getInitialQuickAddWeight = (dish: ClientDishDto) => {
    const latestCartPlateItem = [...cartPlates]
      .reverse()
      .flatMap(cartPlate => [...cartPlate.plateItems].reverse())
      .find(item => item.dishId === dish.id);
    const latestCurrentPlateItem = [...plateItems]
      .reverse()
      .find(item => item.dishId === dish.id);
    const recommendedWeight = getValidRecommendedWeight(dish.recommendedWeightInGrams);

    if (latestCartPlateItem?.portionWeightInGrams !== undefined) {
      return {
        weight: normalizePortionWeight(latestCartPlateItem.portionWeightInGrams),
        isRestaurantRecommendation: false,
      };
    }

    if (latestCurrentPlateItem?.portionWeightInGrams !== undefined) {
      return {
        weight: normalizePortionWeight(latestCurrentPlateItem.portionWeightInGrams),
        isRestaurantRecommendation: false,
      };
    }

    if (recommendedWeight !== null) {
      return {
        weight: recommendedWeight,
        isRestaurantRecommendation: true,
      };
    }

    return {
      weight: MIN_PORTION_WEIGHT,
      isRestaurantRecommendation: false,
    };
  };

  const openQuickAdd = (dish: ClientDishDto) => {
    const initialWeight = getInitialQuickAddWeight(dish);
    const hasStoredWeight = quickAddWeights[dish.id] !== undefined;

    setExpandedDishId(dish.id);
    setQuickAddWeights(current => ({
      ...current,
      [dish.id]: normalizePortionWeight(current[dish.id] ?? initialWeight.weight),
    }));
    setQuickAddUsesRestaurantRecommendation(current => ({
      ...current,
      [dish.id]: !hasStoredWeight && initialWeight.isRestaurantRecommendation,
    }));
  };

  const cancelQuickAdd = () => {
    setExpandedDishId('');
  };

  const confirmQuickAdd = (dish: ClientDishDto) => {
    addDishPortion(dish, getQuickAddWeight(dish));
    setExpandedDishId('');
    showSuccess(`${dish.name} adicionada ao prato.`);
  };

  const openPlateBuilder = () => {
    if (totalItems === 0) return;
    navigate(ROUTES.CUSTOMER_PLATE_BUILDER);
  };

  const openCart = () => navigate(ROUTES.CUSTOMER_CART);
  const openRecentOrders = () => navigate(ROUTES.CUSTOMER_RECENT_ORDERS);

  return (
    <div style={{
      minHeight: '100svh', maxWidth: 390, margin: '0 auto',
      display: 'flex', flexDirection: 'column', overflowX: 'hidden',
      background: '#F8F6F4', fontFamily: font, position: 'relative',
    }}>
      <style>{`
        .cbh-scroll::-webkit-scrollbar { display: none; }
        .cbh-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <header style={{ background: '#fff', borderBottom: '1px solid #EAE4DF', padding: '14px 16px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#C9623A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UtensilsCrossed size={18} color="#fff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.01em', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {restaurant.name}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button type="button" onClick={openCart} aria-label="Carrinho" title="Carrinho" style={{ width: 36, height: 36, borderRadius: 10, background: '#F8F6F4', color: cartPlates.length > 0 ? '#C9623A' : '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EAE4DF', cursor: 'pointer', padding: 0 }}>
              <span style={{ position: 'relative', display: 'flex' }}>
                <ShoppingCart size={18} color={cartPlates.length > 0 ? '#C9623A' : '#9CA3AF'} />
                {cartPlates.length > 0 && (
                  <span style={{ position: 'absolute', top: -8, right: -8, minWidth: 15, height: 15, padding: '0 3px', borderRadius: 999, background: '#C9623A', color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
                    {cartPlates.length}
                  </span>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={openRecentOrders}
              aria-label="Meus pedidos"
              title="Meus pedidos"
              style={{ width: 36, height: 36, borderRadius: 10, background: '#F8F6F4', color: '#C9623A', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EAE4DF', cursor: 'pointer', padding: 0 }}
            >
              <ReceiptText size={18} />
            </button>
          </div>
        </div>

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

      <div className="cbh-scroll" style={{ background: '#fff', borderBottom: '1px solid #EAE4DF', overflowX: 'auto', flexShrink: 0, padding: '10px 0 10px 14px' }}>
        <div style={{ display: 'flex', gap: 8, width: 'max-content', paddingRight: 14 }}>
          {categories.map(cat => {
            const isActive = activeCat === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCat(cat.value)}
                style={{
                  padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  fontFamily: font, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: isActive ? '#C9623A' : '#F0EDE9',
                  color: isActive ? '#fff' : '#6B7280',
                  transition: 'all 0.15s',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '10px 16px 6px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 12, color: '#9CA3AF' }}>
          {filtered.length} {filtered.length === 1 ? 'prato' : 'pratos'} · deslize para explorar
        </span>
        <ChevronRight size={13} color="#C9623A" />
      </div>
      {error && (
        <div style={{ padding: '0 16px 8px', fontSize: 12, color: '#DC2626', flexShrink: 0 }}>
          {error}
        </div>
      )}

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
            flex: '0 0 auto', overflowX: 'auto', overflowY: 'visible',
            display: 'flex', alignItems: 'stretch',
            gap: 12, paddingLeft: 16, paddingBottom: 16,
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
                  minWidth: 318, maxWidth: 318,
                  height: 'auto',
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
                <div style={{ position: 'relative', height: 260, flexShrink: 0, overflow: 'hidden' }}>
                  <ImageWithFallback
                    src={dish.imageUrl}
                    alt={dish.name}
                    style={{ width: '100%', height: '100%' }}
                  />

                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    padding: '14px 16px',
                  }}>
                    <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      {dish.name}
                    </h2>
                  </div>

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

                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0 }}>
                  <p style={{
                    margin: 0,
                    fontSize: 13,
                    color: '#6B7280',
                    lineHeight: 1.55,
                    minHeight: 60,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {dish.description}
                  </p>

                  {expandedDishId === dish.id ? (
                    <div style={{ borderTop: '1px solid #F0EDE9', paddingTop: 10, display: 'grid', gap: 9, marginTop: 'auto' }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        Peso da porção
                      </p>
                      <input
                        type="range"
                        min={MIN_PORTION_WEIGHT}
                        max={MAX_PORTION_WEIGHT}
                        step={PORTION_WEIGHT_STEP}
                        value={getQuickAddWeight(dish)}
                        onChange={event => {
                          setQuickAddWeights(current => ({
                            ...current,
                            [dish.id]: normalizePortionWeight(Number(event.target.value)),
                          }));
                          setQuickAddUsesRestaurantRecommendation(current => ({
                            ...current,
                            [dish.id]: false,
                          }));
                        }}
                        onInput={() => setQuickAddUsesRestaurantRecommendation(current => ({
                          ...current,
                          [dish.id]: false,
                        }))}
                        style={{ width: '100%', accentColor: '#C9623A', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#1F2937' }}>{getQuickAddWeight(dish)} g</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#C9623A' }}>≈ {brl(calculateBuffetPrice(getQuickAddWeight(dish), pricePer100g))}</span>
                      </div>
                      {shouldShowRecommendedWeightHint(dish) && (
                        <p style={{ margin: 0, fontSize: 11, color: '#6B7280', lineHeight: 1.35 }}>
                          Sugestão do restaurante. Ajuste conforme desejar.
                        </p>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <button
                          type="button"
                          onClick={cancelQuickAdd}
                          style={{ padding: '11px 0', borderRadius: 12, border: '1.5px solid #EAE4DF', background: '#fff', color: '#6B7280', fontSize: 14, fontWeight: 700, fontFamily: font, cursor: 'pointer' }}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmQuickAdd(dish)}
                          style={{ padding: '11px 0', borderRadius: 12, border: 'none', background: '#C9623A', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: font, cursor: 'pointer' }}
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => openQuickAdd(dish)}
                      style={{
                        minHeight: 50, padding: '0 12px', marginTop: 'auto',
                        borderRadius: 12, border: 'none',
                        background: '#C9623A', color: '#fff',
                        fontSize: 14, fontWeight: 700, fontFamily: font,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      }}
                    >
                      <Plus size={16} />
                      Adicionar ao prato
                    </button>
                  )}

                  <Link
                    to={customerDishPath(dish.id)}
                    style={{
                      display: 'inline-flex',
                      justifyContent: 'center',
                      padding: '10px 0',
                      borderRadius: 12,
                      background: '#F8F6F4',
                      color: '#1F2937',
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 700,
                      border: '1px solid #EAE4DF',
                    }}
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 20,
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
          onClick={openPlateBuilder}
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
