import * as XLSX from 'xlsx';

export const exportCompleteRowData = (sheet: any) => {
  const workbook = XLSX.utils.book_new();
  
  // 1. Style Information Sheet
  const styleData = [
    ['Cost Sheet - Style Information'],
    [],
    ['Property', 'Value'],
    ['ID', sheet.id || ''],
    ['Style', sheet.style?.name || ''],
    ['Item', sheet.item || ''],
    ['Group', sheet.group || ''],
    ['Size', sheet.size || ''],
    ['Fabric Type', sheet.fabricType || ''],
    ['GSM', sheet.gsm || ''],
    ['Color', sheet.color || ''],
    ['Quantity', sheet.quantity || ''],
    ['Created By', sheet.createdBy?.userName || ''],
    ['Created At', sheet.createdAt ? new Date(sheet.createdAt).toLocaleDateString() : ''],
    ['Updated At', sheet.updatedAt ? new Date(sheet.updatedAt).toLocaleDateString() : '']
  ];
  
  const styleSheet = XLSX.utils.aoa_to_sheet(styleData);
  styleSheet['!cols'] = [{ wch: 25 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(workbook, styleSheet, 'Style Information');

  // 2. CAD Consumption Sheet
  if (sheet.cadRows?.rows && sheet.cadRows.rows.length > 0) {
    const cadData = [
      [sheet.cadRows.tableName || 'CAD Consumption / Dz'],
      [],
      // Use the actual column names from the data
      sheet.cadRows.columns || ['Field Name', 'Weight (kg / yard)', 'With %', 'Fabric Consumption']
    ];
    
    // Add data rows mapping to the correct column order
    sheet.cadRows.rows.forEach((row: any) => {
      cadData.push([
        row.fieldName || '',
        row.weight || '',
        row.percent || '',
        row.value || ''
      ]);
    });
    
    cadData.push([]);
    cadData.push(['Total Weight', sheet.cadRows.totalWeight || '', '', '']);
    cadData.push(['Total Value', '', '', sheet.cadRows.totalValue || '']);
    
    const cadSheet = XLSX.utils.aoa_to_sheet(cadData);
    cadSheet['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, cadSheet, 'CAD Consumption');
  }

  // 3. Fabric Cost - Yarn Sheet
  if (sheet.fabricRows?.yarnRows && sheet.fabricRows.yarnRows.length > 0) {
    const yarnData = [
      ['Yarn Price'],
      [],
      ['Field Name', 'Rate', 'Unit', 'Value']
    ];
    
    sheet.fabricRows.yarnRows.forEach((yarn: any) => {
      yarnData.push([
        yarn.fieldName || '',
        yarn.rate || '',
        yarn.unit || '',
        yarn.value || ''
      ]);
    });
    
    yarnData.push([]);
    yarnData.push(['Total', '', '', sheet.fabricRows.yarnTotal || '']);
    
    const yarnSheet = XLSX.utils.aoa_to_sheet(yarnData);
    yarnSheet['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, yarnSheet, 'Yarn Price');
  }

  // 4. Fabric Cost - Knitting Sheet
  if (sheet.fabricRows?.knittingRows && sheet.fabricRows.knittingRows.length > 0) {
    const knittingData = [
      ['Knitting'],
      [],
      ['Field Name', 'Rate', 'Unit', 'Value']
    ];
    
    sheet.fabricRows.knittingRows.forEach((knit: any) => {
      knittingData.push([
        knit.fieldName || '',
        knit.rate || '',
        knit.unit || '',
        knit.value || ''
      ]);
    });
    
    knittingData.push([]);
    knittingData.push(['Total', '', '', sheet.fabricRows.knittingTotal || '']);
    
    const knittingSheet = XLSX.utils.aoa_to_sheet(knittingData);
    knittingSheet['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, knittingSheet, 'Knitting');
  }

  // 5. Fabric Cost - Dyeing Sheet
  if (sheet.fabricRows?.dyeingRows && sheet.fabricRows.dyeingRows.length > 0) {
    const dyeingData = [
      ['Dyeing'],
      [],
      ['Field Name', 'Rate', 'Unit', 'Value']
    ];
    
    sheet.fabricRows.dyeingRows.forEach((dye: any) => {
      dyeingData.push([
        dye.fieldName || '',
        dye.rate || '',
        dye.unit || '',
        dye.value || ''
      ]);
    });
    
    dyeingData.push([]);
    dyeingData.push(['Total', '', '', sheet.fabricRows.dyeingTotal || '']);
    dyeingData.push([]);
    dyeingData.push(['Total Fabric Cost (USD / Dozen Garments)', '', '', sheet.fabricRows.totalFabricCost || '']);
    
    const dyeingSheet = XLSX.utils.aoa_to_sheet(dyeingData);
    dyeingSheet['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, dyeingSheet, 'Dyeing');
  }

  // 6. Trims & Accessories Sheet
  if (sheet.trimsRows?.rows && sheet.trimsRows.rows.length > 0) {
    const trimsData = [
      [sheet.trimsRows.tableName || 'Trims & Accessories'],
      [],
      // Use actual column names from data
      sheet.trimsRows.columns || ['Item Description', 'USD / Dozen']
    ];
    
    sheet.trimsRows.rows.forEach((trim: any) => {
      trimsData.push([
        trim.description || '',
        trim.cost || ''
      ]);
    });
    
    trimsData.push([]);
    trimsData.push(['Subtotal', sheet.trimsRows.subtotal || '']);
    trimsData.push([`Add Adjustment ${sheet.trimsRows.adjustmentPercent || 0}%`, sheet.trimsRows.adjustment || '']);
    trimsData.push(['Total Accessories Cost', sheet.trimsRows.totalAccessoriesCost || '']);
    
    const trimsSheet = XLSX.utils.aoa_to_sheet(trimsData);
    trimsSheet['!cols'] = [{ wch: 35 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, trimsSheet, 'Trims & Accessories');
  }

  // 7. Others Sheet
  if (sheet.othersRows?.rows && sheet.othersRows.rows.length > 0) {
    const othersData = [
      [sheet.othersRows.tableName || 'Others'],
      [],
      // Use actual column names from data
      sheet.othersRows.columns || ['Label', 'Value']
    ];
    
    sheet.othersRows.rows.forEach((other: any) => {
      othersData.push([
        other.label || '',
        other.value || ''
      ]);
    });
    
    othersData.push([]);
    othersData.push(['Total', sheet.othersRows.total || '']);
    
    const othersSheet = XLSX.utils.aoa_to_sheet(othersData);
    othersSheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, othersSheet, 'Others');
  }

  // 8. Summary Sheet
  if (sheet.summaryRows && Object.keys(sheet.summaryRows).length > 0) {
    const summaryData = [
      ['Summary'],
      [],
      ['Description', 'Amount ($)']
    ];
    
    // Add summary items based on available data
    if (sheet.summaryRows.fabricCost !== undefined) {
      summaryData.push(['Fabric Cost / Dzn Garments', sheet.summaryRows.fabricCost || '']);
    }
    if (sheet.summaryRows.accessoriesCost !== undefined) {
      summaryData.push(['Accessories Cost / Dzn Garments', sheet.summaryRows.accessoriesCost || '']);
    }
    if (sheet.summaryRows.factoryCM !== undefined) {
      summaryData.push(['Factory CM / Dzn Garments', sheet.summaryRows.factoryCM || '']);
    }
    if (sheet.summaryRows.totalCost !== undefined) {
      summaryData.push(['Total Cost', sheet.summaryRows.totalCost || '']);
    }
    if (sheet.summaryRows.commercialProfit !== undefined) {
      summaryData.push([`Commercial & Profit Cost (${sheet.summaryRows.profitPercent || 15}%)`, sheet.summaryRows.commercialProfit || '']);
    }
    if (sheet.summaryRows.fobPrice !== undefined) {
      summaryData.push(['FOB Price / Dzn', sheet.summaryRows.fobPrice || '']);
    }
    if (sheet.summaryRows.pricePerPiece !== undefined) {
      summaryData.push(['Price / Pc Garments', sheet.summaryRows.pricePerPiece || '']);
    }
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 35 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `CostSheet_${sheet.style?.name || sheet.id}_${timestamp}.xlsx`;
  
  XLSX.writeFile(workbook, filename);
};

export const exportMultipleSheets = (sheet: any) => {
  // This function now does the same as exportCompleteRowData since we're creating multiple sheets
  exportCompleteRowData(sheet);
};
     