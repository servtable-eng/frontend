import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomerPlate } from '@/contexts/CustomerPlateContext';
import type { PlateReviewState } from '@/types/order';
import {
  AddMoreButton,
  PlateBuilderBottomBar,
  PlateBuilderSummary,
  PlateDishCard,
} from '@/components/customer/PlateBuilderComponents';
import { customerFont, EmptyState, ImgSafe, MobilePageHeader } from '@/components/customer/CustomerShared';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ROUTES } from '@/routes/routeConstants';
import { useRestaurantPricePer100g } from '@/hooks/useRestaurantPricePer100g';
import { calculateBuffetPrice, calculatePlateBuffetSubtotal } from '@/utils/buffetPricing';
import '../../styles/tokens.css';

function calculatePlateWeight(items: ReturnType<typeof useCustomerPlate>['plateItems']) {
  return items.reduce(
    (sum, item) => sum + item.portionWeightInGrams * item.quantity,
    0,
  );
}

export function PlateBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pricePer100g } = useRestaurantPricePer100g();
  const builderState = location.state as (Pick<PlateReviewState, 'cartPlateId' | 'extraQuantities'> & { editItemId?: string }) | null;
  const {
    plateItems,
    totalQuantity,
    updatePlateItem,
    removePlateItem,
  } = useCustomerPlate();
  const [confirmed, setConfirmed] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [draftPortionWeight, setDraftPortionWeight] = useState(250);
  const [draftObservation, setDraftObservation] = useState('');
  const [hasOpenedInitialEdit, setHasOpenedInitialEdit] = useState(false);

  const setPortionWeight = (id: string, portionWeightInGrams: number) => {
    updatePlateItem(id, { portionWeightInGrams, hasConfirmedWeight: true });
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
    const item = plateItems.find(plateItem => plateItem.id === id);
    if (!item) return;

    setEditingDishId(id);
    setDraftPortionWeight(item.portionWeightInGrams);
    setDraftObservation(item.observation);
  };

  useEffect(() => {
    if (!builderState?.editItemId || editingDishId || hasOpenedInitialEdit) {
      return;
    }

    openEdit(builderState.editItemId);
    setHasOpenedInitialEdit(true);
  }, [builderState?.editItemId, editingDishId, hasOpenedInitialEdit, plateItems]);

  const closeEdit = () => {
    setEditingDishId(null);
    setDraftPortionWeight(250);
    setDraftObservation('');
  };

  const saveEdit = () => {
    if (!editingDishId) return;

    updatePlateItem(editingDishId, {
      portionWeightInGrams: draftPortionWeight,
      hasConfirmedWeight: true,
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

  const goBack = () => navigate(ROUTES.CUSTOMER_HOME);
  const goToBuffet = () => navigate(ROUTES.CUSTOMER_HOME);

  const continueToReview = () => {
    if (!plateItems.every(item => item.hasConfirmedWeight)) {
      return;
    }

    const state: PlateReviewState = {
      cartPlateId: builderState?.cartPlateId,
      extraQuantities: builderState?.extraQuantities,
      items: plateItems.map(item => ({
        dishId: item.dishId,
        dishName: item.name,
        imageUrl: item.imageUrl,
        portionWeightInGrams: item.portionWeightInGrams,
        observation: item.observation,
      })),
    };

    setConfirmed(true);
    navigate(ROUTES.CUSTOMER_PLATE_REVIEW, { state });
  };

  const totalWeight = calculatePlateWeight(plateItems);
  const totalPrice = calculatePlateBuffetSubtotal(plateItems, pricePer100g);
  const editingItem = plateItems.find(item => item.id === editingDishId) ?? null;
  const canContinue = plateItems.length > 0 && plateItems.every(item => item.hasConfirmedWeight);

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
        {plateItems.length === 0 && (
          <EmptyState
            title="Prato vazio"
            message="Volte ao buffet para selecionar itens"
            actionLabel="Voltar ao buffet"
            onAction={goToBuffet}
          />
        )}

        {plateItems.length > 0 && (
          <PlateBuilderSummary
            itemCount={totalQuantity}
            totalWeight={totalWeight}
            pricePer100g={pricePer100g}
            totalPrice={totalPrice}
          />
        )}

        {plateItems.map(item => {
          const portionWeightInGrams = item.portionWeightInGrams;
          const hasConfirmedWeight = item.hasConfirmedWeight;
          const note = item.observation;
          const quantity = item.quantity;
          const itemPrice = calculateBuffetPrice(portionWeightInGrams, pricePer100g) * quantity;

          return (
            <PlateDishCard
              key={item.id}
              item={{
                id: item.dishId,
                name: item.name,
                description: item.description,
                imageUrl: item.imageUrl,
                recommendedWeightInGrams: item.portionWeightInGrams,
              }}
              portionWeightInGrams={portionWeightInGrams}
              hasConfirmedWeight={hasConfirmedWeight}
              note={note}
              price={itemPrice}
              onSetPortionWeight={nextWeight => setPortionWeight(item.id, nextWeight)}
              onSetNote={nextNote => setNote(item.id, nextNote)}
              onEdit={() => openEdit(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          );
        })}

        {plateItems.length > 0 && <AddMoreButton onClick={goToBuffet} />}
      </div>

      {plateItems.length > 0 && (
        <PlateBuilderBottomBar
          totalPrice={totalPrice}
          confirmed={confirmed}
          canContinue={canContinue}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Peso da porção</p>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#C9623A' }}>{draftPortionWeight} g</span>
              </div>
              <input
                type="range"
                min={25}
                max={1000}
                step={25}
                value={draftPortionWeight}
                onChange={event => setDraftPortionWeight(Number(event.target.value))}
                style={{ width: '100%', accentColor: '#C9623A', cursor: 'pointer', marginBottom: 8 }}
              />
              <p style={{ margin: '0 0 16px', fontSize: 11, color: '#6B7280', lineHeight: 1.35 }}>
                Sugestão do restaurante. Ajuste conforme desejar.
              </p>

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
