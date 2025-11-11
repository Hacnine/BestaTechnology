import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SummarySectionCreate from '@/components/cost-sheet/SummarySectionCreate';

describe('SummarySection Component', () => {
  const mockFabricData = {
    totalFabricCost: 34.0,
    yarnRows: [{ value: 10 }, { value: 15 }, { value: 9 }],
    knittingRows: [{ value: 0 }],
    dyeingRows: [{ value: 0 }]
  };

  const mockTrimsData = {
    rows: [
      { unit: 10, cost: 2.5, total: 25 },
      { unit: 5, cost: 3.0, total: 15 }
    ]
  };

  const mockOthersData = [
    { value: 5.5 },
    { value: 3.25 }
  ];

  describe('Rendering', () => {
    it('should render summary section with all fields', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
        />
      );

      expect(screen.getByText('Summary')).toBeInTheDocument();
      expect(screen.getByLabelText(/Factory CM/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Commercial %/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Profit %/i)).toBeInTheDocument();
    });

    it('should display fabric cost correctly', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
        />
      );

      expect(screen.getByText('$34.000')).toBeInTheDocument();
    });

    it('should display accessories cost correctly', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
        />
      );

      // Accessories total: 25 + 15 = 40
      expect(screen.getByText('$40.000')).toBeInTheDocument();
    });

    it('should display default factory CM value', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
        />
      );

      const factoryCMInput = screen.getByLabelText(/Factory CM/i) as HTMLInputElement;
      expect(factoryCMInput.value).toBe('14');
    });
  });

  describe('Calculations', () => {
    it('should calculate total cost correctly', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
        />
      );

      // Total = Fabric(34) + Accessories(40) + FactoryCM(14) + Others(8.75) = 96.75
      // Commercial = 96.75 * 0.05 = 4.8375
      // Total with commercial = 96.75 + 4.8375 = 101.5875
      expect(screen.getByText(/Total Cost \(with Commercial\)/i)).toBeInTheDocument();
      const totalCostElements = screen.getAllByText('$101.588');
      expect(totalCostElements.length).toBeGreaterThan(0);
    });

    it('should calculate FOB price correctly', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
        />
      );

      // Total with commercial = 101.5875
      // Profit = 101.5875 * 0% = 0
      // FOB = 101.5875 + 0 = 101.5875
      const fobLabel = screen.getByText(/FOB Price \/ Dzn/i);
      expect(fobLabel).toBeInTheDocument();
      
      // FOB and Total with Commercial have same value when profit is 0%
      const values = screen.getAllByText('$101.588');
      expect(values.length).toBeGreaterThan(0);
    });

    it('should calculate price per piece correctly', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
        />
      );

      // Price per piece = FOB(101.5875) / 12 = 8.465625
      expect(screen.getByText(/Price \/ Pc Garments/i)).toBeInTheDocument();
      expect(screen.getByText('$8.466')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update calculations when factory CM changes', () => {
      const mockOnChange = vi.fn();
      
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
          onChange={mockOnChange}
        />
      );

      const factoryCMInput = screen.getByLabelText(/Factory CM/i) as HTMLInputElement;
      fireEvent.change(factoryCMInput, { target: { value: '20' } });

      expect(mockOnChange).toHaveBeenCalled();
      expect(factoryCMInput.value).toBe('20');
    });

    it('should update calculations when profit percent changes', () => {
      const mockOnChange = vi.fn();
      
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
          onChange={mockOnChange}
        />
      );

      const profitInput = screen.getByLabelText(/Profit %/i) as HTMLInputElement;
      fireEvent.change(profitInput, { target: { value: '15' } });

      expect(mockOnChange).toHaveBeenCalled();
      expect(profitInput.value).toBe('15');
    });

    it('should update calculations when commercial percent changes', () => {
      const mockOnChange = vi.fn();
      
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
          onChange={mockOnChange}
        />
      );

      const commercialInput = screen.getByLabelText(/Commercial %/i) as HTMLInputElement;
      fireEvent.change(commercialInput, { target: { value: '10' } });

      expect(mockOnChange).toHaveBeenCalled();
      expect(commercialInput.value).toBe('10');
    });

    it('should call onChange with correct summary data', () => {
      const mockOnChange = vi.fn();
      
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
          onChange={mockOnChange}
        />
      );

      const factoryCMInput = screen.getByLabelText(/Factory CM/i);
      fireEvent.change(factoryCMInput, { target: { value: '20' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: expect.objectContaining({
            factoryCM: 20,
            commercialPercent: 5,
            profitPercent: 0,
            pricePerPiece: expect.any(String)
          }),
          json: expect.objectContaining({
            tableName: 'Summary',
            factoryCM: 20,
            commercialPercent: 5,
            profitPercent: 0,
            pricePerPiece: expect.any(String)
          })
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing fabric data', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={{}}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
        />
      );

      expect(screen.getByText('Summary')).toBeInTheDocument();
    });

    it('should handle empty trims data', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={{ rows: [] }}
          othersData={mockOthersData}
        />
      );

      // Check that Accessories Cost shows $0.000
      expect(screen.getByText(/Accessories Cost \/ Dzn Garments/i)).toBeInTheDocument();
      const accessoriesCostSection = screen.getByText(/Accessories Cost \/ Dzn Garments/i).closest('div');
      expect(accessoriesCostSection).toHaveTextContent('$0.000');
    });

    it('should handle empty others data', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={[]}
        />
      );

      expect(screen.getByText('Summary')).toBeInTheDocument();
    });

    it('should handle invalid input values', () => {
      render(
        <SummarySectionCreate
          summary={{}}
          fabricData={mockFabricData}
          trimsData={mockTrimsData}
          othersData={mockOthersData}
        />
      );

      const factoryCMInput = screen.getByLabelText(/Factory CM/i) as HTMLInputElement;
      fireEvent.change(factoryCMInput, { target: { value: 'invalid' } });

      // Should default to 0
      expect(factoryCMInput.value).toBe('0');
    });
  });
});
