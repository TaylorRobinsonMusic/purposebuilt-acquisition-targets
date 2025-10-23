import { Company } from './dataLoader';

export interface Filters {
  states?: string[];
  cities?: string[];
  businessTypes?: string[];
  ownershipTypes?: string[];
  overallScore?: [number, number];
  revenueRange?: [number, number];
  profitMargin?: [number, number];
  searchTerm?: string;
}

export const filterCompanies = (companies: Company[], filters: Filters): Company[] => {
  return companies.filter(company => {
    // Search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        company['Company name']?.toLowerCase().includes(searchLower) ||
        company.Description?.toLowerCase().includes(searchLower) ||
        company.City?.toLowerCase().includes(searchLower) ||
        company.State_Province?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // States
    if (filters.states?.length && !filters.states.includes(company.State_Province)) {
      return false;
    }

    // Cities
    if (filters.cities?.length && !filters.cities.includes(company.City)) {
      return false;
    }

    // Business Types
    if (filters.businessTypes?.length && !filters.businessTypes.includes(company['Business Type'])) {
      return false;
    }

    // Ownership Types
    if (filters.ownershipTypes?.length && !filters.ownershipTypes.includes(company['Ownership Type'])) {
      return false;
    }

    // Overall Score
    if (filters.overallScore) {
      const score = company['MA_Overall_Fit_Score'] || 0;
      if (score < filters.overallScore[0] || score > filters.overallScore[1]) {
        return false;
      }
    }

    // Revenue Range
    if (filters.revenueRange) {
      const revenue = company['Revenue Estimate (MUSD)'] || 0;
      if (revenue < filters.revenueRange[0] || revenue > filters.revenueRange[1]) {
        return false;
      }
    }

    // Profit Margin
    if (filters.profitMargin) {
      const profit = company['Estimated Profit Margin (%)'] || 0;
      if (profit < filters.profitMargin[0] || profit > filters.profitMargin[1]) {
        return false;
      }
    }

    return true;
  });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value * 1000000);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatScore = (value: number): string => {
  return value.toFixed(1);
};

export const getScoreColor = (score: number): string => {
  if (score >= 9.0) return 'text-green-500';
  if (score >= 8.0) return 'text-blue-500';
  if (score >= 7.0) return 'text-yellow-500';
  return 'text-gray-500';
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 9.0) return 'bg-green-500/10 border-green-500/20';
  if (score >= 8.0) return 'bg-blue-500/10 border-blue-500/20';
  if (score >= 7.0) return 'bg-yellow-500/10 border-yellow-500/20';
  return 'bg-gray-500/10 border-gray-500/20';
};

