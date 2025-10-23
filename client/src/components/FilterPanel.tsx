import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface FilterPanelProps {
  onFiltersChange: (filters: any) => void;
  filterOptions: {
    states: string[];
    businessTypes: string[];
    ownershipTypes: string[];
  };
}

export default function FilterPanel({ onFiltersChange, filterOptions }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<any>({});
  const [expandedSections, setExpandedSections] = useState({
    financial: true,
    categories: true,
    scores: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const applyPresetFilter = (filterName: string) => {
    let newFilters: any = {};
    
    switch (filterName) {
      case 'topTargets':
        newFilters = { overallFitScore: [9.0, 10.0] };
        break;
      case 'highProfit':
        newFilters = { profitMargin: [15, 100] };
        break;
      case 'aiLeaders':
        newFilters = { aiOppScore: [8.5, 10.0] };
        break;
      case 'growthChampions':
        newFilters = { growthFitScore: [8.0, 10.0] };
        break;
      case 'largeRevenue':
        newFilters = { revenue: [6, 8] };
        break;
      case 'techCompanies':
        newFilters = { businessType: ['SaaS/Software', 'Software', 'Technology'] };
        break;
      default:
        newFilters = {};
    }
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const removeFilter = (filterKey: string, value: any = null) => {
    const newFilters = { ...localFilters };
    if (value && Array.isArray(newFilters[filterKey])) {
      newFilters[filterKey] = newFilters[filterKey].filter((v: any) => v !== value);
      if (newFilters[filterKey].length === 0) {
        delete newFilters[filterKey];
      }
    } else {
      delete newFilters[filterKey];
    }
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const activeFilterCount = Object.keys(localFilters).length;

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Active Filters</h3>
            <Badge variant="secondary">{activeFilterCount}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(localFilters).map(([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                return value.map((v: any) => (
                  <Badge
                    key={`${key}-${v}`}
                    variant="outline"
                    className="gap-1"
                  >
                    {v}
                    <button
                      onClick={() => removeFilter(key, v)}
                      className="hover:bg-muted rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ));
              } else if (value && !Array.isArray(value)) {
                return (
                  <Badge
                    key={key}
                    variant="outline"
                    className="gap-1"
                  >
                    {key}: {JSON.stringify(value)}
                    <button
                      onClick={() => removeFilter(key)}
                      className="hover:bg-muted rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              }
              return null;
            })}
          </div>
        </Card>
      )}

      {/* Preset Filters */}
      <Card className="p-4">
        <h3 className="font-medium text-sm mb-3">Quick Filters</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPresetFilter('topTargets')}
            className="justify-start"
          >
            Top Targets
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPresetFilter('highProfit')}
            className="justify-start"
          >
            High Profit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPresetFilter('aiLeaders')}
            className="justify-start"
          >
            AI Leaders
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPresetFilter('growthChampions')}
            className="justify-start"
          >
            Growth Champions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPresetFilter('largeRevenue')}
            className="justify-start"
          >
            Large Revenue
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPresetFilter('techCompanies')}
            className="justify-start"
          >
            Tech Companies
          </Button>
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={clearAllFilters}
            className="w-full mt-2"
          >
            Clear All Filters
          </Button>
        )}
      </Card>

      {/* Financial Metrics */}
      <Card className="p-4">
        <button
          onClick={() => toggleSection('financial')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-medium text-sm">Financial Metrics</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.financial ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.financial && (
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Revenue and profit margin filters coming soon...</p>
          </div>
        )}
      </Card>

      {/* Categories */}
      <Card className="p-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-medium text-sm">Categories</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.categories && (
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>State, business type, and ownership filters coming soon...</p>
          </div>
        )}
      </Card>

      {/* Score Filters */}
      <Card className="p-4">
        <button
          onClick={() => toggleSection('scores')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-medium text-sm">Score Filters</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.scores ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.scores && (
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Overall fit, AI risk, and AI opportunity filters coming soon...</p>
          </div>
        )}
      </Card>
    </div>
  );
}

