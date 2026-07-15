import { useEffect, useRef, useState } from 'react';
import { Clock3, Save } from 'lucide-react';
import { showError, showSuccess } from '@/components/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminShared';
import { useRestaurant } from '@/contexts/RestaurantContext';
import {
  getRestaurantSettings,
  updateDefaultOrderEstimateMinutes,
  updateRestaurantPricePer100g,
} from '@/services/restaurants/restaurantSettings.service';
import { AdminSettingsSkeleton } from '@/components/loading';

const brl = (value: number) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function parseBrazilianCurrency(value: string) {
  const normalizedValue = value.trim().replace(/\./g, '').replace(',', '.');
  const numericValue = Number(normalizedValue);

  return Number.isFinite(numericValue) ? numericValue : null;
}

function validatePrice(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 'Informe o preço por 100g.';
  }

  if (!/^\d+(?:[,.]\d{1,2})?$/.test(trimmedValue)) {
    return 'Use um valor com no máximo 2 casas decimais.';
  }

  const numericValue = parseBrazilianCurrency(trimmedValue);

  if (numericValue === null || numericValue <= 0) {
    return 'O preço deve ser maior que zero.';
  }

  return '';
}

function formatInputValue(value: number) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function validateOrderEstimate(value: string) {
  if (!value.trim()) return 'Informe o prazo estimado.';

  const minutes = Number(value);
  if (!Number.isInteger(minutes)) return 'Informe o prazo em minutos inteiros.';
  if (minutes < 5) return 'O prazo mínimo é de 5 minutos.';
  if (minutes > 240) return 'O prazo máximo é de 240 minutos.';
  return '';
}

