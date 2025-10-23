import { Company } from './dataLoader';
import { GroupByOption } from '@/components/GroupingSelector';

export interface GroupedCompanies {
  groupName: string;
  companies: Company[];
}

export function groupCompanies(companies: Company[], groupBy: GroupByOption): GroupedCompanies[] {
  if (groupBy === 'none') {
    return [{ groupName: 'All Companies', companies }];
  }

  const groups: Record<string, Company[]> = {};

  companies.forEach((company) => {
    let groupKey: string;

    switch (groupBy) {
      case 'overallScore':
        const score = company['MA_Overall_Fit_Score'] || 0;
        if (score >= 9) groupKey = '9.0 - 10.0 (Excellent)';
        else if (score >= 8) groupKey = '8.0 - 8.9 (Very Good)';
        else if (score >= 7) groupKey = '7.0 - 7.9 (Good)';
        else if (score >= 6) groupKey = '6.0 - 6.9 (Fair)';
        else groupKey = 'Below 6.0';
        break;

      case 'profitScore':
        const profitScore = company['Profit Fit Score'] || 0;
        if (profitScore >= 9) groupKey = '9.0 - 10.0 (Excellent)';
        else if (profitScore >= 8) groupKey = '8.0 - 8.9 (Very Good)';
        else if (profitScore >= 7) groupKey = '7.0 - 7.9 (Good)';
        else if (profitScore >= 6) groupKey = '6.0 - 6.9 (Fair)';
        else groupKey = 'Below 6.0';
        break;

      case 'businessType':
        groupKey = company['Business Type'] || 'Unknown';
        break;

      case 'state':
        groupKey = company.State_Province || 'Unknown';
        break;

      case 'ownershipType':
        groupKey = company['Ownership Type'] || 'Unknown';
        break;

      case 'revenueRange':
        const revenue = company['Revenue Estimate (MUSD)'] || 0;
        if (revenue >= 100) groupKey = '$100M+ (Large)';
        else if (revenue >= 50) groupKey = '$50M - $100M (Medium-Large)';
        else if (revenue >= 20) groupKey = '$20M - $50M (Medium)';
        else if (revenue >= 10) groupKey = '$10M - $20M (Small-Medium)';
        else groupKey = 'Under $10M (Small)';
        break;

      default:
        groupKey = 'Other';
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(company);
  });

  // Convert to array and sort groups
  const groupedArray = Object.entries(groups).map(([groupName, companies]) => ({
    groupName,
    companies,
  }));

  // Sort groups by company count (descending)
  groupedArray.sort((a, b) => b.companies.length - a.companies.length);

  return groupedArray;
}

