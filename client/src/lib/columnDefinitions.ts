export interface ColumnDefinition {
  id: string;
  label: string;
  accessor: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
  category?: string;
}

export const defaultColumns: ColumnDefinition[] = [
  // Core
  { id: 'myRating', label: 'My Rating', accessor: 'userRating', visible: true, sortable: true, category: 'Core' },
  { id: 'overallScore', label: 'Overall Score', accessor: 'MA_Overall_Fit_Score', visible: true, sortable: true, category: 'Core' },
  { id: 'company', label: 'Company', accessor: 'Company name', visible: true, sortable: true, category: 'Core' },
  { id: 'description', label: 'Business Description', accessor: 'Description', visible: true, sortable: false, category: 'Core' },
  
  // Fit Scores
  { id: 'revenueFit', label: 'Revenue Fit Score', accessor: 'Revenue Fit Score', visible: true, sortable: true, category: 'Fit Scores' },
  { id: 'profitFit', label: 'Profit Fit Score', accessor: 'Profit Fit Score', visible: true, sortable: true, category: 'Fit Scores' },
  { id: 'locationFit', label: 'Location Fit Score', accessor: 'Location Fit Score', visible: false, sortable: true, category: 'Fit Scores' },
  { id: 'growthFit', label: 'Growth Fit Score', accessor: 'Growth Fit Score', visible: true, sortable: true, category: 'Fit Scores' },
  { id: 'industryFit', label: 'Industry Fit Score', accessor: 'Industry Fit Score', visible: true, sortable: true, category: 'Fit Scores' },
  
  // Financial
  { id: 'revenue', label: 'Revenue', accessor: 'Revenue Estimate (MUSD)', visible: true, sortable: true, category: 'Financial' },
  { id: 'profitMargin', label: 'Profit Margin', accessor: 'Estimated Profit Margin (%)', visible: true, sortable: true, category: 'Financial' },
  { id: 'revenueConfidence', label: 'Revenue Confidence', accessor: 'Confidence Score', visible: false, sortable: true, category: 'Financial' },
  
  // AI Scores
  { id: 'aiRisk', label: 'AI Risk', accessor: 'AI_Disruption_Score', visible: true, sortable: true, category: 'AI' },
  { id: 'aiOpp', label: 'AI Opp', accessor: 'AI-Opp_Score', visible: true, sortable: true, category: 'AI' },
  
  // Company Info
  { id: 'businessType', label: 'Business Type', accessor: 'Business Type', visible: true, sortable: true, category: 'Company Info' },
  { id: 'industry', label: 'Industry', accessor: 'MA_Industry_Analysis', visible: false, sortable: true, category: 'Company Info' },
  { id: 'employees', label: 'Employees', accessor: 'Employees Count (LinkedIn)', visible: true, sortable: true, category: 'Company Info' },
  { id: 'founded', label: 'Founded', accessor: 'Founded', visible: false, sortable: true, category: 'Company Info' },
  { id: 'ownership', label: 'Ownership Type', accessor: 'Ownership Type', visible: false, sortable: true, category: 'Company Info' },
  
  // Location
  { id: 'state', label: 'State', accessor: 'State_Province', visible: true, sortable: true, category: 'Location' },
  { id: 'city', label: 'City', accessor: 'City', visible: false, sortable: true, category: 'Location' },
  { id: 'region', label: 'Region', accessor: 'Region', visible: false, sortable: true, category: 'Location' },
  
  // Growth Metrics
  { id: 'headcountGrowth3m', label: 'Headcount Growth (3M)', accessor: 'Headcount Growth (3 Months)', visible: false, sortable: true, category: 'Growth' },
  { id: 'headcountGrowth6m', label: 'Headcount Growth (6M)', accessor: 'Headcount Growth (6 Months)', visible: false, sortable: true, category: 'Growth' },
  { id: 'headcountGrowth12m', label: 'Headcount Growth (12M)', accessor: 'Headcount Growth (12 Months)', visible: false, sortable: true, category: 'Growth' },
  { id: 'trafficGrowth3m', label: 'Traffic Growth (3M)', accessor: 'Traffic Growth (3 Months)', visible: false, sortable: true, category: 'Growth' },
  
  // Links
  { id: 'website', label: 'Website', accessor: 'Website', visible: false, sortable: false, category: 'Links' },
  { id: 'linkedin', label: 'LinkedIn', accessor: 'Linkedin Url', visible: false, sortable: false, category: 'Links' },
];

export const getVisibleColumns = (columns: ColumnDefinition[]) => {
  return columns.filter(col => col.visible);
};

export const getColumnsByCategory = (columns: ColumnDefinition[]) => {
  const categories: Record<string, ColumnDefinition[]> = {};
  columns.forEach(col => {
    const category = col.category || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(col);
  });
  return categories;
};

