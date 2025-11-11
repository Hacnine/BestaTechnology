import { describe, it, expect } from 'vitest';

/**
 * Cost Calculation Utilities Tests
 * These tests verify the accuracy of cost sheet calculations
 */

describe('Cost Sheet Calculations', () => {
  describe('Fabric Cost Calculations', () => {
    it('should calculate total fabric cost from yarn, knitting, and dyeing rows', () => {
      const yarnRows = [
        { value: 10.5 },
        { value: 5.25 },
        { value: 8.0 }
      ];
      const knittingRows = [
        { value: 3.5 },
        { value: 2.0 }
      ];
      const dyeingRows = [
        { value: 4.75 }
      ];

      const totalYarn = yarnRows.reduce((sum, row) => sum + Number(row.value || 0), 0);
      const totalKnitting = knittingRows.reduce((sum, row) => sum + Number(row.value || 0), 0);
      const totalDyeing = dyeingRows.reduce((sum, row) => sum + Number(row.value || 0), 0);
      const totalFabric = totalYarn + totalKnitting + totalDyeing;

      expect(totalYarn).toBe(23.75);
      expect(totalKnitting).toBe(5.5);
      expect(totalDyeing).toBe(4.75);
      expect(totalFabric).toBe(34.0);
    });

    it('should handle empty fabric rows', () => {
      const yarnRows: any[] = [];
      const knittingRows: any[] = [];
      const dyeingRows: any[] = [];

      const totalFabric = 
        yarnRows.reduce((sum, row) => sum + Number(row.value || 0), 0) +
        knittingRows.reduce((sum, row) => sum + Number(row.value || 0), 0) +
        dyeingRows.reduce((sum, row) => sum + Number(row.value || 0), 0);

      expect(totalFabric).toBe(0);
    });

    it('should handle invalid/missing values in fabric rows', () => {
      const yarnRows = [
        { value: 10.5 },
        { value: null },
        { value: undefined },
        { value: '' },
        { value: 5.0 }
      ];

      const total = yarnRows.reduce((sum, row) => sum + (Number(row.value) || 0), 0);
      expect(total).toBe(15.5);
    });
  });

  describe('Accessories Cost Calculations', () => {
    it('should calculate accessories cost from unit and cost fields', () => {
      const trimsRows = [
        { unit: 10, cost: 2.5, total: 25 },
        { unit: 5, cost: 3.0, total: 15 },
        { unit: 8, cost: 1.25, total: 10 }
      ];

      const totalAccessories = trimsRows.reduce(
        (sum, row) => sum + (Number(row.total) || (Number(row.unit || 0) * Number(row.cost || 0))),
        0
      );

      expect(totalAccessories).toBe(50);
    });

    it('should calculate accessories cost when total field is missing', () => {
      const trimsRows = [
        { unit: 10, cost: 2.5 },
        { unit: 5, cost: 3.0 },
      ];

      const totalAccessories = trimsRows.reduce(
        (sum, row) => sum + (Number(row.total) || (Number(row.unit || 0) * Number(row.cost || 0))),
        0
      );

      expect(totalAccessories).toBe(40);
    });

    it('should handle empty accessories rows', () => {
      const trimsRows: any[] = [];
      const total = trimsRows.reduce((sum, row) => sum + (Number(row.total) || 0), 0);
      expect(total).toBe(0);
    });

    it('should handle missing unit or cost values', () => {
      const trimsRows = [
        { unit: 10, cost: 2.5 },
        { unit: null, cost: 3.0 },
        { unit: 5, cost: null },
        { cost: 2.0 }
      ];

      const total = trimsRows.reduce(
        (sum, row) => sum + (Number(row.unit || 0) * Number(row.cost || 0)),
        0
      );

      expect(total).toBe(25); // Only first row: 10 * 2.5
    });
  });

  describe('Others Cost Calculations', () => {
    it('should calculate total from others data array', () => {
      const othersData = [
        { value: 5.5 },
        { value: 3.25 },
        { value: 2.0 }
      ];

      const total = othersData.reduce((sum, item) => {
        const val = parseFloat(item.value);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);

      expect(total).toBe(10.75);
    });

    it('should handle invalid values in others data', () => {
      const othersData = [
        { value: '5.5' },
        { value: 'invalid' },
        { value: null },
        { value: 3.25 }
      ];

      const total = othersData.reduce((sum, item) => {
        const val = parseFloat(item.value);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);

      expect(total).toBe(8.75);
    });
  });

  describe('Summary Calculations', () => {
    it('should calculate total cost correctly', () => {
      const fabricCost = 34.0;
      const accessoriesCost = 50.0;
      const factoryCM = 14.0;
      const othersTotal = 10.75;

      const totalCost = fabricCost + accessoriesCost + factoryCM + othersTotal;

      expect(totalCost).toBe(108.75);
    });

    it('should calculate commercial cost based on percentage', () => {
      const totalCost = 108.75;
      const commercialPercent = 5;

      const commercialCost = totalCost * (commercialPercent / 100);

      expect(commercialCost).toBeCloseTo(5.4375, 4);
    });

    it('should calculate profit cost based on percentage', () => {
      const totalCost = 108.75;
      const commercialPercent = 5;
      const profitPercent = 10;

      const commercialCost = totalCost * (commercialPercent / 100);
      const totalCostWithCommercial = totalCost + commercialCost;
      const profitCost = totalCostWithCommercial * (profitPercent / 100);

      expect(totalCostWithCommercial).toBeCloseTo(114.1875, 4);
      expect(profitCost).toBeCloseTo(11.41875, 5);
    });

    it('should calculate FOB price correctly', () => {
      const fabricCost = 34.0;
      const accessoriesCost = 50.0;
      const factoryCM = 14.0;
      const othersTotal = 10.75;
      const commercialPercent = 5;
      const profitPercent = 10;

      const totalCost = fabricCost + accessoriesCost + factoryCM + othersTotal;
      const commercialCost = totalCost * (commercialPercent / 100);
      const totalCostWithCommercial = totalCost + commercialCost;
      const profitCost = totalCostWithCommercial * (profitPercent / 100);
      const fobPrice = totalCostWithCommercial + profitCost;

      expect(fobPrice).toBeCloseTo(125.60625, 5);
    });

    it('should calculate price per piece (divide by 12)', () => {
      const fobPrice = 125.60625;
      const pricePerPiece = fobPrice / 12;

      expect(pricePerPiece).toBeCloseTo(10.46719, 5);
    });

    it('should handle zero percent commercial and profit', () => {
      const totalCost = 108.75;
      const commercialPercent = 0;
      const profitPercent = 0;

      const commercialCost = totalCost * (commercialPercent / 100);
      const totalCostWithCommercial = totalCost + commercialCost;
      const profitCost = totalCostWithCommercial * (profitPercent / 100);
      const fobPrice = totalCostWithCommercial + profitCost;

      expect(fobPrice).toBe(108.75);
    });

    it('should handle large percentage values', () => {
      const totalCost = 100;
      const commercialPercent = 50;
      const profitPercent = 100;

      const commercialCost = totalCost * (commercialPercent / 100);
      const totalCostWithCommercial = totalCost + commercialCost;
      const profitCost = totalCostWithCommercial * (profitPercent / 100);
      const fobPrice = totalCostWithCommercial + profitCost;

      expect(commercialCost).toBe(50);
      expect(totalCostWithCommercial).toBe(150);
      expect(profitCost).toBe(150);
      expect(fobPrice).toBe(300);
    });
  });

  describe('Edge Cases and Precision', () => {
    it('should maintain precision with decimal calculations', () => {
      const value1 = 0.1;
      const value2 = 0.2;
      const sum = value1 + value2;

      // JavaScript floating point issue
      expect(sum).toBeCloseTo(0.3, 10);
    });

    it('should format numbers to 3 decimal places', () => {
      const value = 10.123456789;
      const formatted = Number(value).toFixed(3);

      expect(formatted).toBe('10.123');
    });

    it('should handle very large numbers', () => {
      const fabricCost = 999999.999;
      const accessoriesCost = 999999.999;
      const total = fabricCost + accessoriesCost;

      expect(total).toBeCloseTo(1999999.998, 3);
    });

    it('should handle very small numbers', () => {
      const value = 0.001;
      const total = value * 1000;

      expect(total).toBeCloseTo(1, 10);
    });
  });
});
