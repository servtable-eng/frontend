import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CadastroPratoForm } from './CadastroPratoForm';

vi.mock('@/services/dishes/dish.service', () => ({
  createDish: vi.fn(),
  getDish: vi.fn(),
  updateDish: vi.fn(),
}));

afterEach(cleanup);

const thresholdError = 'O alerta de estoque baixo deve ser menor que a quantidade disponível.';
const helperText = 'Quando o estoque chegar nesse valor, o prato será destacado como baixo.';

function renderForm() {
  render(
    <MemoryRouter>
      <CadastroPratoForm />
    </MemoryRouter>,
  );

  fireEvent.change(screen.getByPlaceholderText('Ex: Frango Grelhado'), { target: { value: 'Prato' } });
  fireEvent.change(screen.getByDisplayValue('Selecione uma categoria'), { target: { value: 'PRATO_PRINCIPAL' } });
  fireEvent.change(screen.getByPlaceholderText('R$ 0,00'), { target: { value: '25' } });
  fireEvent.change(screen.getByPlaceholderText('Ex: 1500'), { target: { value: '1000' } });
}

function setThreshold(value: string) {
  fireEvent.change(screen.getByPlaceholderText('Ex: 750'), { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar prato' }));
}

describe('CadastroPratoForm', () => {
  it.each(['1000', '1001'])(
    'shows the low-stock comparison error once for invalid value %s',
    value => {
      renderForm();

      setThreshold(value);

      expect(screen.getAllByText(thresholdError)).toHaveLength(1);
      expect(screen.getByText(helperText)).toBeTruthy();
      const input = screen.getByPlaceholderText('Ex: 750');
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(input.getAttribute('aria-describedby')).toBe('low-stock-threshold-error');
    },
  );

  it('removes the comparison error for a threshold below available stock', () => {
    renderForm();
    setThreshold('1000');

    fireEvent.change(screen.getByPlaceholderText('Ex: 750'), { target: { value: '999' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar prato' }));

    expect(screen.queryByText(thresholdError)).toBeNull();
    expect(screen.getByText(helperText)).toBeTruthy();
  });

  it('shows the required empty-field error only once', () => {
    renderForm();

    setThreshold('');

    expect(screen.getAllByText('Informe uma quantidade disponível maior que zero.')).toHaveLength(1);
  });

  it('keeps actions after flexible content without fixed or absolute positioning', () => {
    renderForm();

    const page = screen.getByTestId('dish-form-page');
    const content = screen.getByTestId('dish-form-content');
    const actions = screen.getByTestId('dish-form-actions');

    expect(page.style.minHeight).toBe('100%');
    expect(page.style.display).toBe('flex');
    expect(content.style.flex).toBe('1 1 0%');
    expect(actions.previousElementSibling).toBe(content);
    expect(actions.style.marginTop).toBe('auto');
    expect(actions.style.position).toBe('');
    expect(actions.style.flexWrap).toBe('wrap');
  });
});
