import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AvailabilityToggle } from '@/components/admin/AdminShared';

export type ExtraItemForm = {
  name: string;
  description: string;
  imageUrl: string;
  salePrice: string;
  available: boolean;
};

type ExtraItemFormModalProps = {
  editingExtraId: string | null;
  extraForm: ExtraItemForm;
  isValid: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof ExtraItemForm, value: string | boolean) => void;
};

export function ExtraItemFormModal({
  editingExtraId,
  extraForm,
  isValid,
  onClose,
  onSubmit,
  onChange,
}: ExtraItemFormModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(17, 24, 39, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: '100%',
          maxWidth: 560,
          background: '#fff',
          border: '1px solid #EAE4DF',
          borderRadius: 12,
          boxShadow: '0 24px 48px rgba(17, 24, 39, 0.18)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #EAE4DF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
              {editingExtraId ? 'Editar item extra' : 'Novo item extra'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6B7280' }}>
              Bebidas, chocolates e produtos vendidos fora das cubas.
            </p>
          </div>
          <button
            type="button"
            title="Fechar"
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid #EAE4DF',
              borderRadius: 7,
              color: '#6B7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 7,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 24, display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
            Nome
            <input
              value={extraForm.name}
              onChange={e => onChange('name', e.target.value)}
              style={{ height: 40, border: '1px solid #EAE4DF', borderRadius: 8, padding: '0 12px', fontSize: 14, color: '#1F2937', outline: 'none' }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
            Descricao
            <textarea
              value={extraForm.description}
              onChange={e => onChange('description', e.target.value)}
              rows={3}
              style={{ border: '1px solid #EAE4DF', borderRadius: 8, padding: '10px 12px', fontSize: 14, color: '#1F2937', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
            URL da imagem
            <input
              value={extraForm.imageUrl}
              onChange={e => onChange('imageUrl', e.target.value)}
              style={{ height: 40, border: '1px solid #EAE4DF', borderRadius: 8, padding: '0 12px', fontSize: 14, color: '#1F2937', outline: 'none' }}
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'end' }}>
            <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
              Preco de venda
              <input
                type="number"
                min="0"
                step="0.01"
                value={extraForm.salePrice}
                onChange={e => onChange('salePrice', e.target.value)}
                style={{ height: 40, border: '1px solid #EAE4DF', borderRadius: 8, padding: '0 12px', fontSize: 14, color: '#1F2937', outline: 'none' }}
              />
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40 }}>
              <AvailabilityToggle
                checked={extraForm.available}
                onChange={() => onChange('available', !extraForm.available)}
              />
              <span style={{ width: 88, fontSize: 13, color: extraForm.available ? '#15803D' : '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {extraForm.available ? 'Disponivel' : 'Indisponivel'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #EAE4DF', background: '#FAFAF9', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              height: 38,
              border: '1px solid #EAE4DF',
              borderRadius: 8,
              background: '#fff',
              color: '#6B7280',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              padding: '0 14px',
            }}
          >
            Cancelar
          </button>
          <PrimaryButton
            type="submit"
            disabled={!isValid}
            text={editingExtraId ? 'Salvar alteracoes' : 'Criar item'}
          />
        </div>
      </form>
    </div>
  );
}
