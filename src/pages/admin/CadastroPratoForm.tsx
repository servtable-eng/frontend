import { useEffect, useState, type ChangeEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight, X, CheckCircle2,
} from 'lucide-react';
import { Button, Input, Select } from '@workspace/ui';
import '@workspace/ui/styles.css';
import { ROUTES } from '@/routes/routeConstants';
import { getConfiguredRestaurantId } from '@/services/api';
import { createDish, getDish, updateDish } from '@/services/dishes/dish.service';
import '@/styles/tokens.css';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AvailabilityToggle } from '@/components/admin/AdminShared';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { AdminDishFormSkeleton } from '@/components/loading';

const CATEGORIA_OPTS = [
  { value: '',                  label: 'Selecione uma categoria' },
  { value: 'ENTRADA',           label: 'Entradas'                },
  { value: 'PRATO_PRINCIPAL',   label: 'Pratos Principais'       },
  { value: 'SOBREMESA',         label: 'Sobremesas'              },
];

const CUBA_OPTS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Cuba ${i + 1}`,
}));
CUBA_OPTS.unshift({ value: '', label: 'Selecione a posição' });

const MIN_RECOMMENDED_WEIGHT = 25;
const MAX_RECOMMENDED_WEIGHT = 1000;
const RECOMMENDED_WEIGHT_STEP = 25;

type FormState = {
  nome:         string;
  descricao:    string;
  ingredientes: string;
  categoria:    string;
  custoPorKg:        string;
  recommendedWeightInGrams: number;
  availableQuantityInGrams: string;
  lowStockThresholdInGrams: string;
  disponivel:   boolean;
};

const INITIAL: FormState = {
  nome:         '',
  descricao:    '',
  ingredientes: '',
  categoria:    '',
  custoPorKg:        '',
  recommendedWeightInGrams: MIN_RECOMMENDED_WEIGHT,
  availableQuantityInGrams: '',
  lowStockThresholdInGrams: '',
  disponivel:   true,
};

function getInitialRecommendedWeight(weight?: number | null) {
  return typeof weight === 'number' && weight >= MIN_RECOMMENDED_WEIGHT
    ? weight
    : MIN_RECOMMENDED_WEIGHT;
}

const restaurantId = getConfiguredRestaurantId();
function parseCurrency(value: string) {
  const normalized = value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  return Number(normalized) || 0;
}

function parseGramsInput(value: string) {
  if (!/^\d+$/.test(value.trim())) return null;
  const grams = Number(value);
  return Number.isSafeInteger(grams) && grams > 0 ? grams : null;
}

function formatGramsInput(value?: number | null) {
  if (typeof value !== 'number') return '';
  return String(Math.max(Math.trunc(value), 0));
}

function sanitizeGramsInput(value: string) {
  return value.replace(/\D/g, '');
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1F2937', marginBottom: 5, fontFamily: 'Inter, system-ui, sans-serif' }}>
      {children}
      {required && <span style={{ color: '#C9623A', marginLeft: 3 }}>*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p style={{ margin: '4px 0 0', fontSize: 12, color: '#EF4444', fontFamily: 'Inter, system-ui, sans-serif' }}>{msg}</p>;
}

function Textarea({ value, onChange, rows = 3, placeholder, error }: {
  value: string; onChange: (v: string) => void;
  rows?: number; placeholder?: string; error?: string;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '10px 14px', fontSize: 14,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#1F2937',
        background: '#fff',
        border: `1px solid ${error ? '#EF4444' : '#EAE4DF'}`,
        borderRadius: 8, outline: 'none', resize: 'vertical',
        lineHeight: 1.55,
      }}
    />
  );
}

export function CadastroPratoForm() {
  const { dishId } = useParams();
  const isEditing = Boolean(dishId);
  const [form, setForm]       = useState<FormState>(INITIAL);
  const [errors, setErrors]   = useState<Partial<Record<keyof FormState, string>>>({});
  const [saved, setSaved]     = useState(false);
  const [saving, setSaving]   = useState(false);
  const [loadingDish, setLoadingDish] = useState(false);
  const [apiError, setApiError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
    setSaved(false);
  };

  useEffect(() => {
    if (!dishId) {
      setForm(INITIAL);
      setImageFile(null);
      setCurrentImageUrl(null);
      setErrors({});
      setSaved(false);
      setApiError('');
      return;
    }

    setLoadingDish(true);
    setApiError('');

    getDish(dishId)
      .then(dish => {
        setForm({
          nome: dish.name,
          descricao: dish.description,
          ingredientes: dish.ingredients.join(', '),
          categoria: dish.category,
          custoPorKg: String(dish.costPerKg),
          recommendedWeightInGrams: getInitialRecommendedWeight(dish.recommendedWeightInGrams),
          availableQuantityInGrams: formatGramsInput(dish.availableQuantityInGrams),
          lowStockThresholdInGrams: formatGramsInput(dish.lowStockThresholdInGrams),
          disponivel: dish.available,
        });
        setCurrentImageUrl(dish.imageUrl || null);
        setImageFile(null);
        setErrors({});
        setSaved(false);
      })
      .catch(() => setApiError('Não foi possível carregar o prato.'))
      .finally(() => setLoadingDish(false));
  }, [dishId]);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.nome.trim())      e.nome      = 'Nome é obrigatório.';
    if (!form.categoria)        e.categoria = 'Selecione uma categoria.';
    if (!form.custoPorKg.trim())     e.custoPorKg     = 'Informe o custo por kg.';
    if (
      form.recommendedWeightInGrams < MIN_RECOMMENDED_WEIGHT
      || form.recommendedWeightInGrams > MAX_RECOMMENDED_WEIGHT
      || form.recommendedWeightInGrams % RECOMMENDED_WEIGHT_STEP !== 0
    ) {
      e.recommendedWeightInGrams = 'Informe um peso entre 25 g e 1000 g, em múltiplos de 25 g.';
    }
    if (form.disponivel) {
      const availableQuantityInGrams = parseGramsInput(form.availableQuantityInGrams);
      const lowStockThresholdInGrams = parseGramsInput(form.lowStockThresholdInGrams);

      if (availableQuantityInGrams === null) {
        e.availableQuantityInGrams = 'Informe uma quantidade disponível maior que zero.';
      }

      if (lowStockThresholdInGrams === null) {
        e.lowStockThresholdInGrams = 'Informe uma quantidade disponível maior que zero.';
      } else if (availableQuantityInGrams !== null && lowStockThresholdInGrams >= availableQuantityInGrams) {
        e.lowStockThresholdInGrams = 'O alerta de estoque baixo deve ser menor que a quantidade disponível.';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!restaurantId) {
      setApiError('Restaurante não configurado.');
      return;
    }
    setSaving(true);
    setApiError('');
    try {
      const availableQuantityInGrams = parseGramsInput(form.availableQuantityInGrams);
      const lowStockThresholdInGrams = parseGramsInput(form.lowStockThresholdInGrams);
      const payload = {
        name: form.nome.trim(),
        description: form.descricao.trim(),
        ingredients: form.ingredientes.split(',').map(item => item.trim()).filter(Boolean),
        category: form.categoria.startsWith('PRATO_PRINCIPAL') ? 'PRATO_PRINCIPAL' : form.categoria,
        costPerKg: parseCurrency(form.custoPorKg),
        recommendedWeightInGrams: form.recommendedWeightInGrams,
        available: form.disponivel,
        ...(form.disponivel && availableQuantityInGrams !== null && lowStockThresholdInGrams !== null
          ? { availableQuantityInGrams, lowStockThresholdInGrams }
          : {}),
      };

      if (dishId) {
        await updateDish(dishId, payload, imageFile);
      } else {
        await createDish(restaurantId, payload, imageFile);
      }
      setSaved(true);
    } catch {
      setApiError('Não foi possí­vel salvar o prato.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(INITIAL);
    setErrors({});
    setSaved(false);
    setApiError('');
    setImageFile(null);
  };

  const card: React.CSSProperties = {
    background: '#fff', border: '1px solid #EAE4DF', borderRadius: 12,
    padding: 24, display: 'flex', flexDirection: 'column', gap: 20,
  };

  const section: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: 16,
  };

  if (loadingDish) {
    return (
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 88 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 40px' }}>
          <AdminDishFormSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 88, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Breadcrumb + Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7280' }}>
              <Link to={ROUTES.ADMIN_CARDAPIO} style={{ color: '#6B7280', textDecoration: 'none' }}>Cardápio</Link>
              <ChevronRight size={14} />
              <span style={{ color: '#1F2937', fontWeight: 500 }}>{isEditing ? 'Editar Prato' : 'Novo Prato'}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em' }}>
              {isEditing ? 'Editar Prato' : 'Cadastro de Prato'}
            </h1>
          </div>

          {/* Success banner */}
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: 10, padding: '12px 16px' }}>
              <CheckCircle2 size={18} color="#15803D" />
              <span style={{ fontSize: 14, fontWeight: 500, color: '#15803D' }}>{isEditing ? 'Prato atualizado com sucesso!' : 'Prato cadastrado com sucesso!'}</span>
              <button onClick={() => setSaved(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#15803D', display: 'flex', padding: 2 }}>
                <X size={16} />
              </button>
            </div>
          )}
          {apiError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#DC2626' }}>{apiError}</span>
            </div>
          )}
          {/* Two-column layout */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

            {/* Left: Form */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Basic info card */}
              <div style={card}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Informações básicas</p>
                <div style={section}>
                  <div>
                    <FieldLabel required>Nome do Prato</FieldLabel>
                    <Input
                      placeholder="Ex: Frango Grelhado"
                      value={form.nome}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => set('nome', e.target.value)}
                      error={errors.nome}
                    />
                  </div>

                  <div>
                    <FieldLabel>Descrição</FieldLabel>
                    <Textarea
                      rows={3}
                      placeholder="Descreva o prato para os clientes..."
                      value={form.descricao}
                      onChange={v => set('descricao', v)}
                    />
                  </div>

                  <div>
                    <FieldLabel>Ingredientes</FieldLabel>
                    <Textarea
                      rows={2}
                      placeholder="Liste os ingredientes separados por vírgula..."
                      value={form.ingredientes}
                      onChange={v => set('ingredientes', v)}
                    />
                    <p style={{ margin: '5px 0 0', fontSize: 12, color: '#6B7280', fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Útil para clientes com restrições alimentares.
                    </p>
                  </div>
                </div>
              </div>

              {/* Classificação card */}
              <div style={card}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Classificação</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <FieldLabel required>Categoria</FieldLabel>
                    <Select
                      options={CATEGORIA_OPTS}
                      value={form.categoria}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => set('categoria', e.target.value)}
                      error={errors.categoria}
                    />
                    <FieldError msg={errors.categoria} />
                  </div>
                </div>
              </div>

              {/* Custo + Disponibilidade card */}
              <div style={card}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gestão</p>
                <div style={section}>
                  <div>
                    <FieldLabel required>Custo Interno</FieldLabel>
                    <div style={{ maxWidth: 220 }}>
                      <Input
                        placeholder="R$ 0,00"
                        value={form.custoPorKg}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => set('custoPorKg', e.target.value)}
                        error={errors.custoPorKg}
                      />
                    </div>
                    <p style={{ margin: '5px 0 0', fontSize: 12, color: '#6B7280', fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Visível apenas para gestão. Clientes não veem o custo.
                    </p>
                  </div>

                  <div style={{ paddingTop: 12, borderTop: '1px solid #EAE4DF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <FieldLabel required>Peso sugerido</FieldLabel>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#C9623A', fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {form.recommendedWeightInGrams} g
                      </span>
                    </div>
                    <input
                      type="range"
                      min={MIN_RECOMMENDED_WEIGHT}
                      max={MAX_RECOMMENDED_WEIGHT}
                      step={RECOMMENDED_WEIGHT_STEP}
                      value={form.recommendedWeightInGrams}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => set('recommendedWeightInGrams', Number(event.target.value))}
                      style={{ width: '100%', accentColor: '#C9623A', cursor: 'pointer' }}
                    />
                    <p style={{ margin: '5px 0 0', fontSize: 12, color: '#6B7280', fontFamily: 'Inter, system-ui, sans-serif', lineHeight: 1.5 }}>
                      Este será o peso sugerido ao cliente. O cliente poderá alterá-lo antes de adicionar o prato.
                    </p>
                    <FieldError msg={errors.recommendedWeightInGrams} />
                  </div>

                  <div style={{ paddingTop: 12, borderTop: '1px solid #EAE4DF' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <FieldLabel required={form.disponivel}>Quantidade disponível</FieldLabel>
                        <Input
                          placeholder="Ex: 1500"
                          value={form.availableQuantityInGrams}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => set('availableQuantityInGrams', sanitizeGramsInput(e.target.value))}
                          error={errors.availableQuantityInGrams}
                        />
                        <p style={{ margin: '5px 0 0', fontSize: 12, color: '#6B7280', fontFamily: 'Inter, system-ui, sans-serif' }}>
                          Informe a quantidade em gramas (g), sem casas decimais.
                        </p>
                        <FieldError msg={errors.availableQuantityInGrams} />
                      </div>

                      <div>
                        <FieldLabel required={form.disponivel}>Alerta de estoque baixo</FieldLabel>
                        <Input
                          placeholder="Ex: 750"
                          value={form.lowStockThresholdInGrams}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => set('lowStockThresholdInGrams', sanitizeGramsInput(e.target.value))}
                          error={errors.lowStockThresholdInGrams}
                        />
                        <p style={{ margin: '5px 0 0', fontSize: 12, color: '#6B7280', fontFamily: 'Inter, system-ui, sans-serif' }}>
                          Quando o estoque chegar nesse valor, o prato será destacado como baixo.
                        </p>
                        <FieldError msg={errors.lowStockThresholdInGrams} />
                      </div>
                    </div>
                  </div>

                  <div style={{ paddingTop: 12, borderTop: '1px solid #EAE4DF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#1F2937' }}>Disponibilidade</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280' }}>
                        {form.disponivel ? 'Prato visível e disponível no buffet' : 'Prato oculto no buffet'}
                      </p>
                    </div>
                    <AvailabilityToggle checked={form.disponivel} onChange={() => set('disponivel', !form.disponivel)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image upload */}
            <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1F2937' }}>Imagem do Prato</p>
              <ImageUpload
                value={imageFile}
                currentImageUrl={currentImageUrl}
                onChange={file => { setImageFile(file); setSaved(false); }}
                disabled={saving || loadingDish}
              />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div style={{
          position: 'fixed', bottom: 0, left: 240, right: 0,
          background: '#fff', borderTop: '1px solid #EAE4DF',
          padding: '14px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 20,
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#6B7280', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {Object.keys(errors).length > 0
              ? `${Object.keys(errors).length} campo${Object.keys(errors).length > 1 ? 's' : ''} obrigatório${Object.keys(errors).length > 1 ? 's' : ''} não preenchido${Object.keys(errors).length > 1 ? 's' : ''}.`
              : 'Preencha os campos e salve o prato.'}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" size="md" onClick={handleCancel}>Cancelar</Button>
            <PrimaryButton
              text={saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Salvar prato'}
              onClick={handleSave}
              disabled={saving || loadingDish}
              loading={saving}
            />
          </div>
        </div>
    </main>
  );
}
