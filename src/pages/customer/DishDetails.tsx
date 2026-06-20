import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Camera, Plus, CheckCircle2 } from 'lucide-react';
import { useCustomerPlate } from '@/contexts/CustomerPlateContext';
import { ROUTES } from '@/routes/routeConstants';
import { getDish } from '../../services/dishes/dish.service';
import '../../styles/tokens.css';

type DetailDish = {
  id: string;
  name: string;
  category: string;
  image: string;
  available: boolean;
  photoUpdatedAtLabel: string | null;
  desc: string;
  ingredients: string[];
};

const EMPTY_DISH: DetailDish = {
  id: '',
  name: 'Detalhes do Prato',
  category: '-',
  image: '',
  available: false,
  photoUpdatedAtLabel: null,
  desc: 'Nao foi possivel carregar este prato.',
  ingredients: ['Ingredientes nao disponiveis'],
};

const font = 'Inter, system-ui, sans-serif';

function formatPhotoUpdatedAt(value?: string | null) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isValidDate = (
    date.getFullYear() === Number(year)
    && date.getMonth() === Number(month) - 1
    && date.getDate() === Number(day)
  );

  if (!isValidDate) return null;

  return `${day}/${month}/${year}`;
}

export function DishDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setDishQuantity } = useCustomerPlate();
  const [dish, setDish] = useState<DetailDish>(EMPTY_DISH);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;

    getDish(id)
      .then(data => {
        setDish({
          id: data.id,
          name: data.name,
          category: data.category.replaceAll('_', ' '),
          image: data.imageUrl,
          available: data.available,
          photoUpdatedAtLabel: formatPhotoUpdatedAt(data.photoUpdatedAt),
          desc: data.description,
          ingredients: data.ingredients.length > 0 ? data.ingredients : ['Ingredientes nao disponiveis'],
        });
        setAdded(false);
      })
      .catch(() => setDish(EMPTY_DISH));
  }, [id]);

  const handleAdd = () => {
    if (!dish.available || !dish.id) return;

    setDishQuantity({
      id: dish.id,
      name: dish.name,
      description: dish.desc,
      imageUrl: dish.image,
      category: dish.category,
    }, 1);
    setAdded(true);
    setTimeout(() => navigate(ROUTES.CUSTOMER_PLATE_BUILDER), 350);
  };

  return (
    <div style={{
      height: '100svh', maxWidth: 390, margin: '0 auto',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: '#F8F6F4', fontFamily: font, position: 'relative',
    }}>
      <div style={{ position: 'relative', height: 340, flexShrink: 0, overflow: 'hidden' }}>
        {dish.image ? (
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
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#F0EDE9' }} />
        )}

        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 45%, rgba(0,0,0,0.08) 100%)',
          pointerEvents: 'none',
        }} />

        <button
          onClick={() => window.history.back()}
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

        {dish.photoUpdatedAtLabel && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              maxWidth: 190,
              padding: '7px 11px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.88)',
              color: '#374151',
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1.2,
              boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              whiteSpace: 'nowrap',
            }}
          >
            Atualizada em {dish.photoUpdatedAtLabel}
          </div>
        )}
      </div>

      <div style={{
        flex: 1, overflowY: 'auto',
        background: '#fff', borderRadius: '20px 20px 0 0',
        marginTop: -20, position: 'relative', zIndex: 10,
        paddingBottom: 100,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E5E0DB' }} />
        </div>

        <div style={{ padding: '4px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          </div>

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

          <div style={{ height: 1, background: '#EAE4DF', marginBottom: 18 }} />

          <section style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Descricao
            </p>
            <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.65 }}>
              {dish.desc}
            </p>
          </section>

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

          {dish.photoUpdatedAtLabel && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF' }}>
              <Camera size={13} />
              <span style={{ fontSize: 12 }}>Foto atualizada em {dish.photoUpdatedAtLabel}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid #EAE4DF',
        padding: '12px 16px', zIndex: 20,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => window.history.back()}
            style={{
              flex: '0 0 40%', padding: '14px 0', borderRadius: 14,
              border: '1.5px solid #EAE4DF', background: '#fff',
              fontSize: 15, fontWeight: 600, color: '#374151',
              cursor: 'pointer', fontFamily: font,
            }}
          >
            Voltar
          </button>

          <button
            onClick={handleAdd}
            disabled={!dish.available}
            style={{
              flex: 1, padding: '14px 0', borderRadius: 14, border: 'none',
              background: added ? '#15803D' : '#C9623A',
              color: '#fff',
              fontSize: 15, fontWeight: 700, fontFamily: font,
              cursor: 'pointer',
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
              'Indisponivel'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DishDetails;
