import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RestaurantProvider } from './RestaurantContext';
import { CustomerPlateProvider, useCustomerPlate } from './CustomerPlateContext';
import { createPlateItem } from './customerPlateItems';
import { CustomerCartProvider, useCustomerCart } from './CustomerCartContext';
import type { ClientDishDto } from '@/types/dish';

vi.mock('@/hooks/useRestaurantPricePer100g', () => ({
  useRestaurantPricePer100g: () => ({
    pricePer100g: 10,
    isLoadingPricePer100g: false,
    isRefreshingPricePer100g: false,
  }),
}));

vi.mock('@/components/ToastProvider', () => ({
  showSuccess: vi.fn(),
}));

const dish = (id: string): ClientDishDto => ({
  id,
  name: `Prato ${id}`,
  description: 'Descrição',
  imageUrl: '/dish.png',
  recommendedWeightInGrams: 100,
});

function Harness() {
  const { plateItems, updatePlateItem } = useCustomerPlate();
  const {
    cartPlates,
    plateItemConflict,
    requestAddPlateItem,
    addPlateToCart,
    updateCartPlate,
  } = useCustomerCart();

  const storedItem = createPlateItem(dish('one'), 100, 'original');

  return (
    <>
      <button onClick={() => requestAddPlateItem(dish('one'), 100, 'original')}>Adicionar primeiro</button>
      <button onClick={() => requestAddPlateItem(dish('one'), 200, 'nova')}>Adicionar novamente</button>
      <button onClick={() => requestAddPlateItem(dish('two'), 150, 'outro')}>Adicionar outro</button>
      <button onClick={() => updatePlateItem(plateItems[0]?.id ?? '', { portionWeightInGrams: 300, observation: 'editada' })}>
        Editar diretamente
      </button>
      <button onClick={() => addPlateToCart({
        plateItems: [storedItem],
        extras: [],
        buffetSubtotal: 10,
        extrasSubtotal: 0,
        total: 10,
      })}>
        Preparar carrinho
      </button>
      <button onClick={() => {
        const cartPlate = cartPlates[0];
        if (cartPlate) updateCartPlate(cartPlate.id, {
          plateItems: [{ ...cartPlate.plateItems[0], portionWeightInGrams: 350, observation: 'edição do carrinho' }],
        });
      }}>
        Editar carrinho
      </button>
      <output data-testid="plate-items">{JSON.stringify(plateItems)}</output>
      <output data-testid="cart-plates">{JSON.stringify(cartPlates)}</output>
      <output data-testid="has-conflict">{String(Boolean(plateItemConflict))}</output>
    </>
  );
}

function renderHarness() {
  return render(
    <MemoryRouter>
      <RestaurantProvider>
        <CustomerPlateProvider>
          <CustomerCartProvider>
            <Harness />
          </CustomerCartProvider>
        </CustomerPlateProvider>
      </RestaurantProvider>
    </MemoryRouter>,
  );
}

function readItems() {
  return JSON.parse(screen.getByTestId('plate-items').textContent ?? '[]') as Array<{
    dishId: string;
    portionWeightInGrams: number;
    observation: string;
  }>;
}

function readCartItems() {
  const plates = JSON.parse(screen.getByTestId('cart-plates').textContent ?? '[]') as Array<{
    plateItems: Array<{ dishId: string; portionWeightInGrams: number; observation: string }>;
    buffetSubtotal: number;
    total: number;
  }>;
  return { plates, items: plates.flatMap(plate => plate.plateItems) };
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('CustomerCartProvider dish conflicts', () => {
  it('adds different dishes normally and does not open a modal', () => {
    renderHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar primeiro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar outro' }));

    expect(readItems().map(item => item.dishId)).toEqual(['one', 'two']);
    expect(screen.getByTestId('has-conflict').textContent).toBe('false');
    expect(screen.queryByText('Este prato já está no seu pedido')).toBeNull();
  });

  it('keeps the incoming duplicate outside the plate until the customer decides', () => {
    renderHarness();
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar primeiro' }));

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar novamente' }));

    expect(readItems()).toHaveLength(1);
    expect(readItems()[0]).toMatchObject({ portionWeightInGrams: 100, observation: 'original' });
    expect(screen.getByText('Este prato já está no seu pedido')).toBeTruthy();
    expect(screen.getByText('Primeira inserção')).toBeTruthy();
    expect(screen.getByText('Nova inserção')).toBeTruthy();
  });

  it('keeps the first insertion or replaces it in the same position', () => {
    renderHarness();
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar primeiro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar novamente' }));
    fireEvent.click(screen.getByRole('button', { name: 'Manter primeira inserção' }));

    expect(readItems()).toEqual([expect.objectContaining({ portionWeightInGrams: 100, observation: 'original' })]);
    expect(screen.queryByText('Este prato já está no seu pedido')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar novamente' }));
    fireEvent.click(screen.getByRole('button', { name: 'Usar nova inserção' }));

    expect(readItems()).toEqual([expect.objectContaining({ portionWeightInGrams: 200, observation: 'nova' })]);
    expect(screen.queryByText('Este prato já está no seu pedido')).toBeNull();
  });

  it('updates an existing item directly without opening the conflict modal', () => {
    renderHarness();
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar primeiro' }));

    fireEvent.click(screen.getByRole('button', { name: 'Editar diretamente' }));

    expect(readItems()[0]).toMatchObject({ portionWeightInGrams: 300, observation: 'editada' });
    expect(screen.queryByText('Este prato já está no seu pedido')).toBeNull();
  });

  it('replaces a persisted cart item, recalculates totals, and saves it', async () => {
    renderHarness();
    fireEvent.click(screen.getByRole('button', { name: 'Preparar carrinho' }));
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar novamente' }));

    expect(readCartItems().items).toEqual([
      expect.objectContaining({ portionWeightInGrams: 100, observation: 'original' }),
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Usar nova inserção' }));

    const { plates, items } = readCartItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ portionWeightInGrams: 200, observation: 'nova' });
    expect(plates[0]).toMatchObject({ buffetSubtotal: 20, total: 20 });
    await waitFor(() => expect(localStorage.getItem('servtable-cart:5e125073-383c-4edc-827b-372cf2c68ab7')).toContain('"portionWeightInGrams":200'));
  });

  it('can dismiss the modal without changing the cart', () => {
    renderHarness();
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar primeiro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar novamente' }));

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(readItems()[0]).toMatchObject({ portionWeightInGrams: 100, observation: 'original' });
    expect(screen.queryByText('Este prato já está no seu pedido')).toBeNull();
  });
});
