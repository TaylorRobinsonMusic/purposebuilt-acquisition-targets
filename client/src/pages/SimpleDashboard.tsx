import { useEffect, useState } from 'react';
import { Company, exportToCSV, loadAcquisitionData } from '@/lib/dataLoader';
import { filterCompanies, Filters, formatPercentage, formatScore } from '@/lib/filterUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Target, TrendingUp, Building2, DollarSign } from 'lucide-react';
import InlineRating from '@/components/InlineRating';
import { defaultColumns, getVisibleColumns } from '@/lib/columnDefinitions';

export default function SimpleDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const columns = getVisibleColumns(defaultColumns);

  useEffect(() => {
    loadAcquisitionData()
      .then(data => {
        setCompanies(data);
        setFilteredCompanies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filters: Filters = { searchTerm };
    let filtered = filterCompanies(companies, filters);
    
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key as keyof Company];
        const bVal = b[sortConfig.key as keyof Company];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (sortConfig.direction === 'asc') {
          return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        } else {
          return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
        }
      });
    }
    
    setFilteredCompanies(filtered);
  }, [companies, searchTerm, sortConfig]);

  const handleSort = (accessor: string) => {
    setSortConfig(current => {
      if (!current || current.key !== accessor) {
        return { key: accessor, direction: 'desc' };
      }
      if (current.direction === 'desc') {
        return { key: accessor, direction: 'asc' };
      }
      return null;
    });
  };

  const stats = {
    total: filteredCompanies.length,
    avgScore: filteredCompanies.length > 0
      ? filteredCompanies.reduce((sum, c) => sum + (c['MA_Overall_Fit_Score'] || 0), 0) / filteredCompanies.length
      : 0,
    avgRevenue: filteredCompanies.length > 0
      ? filteredCompanies.reduce((sum, c) => sum + (c['Revenue Estimate (MUSD)'] || 0), 0) / filteredCompanies.length
      : 0,
    avgProfit: filteredCompanies.length > 0
      ? filteredCompanies.reduce((sum, c) => sum + (c['Estimated Profit Margin (%)'] || 0), 0) / filteredCompanies.length
      : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading acquisition targets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Acquisition Targets</h1>
                <p className="text-sm text-muted-foreground">Purpose Built Database</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live Data
              </Badge>
              <span className="text-sm text-muted-foreground">{companies.length} Companies</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Companies</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Overall Score</p>
                  <p className="text-3xl font-bold">{formatScore(stats.avgScore)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Revenue</p>
                  <p className="text-3xl font-bold">${stats.avgRevenue.toFixed(1)}M</p>
                </div>
                <DollarSign className="h-8 w-8 text-amber-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Profit Margin</p>
                  <p className="text-3xl font-bold">{formatPercentage(stats.avgProfit)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => exportToCSV(filteredCompanies)} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.id}
                        className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/70 whitespace-nowrap"
                        onClick={() => col.sortable && handleSort(col.accessor)}
                      >
                        <div className="flex items-center gap-2">
                          {col.label}
                          {sortConfig?.key === col.accessor && (
                            <span className="text-xs">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-sm font-medium whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCompanies.map((company, idx) => (
                    <tr key={company.id || idx} className="hover:bg-muted/50 transition-colors">
                      {columns.map((col) => (
                        <td key={col.id} className="px-4 py-3 text-sm">
                          {col.id === 'myRating' ? (
                            <InlineRating company={company} />
                          ) : col.id === 'overallScore' ? (
                            <Badge 
                              className={
                                (company['MA_Overall_Fit_Score'] || 0) >= 9 
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                  : (company['MA_Overall_Fit_Score'] || 0) >= 8
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }
                            >
                              {formatScore(company['MA_Overall_Fit_Score'] || 0)}
                            </Badge>
                          ) : col.id === 'company' ? (
                            <div>
                              <div className="font-medium text-foreground">{company['Company name']}</div>
                              <div className="text-xs text-muted-foreground">{company['Business Type']}</div>
                            </div>
                          ) : col.id === 'description' ? (
                            <div className="max-w-md line-clamp-2 text-xs text-muted-foreground">
                              {company.Description?.substring(0, 150)}...
                            </div>
                          ) : col.id === 'revenue' ? (
                            <span className="font-medium">${(company['Revenue Estimate (MUSD)'] || 0).toFixed(1)}M</span>
                          ) : col.id === 'profitMargin' ? (
                            <span className="font-medium">{formatPercentage(company['Estimated Profit Margin (%)'] || 0)}</span>
                          ) : col.id === 'aiRisk' || col.id === 'aiOpp' ? (
                            <Badge variant="outline" className="font-mono">
                              {formatScore(company[col.accessor as keyof Company] as number || 0)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">
                              {String(company[col.accessor as keyof Company] || '-')}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing {filteredCompanies.length} of {companies.length} companies
          <span className="mx-2">•</span>
          Showing {columns.length} of {defaultColumns.length} columns
        </div>
      </div>
    </div>
  );
}

