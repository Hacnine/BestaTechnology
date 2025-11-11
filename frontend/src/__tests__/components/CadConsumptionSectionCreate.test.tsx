import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CadConsumptionSectionCreate from '@/components/cost-sheet/CadConsumptionSectionCreate';

describe('CadConsumptionSectionCreate Component', () => {
    
  // it('renders default rows and totals', () => {
  //   render(<CadConsumptionSectionCreate data={{}} />);

  //   // Title and headers
  //   expect(screen.getByText(/CAD Consumption \/ Dz/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Field Name/i)).toBeInTheDocument();
  //   expect(screen.getByText(/Weight/i)).toBeInTheDocument();

  //   // Default fields (from component defaultFields)
  //   expect(screen.getByDisplayValue('Body')).toBeInTheDocument();
  //   expect(screen.getByDisplayValue('Rib')).toBeInTheDocument();

  //   // Totals row shows zeros (use testids)
  //   expect(screen.getByTestId('cad-total-weight').textContent?.trim()).toBe('0.000');
  //   expect(screen.getByTestId('cad-total-value').textContent?.trim()).toBe('0.000');
  // });

  it('updates row calculation and totals when weight and percent change', async () => {
    const user = userEvent.setup();
    render(<CadConsumptionSectionCreate data={{}} />);

    // weight and percent inputs use placeholder "0.000"; inputs are ordered per row: weight, percent
    const inputs = screen.getAllByPlaceholderText('0.000');
    const firstWeight = inputs[0];
    const firstPercent = inputs[1];

    // Type weight=10 and percent=10 -> value = 10 + 10*10/100 = 11
    await user.clear(firstWeight);
    await user.type(firstWeight, '10');
    await user.clear(firstPercent);
    await user.type(firstPercent, '10');

    // The computed value cell is in the same row
    const row = firstWeight.closest('tr') as HTMLTableRowElement;
    const { getByText } = within(row);
    expect(getByText('11.000')).toBeInTheDocument();

  // Footer totals should reflect weight=10 and totalValue=11 (use testids)
  expect(screen.getByTestId('cad-total-weight')).toHaveTextContent('10.000');
  expect(screen.getByTestId('cad-total-value')).toHaveTextContent('11.000');
  });

  it('adds a new row when clicking Add Field', async () => {
    const user = userEvent.setup();
    render(<CadConsumptionSectionCreate data={{}} />);

    const addBtn = screen.getByRole('button', { name: /Add Field/i });
    await user.click(addBtn);

    // New row has default fieldName "New Field"
    expect(screen.getByDisplayValue('New Field')).toBeInTheDocument();
  });

  it('calls onChange when rows change', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<CadConsumptionSectionCreate data={{}} onChange={mockOnChange} />);

    const inputs = screen.getAllByPlaceholderText('0.000');
    const firstWeight = inputs[0];

    await user.clear(firstWeight);
    await user.type(firstWeight, '5');

    // onChange should have been called (component not debounced)
    expect(mockOnChange).toHaveBeenCalled();
    // The payload should include json with tableName
    const calledWith = mockOnChange.mock.calls[0][0];
    expect(calledWith).toHaveProperty('json');
    expect(calledWith.json).toHaveProperty('tableName', 'CAD Consumption / Dz');
  });
});
