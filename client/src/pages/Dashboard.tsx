import { useEffect, useState } from 'react';
import { Company, exportToCSV, loadAcquisitionData } from '@/lib/dataLoader';
import { filterCompanies, Filters, formatPercentage, formatScore, getScoreColor } from '@/lib/filterUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Filter, TrendingUp, Building2, DollarSign, Target } from 'lucide-react';

export default function Dashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
  });
  const [showFilters, setShowFilters] = useState(false);

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
    setFilteredCompanies(filterCompanies(companies, filters));
  }, [companies, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleExport = () => {
    exportToCSV(filteredCompanies);
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

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {((filters.states?.length || 0) + (filters.businessTypes?.length || 0)) > 0 && (
                <Badge variant="secondary" className="ml-2">{(filters.states?.length || 0) + (filters.businessTypes?.length || 0)}</Badge>
              )}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {/* Companies Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Score</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Business Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Revenue</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Profit Margin</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">AI Risk</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">AI Opp</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">
                        <Badge className={getScoreColor(company['MA_Overall_Fit_Score'] || 0)}>
                          {formatScore(company['MA_Overall_Fit_Score'] || 0)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{company['Company name']}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {company.Description?.substring(0, 100)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{company['Business Type'] || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">${(company['Revenue Estimate (MUSD)'] || 0).toFixed(1)}M</td>
                      <td className="px-4 py-3 text-sm">{formatPercentage(company['Estimated Profit Margin (%)'] || 0)}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">{formatScore(company['AI_Disruption_Score'] || 0)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">{formatScore(company['AI-Opp_Score'] || 0)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{company.City}, {company.State_Province}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing {filteredCompanies.length} of {companies.length} companies
        </div>
      </div>
    </div>
  );
}

