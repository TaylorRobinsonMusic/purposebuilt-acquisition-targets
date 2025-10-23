import { useEffect, useState } from 'react';
import { Company, exportToCSV, loadAcquisitionData } from '@/lib/dataLoader';
import { filterCompanies, Filters, formatPercentage, formatScore, getScoreColor } from '@/lib/filterUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Filter, TrendingUp, Building2, DollarSign, Target, LayoutGrid, Table as TableIcon, Map } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InlineRating from '@/components/InlineRating';
import ColumnVisibilityControl from '@/components/ColumnVisibilityControl';
import { defaultColumns, ColumnDefinition, getVisibleColumns } from '@/lib/columnDefinitions';
import { getUserRating } from '@/lib/userRatings';

type ViewMode = 'table' | 'cards' | 'map';
type GroupBy = 'none' | 'overallScore' | 'profitScore' | 'businessType' | 'state' | 'ownershipType' | 'revenueRange';

export default function EnhancedDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ searchTerm: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [columns, setColumns] = useState<ColumnDefinition[]>(defaultColumns);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    loadAcquisitionData()
      .then(data => {
        setCompanies(data);
        setFilteredCompanies(filterCompanies(data, filters));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = filterCompanies(companies, filters);
    
    // Apply sorting
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
  }, [companies, filters, sortConfig]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleExport = () => {
    exportToCSV(filteredCompanies);
  };

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

  const clearAllFilters = () => {
    setFilters({ searchTerm: '' });
    setGroupBy('none');
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

  const visibleColumns = getVisibleColumns(columns);
  const activeFiltersCount = Object.keys(filters).filter(k => k !== 'searchTerm' && filters[k as keyof Filters]).length;

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

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Overall Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatScore(stats.avgScore)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.avgRevenue.toFixed(1)}M</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Profit Margin</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(stats.avgProfit)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                )}
              </Button>
              
              <Select value={groupBy} onValueChange={(value) => setGroupBy(value as GroupBy)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="No grouping" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No grouping</SelectItem>
                  <SelectItem value="overallScore">Overall Score</SelectItem>
                  <SelectItem value="profitScore">Profit Score</SelectItem>
                  <SelectItem value="businessType">Business Type</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                  <SelectItem value="ownershipType">Ownership Type</SelectItem>
                  <SelectItem value="revenueRange">Revenue Range</SelectItem>
                </SelectContent>
              </Select>

              {(activeFiltersCount > 0 || groupBy !== 'none') && (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All
                </Button>
              )}

              <div className="flex gap-1 border border-border rounded-md p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                CSV
              </Button>

              {/* <ColumnVisibilityControl columns={columns} onColumnsChange={setColumns} /> */}
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50 sticky top-0">
                    <tr>
                      {visibleColumns.map((col) => (
                        <th
                          key={col.id}
                          className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/70"
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
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-muted/50 transition-colors">
                        {visibleColumns.map((col) => (
                          <td key={col.id} className="px-4 py-3 text-sm">
                            {col.id === 'myRating' ? (
                              <InlineRating company={company} />
                            ) : col.id === 'overallScore' ? (
                              <Badge className={getScoreColor(company['MA_Overall_Fit_Score'] || 0)}>
                                {formatScore(company['MA_Overall_Fit_Score'] || 0)}
                              </Badge>
                            ) : col.id === 'company' ? (
                              <div>
                                <div className="font-medium">{company['Company name']}</div>
                                <div className="text-xs text-muted-foreground">{company['Business Type']}</div>
                              </div>
                            ) : col.id === 'description' ? (
                              <div className="max-w-md line-clamp-2 text-xs">
                                {company.Description?.substring(0, 150)}...
                              </div>
                            ) : col.id === 'revenue' ? (
                              `$${(company['Revenue Estimate (MUSD)'] || 0).toFixed(1)}M`
                            ) : col.id === 'profitMargin' ? (
                              formatPercentage(company['Estimated Profit Margin (%)'] || 0)
                            ) : col.id === 'aiRisk' || col.id === 'aiOpp' ? (
                              <Badge variant="outline">
                                {formatScore(company[col.accessor as keyof Company] as number || 0)}
                              </Badge>
                            ) : (
                              String(company[col.accessor as keyof Company] || '-')
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
        )}

        {/* Cards View Placeholder */}
        {viewMode === 'cards' && (
          <div className="text-center py-12 text-muted-foreground">
            Cards view coming soon...
          </div>
        )}

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <div className="text-center py-12 text-muted-foreground">
            Map view coming soon...
          </div>
        )}

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing {filteredCompanies.length} of {companies.length} companies
          <span className="mx-2">•</span>
          Showing {visibleColumns.length} of {columns.length} columns
        </div>
      </div>
    </div>
  );
}