function formatOrderEstimate(minutes: number) {
  if (minutes < 60) return `${minutes} minutos`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}min`;
}

export function Configuracoes() {
  const restaurant = useRestaurant();
  const [priceInput, setPriceInput] = useState('');
  const [savedPrice, setSavedPrice] = useState<number | null>(restaurant.pricePer100g ?? null);
  const [validationError, setValidationError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [estimateInput, setEstimateInput] = useState('');
  const [savedEstimate, setSavedEstimate] = useState<number | null>(null);
  const [estimateValidationError, setEstimateValidationError] = useState('');
  const [isSavingEstimate, setIsSavingEstimate] = useState(false);
  const estimateRequestPendingRef = useRef(false);

  useEffect(() => {
    if (!restaurant.id) {
      setLoadError('Restaurante não configurado.');
      return;
    }

    setIsLoading(true);
    setLoadError('');

    getRestaurantSettings(restaurant.id)
      .then(settings => {
        setSavedPrice(settings.pricePer100g);
        setPriceInput(formatInputValue(settings.pricePer100g));
        setSavedEstimate(settings.defaultOrderEstimateMinutes);
        setEstimateInput(String(settings.defaultOrderEstimateMinutes));
      })
      .catch(() => {
        setLoadError('Não foi possível carregar as configurações do restaurante.');
      })
      .finally(() => setIsLoading(false));
  }, [restaurant.id]);

  const savePrice = async () => {
    const error = validatePrice(priceInput);
    setValidationError(error);

    if (error || !restaurant.id) {
      return;
    }

    const pricePer100g = parseBrazilianCurrency(priceInput);

    if (pricePer100g === null) {
      setValidationError('Informe um preço válido.');
      return;
    }

    setIsSaving(true);

    try {
      const settings = await updateRestaurantPricePer100g(restaurant.id, pricePer100g);
      setSavedPrice(settings.pricePer100g);
      setPriceInput(formatInputValue(settings.pricePer100g));
      showSuccess('Preço por peso atualizado com sucesso.');
    } catch {
      showError('Não foi possível atualizar o preço por peso. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const parsedPrice = parseBrazilianCurrency(priceInput);
  const formattedPreview = parsedPrice !== null && parsedPrice > 0 ? brl(parsedPrice) : '';
  const parsedEstimate = Number(estimateInput);
  const estimatePreview = Number.isInteger(parsedEstimate) && parsedEstimate >= 5 && parsedEstimate <= 240
    ? formatOrderEstimate(parsedEstimate)
    : savedEstimate !== null ? formatOrderEstimate(savedEstimate) : '20 minutos';

  const saveOrderEstimate = async () => {
    if (estimateRequestPendingRef.current) return;

    const error = validateOrderEstimate(estimateInput);
    setEstimateValidationError(error);
    if (error || !restaurant.id) return;

    const defaultOrderEstimateMinutes = Number(estimateInput);
    estimateRequestPendingRef.current = true;
    setIsSavingEstimate(true);

    try {
      const settings = await updateDefaultOrderEstimateMinutes(
        restaurant.id,
        defaultOrderEstimateMinutes,
      );
      setSavedEstimate(settings.defaultOrderEstimateMinutes);
      setEstimateInput(String(settings.defaultOrderEstimateMinutes));
      showSuccess('Prazo estimado atualizado com sucesso.');
    } catch {
      showError('Não foi possível atualizar o prazo estimado.');
    } finally {
      estimateRequestPendingRef.current = false;
      setIsSavingEstimate(false);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <AdminPageHeader
        title="Configurações"
        subtitle="Ajuste as regras de atendimento do restaurante."
      />

      <section style={{ marginTop: 24, maxWidth: 720, display: 'grid', gap: 18 }}>
        {isLoading ? (
          <AdminSettingsSkeleton />
        ) : (
        <>
        <div style={{ background: '#fff', border: '1px solid #EAE4DF', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '20px 22px', borderBottom: '1px solid #EAE4DF' }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1F2937', letterSpacing: '-0.01em' }}>
              Preço da refeição por peso
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>
              Defina quanto o cliente pagará a cada 100g de comida do buffet.
            </p>
          </div>

          <div style={{ padding: 22, display: 'grid', gap: 14 }}>
            {loadError && (
              <div style={{ padding: '11px 12px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 14 }}>
                {loadError}
              </div>
            )}

            <label style={{ display: 'grid', gap: 7, maxWidth: 320 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>
                Preço por 100g
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={priceInput}
                onChange={event => {
                  setPriceInput(event.target.value);
                  setValidationError('');
                }}
                onBlur={() => {
                  const parsedValue = parseBrazilianCurrency(priceInput);
                  if (parsedValue !== null && parsedValue > 0) {
                    setPriceInput(formatInputValue(parsedValue));
                  }
                }}
                placeholder="Ex: 7,99"
                disabled={isLoading || isSaving}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '11px 12px',
                  borderRadius: 8,
                  border: `1.5px solid ${validationError ? '#EF4444' : '#D1D5DB'}`,
                  background: isLoading ? '#F9FAFB' : '#fff',
                  color: '#1F2937',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </label>

            {validationError && (
              <p style={{ margin: 0, fontSize: 13, color: '#DC2626' }}>
                {validationError}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
              {formattedPreview && (
                <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
                  Valor exibido ao cliente: <strong style={{ color: '#1F2937' }}>{formattedPreview}</strong> a cada 100g
                </p>
              )}
              {savedPrice !== null && (
                <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF' }}>
                  Valor atual salvo: {brl(savedPrice)}
                </p>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={savePrice}
                disabled={isLoading || isSaving}
                style={{
                  minHeight: 42,
                  padding: '0 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: isLoading || isSaving ? '#B8A59A' : '#C9623A',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isLoading || isSaving ? 'default' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Save size={16} />
                {isSaving ? 'Salvando...' : 'Salvar preço'}
              </button>
            </div>
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #EAE4DF', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '20px 22px', borderBottom: '1px solid #EAE4DF' }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1F2937', letterSpacing: '-0.01em' }}>
              Prazo estimado dos pedidos
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>
              Defina o prazo padrão informado ao cliente para a preparação e entrega dos novos pedidos.
            </p>
          </div>

          <div style={{ padding: 22, display: 'grid', gap: 14 }}>
            <label style={{ display: 'grid', gap: 7, width: '100%', maxWidth: 320 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>
                Prazo em minutos
              </span>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="number"
                  min={5}
                  max={240}
                  step={5}
                  required
                  value={estimateInput}
                  onChange={event => {
                    setEstimateInput(event.target.value);
                    setEstimateValidationError('');
                  }}
                  disabled={isSavingEstimate}
                  aria-invalid={Boolean(estimateValidationError)}
                  aria-describedby="order-estimate-help"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 76px 11px 12px',
                    borderRadius: 8,
                    border: `1.5px solid ${estimateValidationError ? '#EF4444' : '#D1D5DB'}`,
                    background: isSavingEstimate ? '#F9FAFB' : '#fff',
                    color: '#1F2937',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
                <span aria-hidden="true" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7280', fontSize: 13, pointerEvents: 'none' }}>
                  minutos
                </span>
              </div>
            </label>

            {estimateValidationError && (
              <p style={{ margin: 0, fontSize: 13, color: '#DC2626' }}>{estimateValidationError}</p>
            )}

            <div id="order-estimate-help" style={{ display: 'grid', gap: 6 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.5, overflowWrap: 'anywhere' }}>
                Novos pedidos terão prazo estimado de <strong style={{ color: '#1F2937' }}>{estimatePreview}</strong>.
              </p>
              <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
                A alteração será aplicada apenas aos novos pedidos.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={saveOrderEstimate}
                disabled={isSavingEstimate}
                style={{
                  minHeight: 42,
                  width: '100%',
                  maxWidth: 180,
                  padding: '0 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: isSavingEstimate ? '#B8A59A' : '#C9623A',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isSavingEstimate ? 'default' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Clock3 size={16} />
                {isSavingEstimate ? 'Salvando...' : 'Salvar prazo'}
              </button>
            </div>
          </div>
        </div>
        </>
        )}
      </section>
    </main>
  );
}

export default Configuracoes;
