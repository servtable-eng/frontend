import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomerPlate } from '@/contexts/CustomerPlateContext';
import type { ClientDishDto } from '@/types/dish';
import type { PlateReviewState, PortionSize } from '@/types/order';
import {
  AddMoreButton,
  PlateBuilderBottomBar,
  PlateBuilderSummary,
  PlateDishCard,
} from '@/components/customer/PlateBuilderComponents';
import { customerFont, EmptyState, ImgSafe, MobilePageHeader } from '@/components/customer/CustomerShared';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ROUTES } from '@/routes/routeConstants';
import '../../styles/tokens.css';

const PRICE_PER_100G = 4.5;
const PORTION_WEIGHTS: Record<PortionSize, number> = { SMALL: 150, MEDIUM: 250, LARGE: 350 };
const PORTION_LABELS: Record<PortionSize, string> = { SMALL: 'Pequena', MEDIUM: 'Media', LARGE: 'Grande' };
const PORTIONS: PortionSize[] = ['SMALL', 'MEDIUM', 'LARGE'];

export function PlateBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const builderState = location.state as Pick<PlateReviewState, 'cartPlateId' | 'extraQuantities'> | null;
  const {
    plateItems,
    totalQuantity,
    updatePlateItem,
    removePlateItem,
  } = useCustomerPlate();
  const [confirmed, setConfirmed] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [draftPortion, setDraftPortion] = useState<PortionSize>('MEDIUM');
  const [draftObservation, setDraftObservation] = useState('');

  const items: ClientDishDto[] = plateItems.map(item => ({
    id: item.dishId,
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
  }));

  const setPortion = (id: string, portionSize: PortionSize) => {
    updatePlateItem(id, { portionSize });
    setConfirmed(false);
  };

  const setNote = (id: string, observation: string) => {
    updatePlateItem(id, { observation });
    setConfirmed(false);
  };

  const removeItem = (id: string) => {
    removePlateItem(id);
    setConfirmed(false);
  };

  const openEdit = (id: string) => {
    const item = plateItems.find(plateItem => plateItem.dishId === id);
    if (!item) return;

    setEditingDishId(id);
    setDraftPortion(item.portionSize);
    setDraftObservation(item.observation);
  };

  const closeEdit = () => {
    setEditingDishId(null);
    setDraftPortion('MEDIUM');
    setDraftObservation('');
  };

  const saveEdit = () => {
    if (!editingDishId) return;

    updatePlateItem(editingDishId, {
      portionSize: draftPortion,
      observation: draftObservation,
    });
    setConfirmed(false);
    closeEdit();
  };

  const removeEditingItem = () => {
    if (!editingDishId) return;

    removeItem(editingDishId);
    closeEdit();
  };

  const goBack = () => navigate(-1);
  const goToBuffet = () => navigate(ROUTES.CUSTOMER_HOME);

  const continueToReview = () => {
    const state: PlateReviewState = {
      cartPlateId: builderState?.cartPlateId,
      extraQuantities: builderState?.extraQuantities,
      items: plateItems.map(item => ({
        dishId: item.dishId,
        dishName: item.name,
        imageUrl: item.imageUrl,
        portion: item.portionSize,
        observation: item.observation,
      })),
    };

    setConfirmed(true);
    navigate(ROUTES.CUSTOMER_PLATE_REVIEW, { state });
  };

  const totalWeight = plateItems.reduce(
    (sum, item) => sum + PORTION_WEIGHTS[item.portionSize] * item.quantity,
    0,
  );
  const totalPrice = plateItems.reduce(
    (sum, item) => sum + PRICE_PER_100G * PORTION_WEIGHTS[item.portionSize] * item.quantity / 100,
    0,
  );
  const editingItem = plateItems.find(item => item.dishId === editingDishId) ?? null;

  return (
    <div style={{ height: '100svh', maxWidth: 390, margin: '0 auto', display: 'flex', flexDirection: 'column', background: '#F8F6F4', fontFamily: customerFont, overflow: 'hidden' }}>
      <MobilePageHeader
        title="Montar prato"
        subtitle="Personalize seu pedido"
        onBack={goBack}
        badge={(
          <span style={{ fontSize: 13, fontWeight: 600, color: '#C9623A', background: '#FDF5F2', padding: '4px 10px', borderRadius: 8 }}>
            {totalQuantity} {totalQuantity === 1 ? 'item' : 'itens'}
          </span>
        )}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 110px' }}>
        {items.length === 0 && (
          <EmptyState
            title="Prato vazio"
            message="Volte ao buffet para selecionar itens"
            actionLabel="Voltar ao buffet"
            onAction={goToBuffet}
          />
        )}

        {items.map(item => {
          const draftItem = plateItems.find(plateItem => plateItem.dishId === item.id);
          const portion = draftItem?.portionSize ?? 'MEDIUM';
          const note = draftItem?.observation ?? '';
          const quantity = draftItem?.quantity ?? 1;
          const itemPrice = PRICE_PER_100G * PORTION_WEIGHTS[portion] * quantity / 100;

          return (
            <PlateDishCard
              key={item.id}
              item={item}
              portion={portion}
              note={note}
              price={itemPrice}
              portionWeights={PORTION_WEIGHTS}
              portionLabels={PORTION_LABELS}
              portions={PORTIONS}
              onSetPortion={nextPortion => setPortion(item.id, nextPortion)}
              onSetNote={nextNote => setNote(item.id, nextNote)}
              onEdit={() => openEdit(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          );
        })}

        {items.length > 0 && <AddMoreButton onClick={goToBuffet} />}

        {items.length > 0 && (
          <PlateBuilderSummary
            itemCount={totalQuantity}
            totalWeight={totalWeight}
            pricePer100g={PRICE_PER_100G}
            totalPrice={totalPrice}
          />
        )}
      </div>

      {items.length > 0 && (
        <PlateBuilderBottomBar
          totalPrice={totalPrice}
          confirmed={confirmed}
          onContinue={continueToReview}
        />
      )}

      {editingItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(17, 24, 39, 0.45)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div style={{ width: '100%', maxWidth: 390, background: '#fff', borderRadius: '18px 18px 0 0', border: '1px solid #EAE4DF', boxShadow: '0 -18px 38px rgba(17, 24, 39, 0.18)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #EAE4DF', display: 'flex', gap: 12, alignItems: 'center' }}>
              <ImgSafe src={editingItem.imageUrl} alt={editingItem.name} style={{ width: 58, height: 58, borderRadius: 12, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1F2937', lineHeight: 1.2 }}>{editingItem.name}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9CA3AF' }}>Editar item do prato</p>
              </div>
            </div>

            <div style={{ padding: 16 }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Porcao</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {PORTIONS.map(portion => {
                  const active = draftPortion === portion;

                  return (
                    <button
                      key={portion}
                      type="button"
                      onClick={() => setDraftPortion(portion)}
                      style={{
                        flex: 1,
                        padding: '9px 4px',
                        borderRadius: 10,
                        border: 'none',
                        background: active ? '#C9623A' : '#F0EDE9',
                        color: active ? '#fff' : '#374151',
                        cursor: 'pointer',
                        fontFamily: customerFont,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      <div>{PORTION_LABELS[portion]}</div>
                      <div style={{ fontSize: 10, opacity: 0.75, marginTop: 1 }}>{PORTION_WEIGHTS[portion]}g</div>
                    </button>
                  );
                })}
              </div>

              <label style={{ display: 'grid', gap: 6, fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Observacao
                <input
                  type="text"
                  value={draftObservation}
                  onChange={event => setDraftObservation(event.target.value)}
                  placeholder="Adicionar observacao..."
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 12px',
                    borderRadius: 10,
                    border: '1.5px solid #EAE4DF',
                    background: '#FAFAF9',
                    fontSize: 13,
                    color: '#1F2937',
                    fontFamily: customerFont,
                    outline: 'none',
                    textTransform: 'none',
                    letterSpacing: 0,
                    fontWeight: 500,
                  }}
                />
              </label>
            </div>

            <div style={{ padding: '12px 16px 16px', borderTop: '1px solid #EAE4DF', display: 'flex', gap: 8, alignItems: 'center', background: '#FAFAF9' }}>
              <button
                type="button"
                onClick={removeEditingItem}
                style={{ height: 38, border: '1px solid #FEE2E2', borderRadius: 8, background: '#FFF5F5', color: '#EF4444', cursor: 'pointer', fontSize: 14, fontWeight: 700, padding: '0 12px', fontFamily: customerFont }}
              >
                Remover
              </button>
              <button
                type="button"
                onClick={closeEdit}
                style={{ marginLeft: 'auto', height: 38, border: '1px solid #EAE4DF', borderRadius: 8, background: '#fff', color: '#6B7280', cursor: 'pointer', fontSize: 14, fontWeight: 700, padding: '0 14px', fontFamily: customerFont }}
              >
                Cancelar
              </button>
              <PrimaryButton text="Salvar" onClick={saveEdit} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlateBuilder;
