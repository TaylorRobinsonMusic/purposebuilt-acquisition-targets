export interface Company {
  id: number;
  'Company name': string;
  Description: string;
  'MA_Overall_Fit_Score': number;
  'Revenue Estimate (MUSD)': number;
  'Estimated Profit Margin (%)': number;
  'Growth Fit Score': number;
  'Industry Fit Score': number;
  'AI_Disruption_Score': number;
  'AI-Opp_Score': number;
  'Employees Count (LinkedIn)': number;
  Founded: number | null;
  State_Province: string;
  City: string;
  'Business Type': string;
  'Ownership Type': string;
  'Headcount range (LinkedIn)': string;
  Website: string;
  'Linkedin Url': string;
  [key: string]: any;
}

export const loadAcquisitionData = async (): Promise<Company[]> => {
  try {
    const response = await fetch('/companies_final.json');
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    const dataJson = await response.json();
    
    const processedData = dataJson.map((row: any, index: number) => ({
      id: index + 1,
      ...row,
      'MA_Overall_Fit_Score': parseFloat(row['MA_Overall_Fit_Score']) || 0,
      'Revenue Estimate (MUSD)': parseFloat(row['Revenue Estimate (MUSD)']) || 0,
      'Estimated Profit Margin (%)': parseFloat(row['Estimated Profit Margin (%)']) || 0,
      'Growth Fit Score': parseFloat(row['Growth Fit Score']) || 0,
      'Industry Fit Score': parseFloat(row['Industry Fit Score']) || 0,
      'AI_Disruption_Score': parseFloat(row['AI_Disruption_Score']) || 0,
      'AI-Opp_Score': parseFloat(row['AI-Opp_Score']) || 0,
      'Employees Count (LinkedIn)': parseInt(row['Employees Count (LinkedIn)']) || 0,
      'Founded': parseInt(row['Founded']) || null,
    }));
    
    return processedData;
  } catch (error) {
    console.error('Error loading acquisition data:', error);
    throw error;
  }
};

export const exportToCSV = (data: Company[], filename = 'acquisition-targets.csv') => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

