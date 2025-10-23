import { Company } from '@/lib/dataLoader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatScore, formatPercentage } from '@/lib/filterUtils';
import InlineRating from './InlineRating';
import { Building2, DollarSign, TrendingUp, MapPin, Users } from 'lucide-react';

interface CardsViewProps {
  companies: Company[];
  onCompanyClick?: (company: Company) => void;
}

export default function CardsView({ companies, onCompanyClick }: CardsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {companies.map((company, idx) => (
        <Card 
          key={company.id || idx} 
          className="hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => onCompanyClick?.(company)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                  {company['Company name']}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {company['Business Type']}
                </p>
              </div>
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
            </div>
            
            <div className="mt-2">
              <InlineRating company={company} />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {company.Description || 'No description available'}
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                  <div className="font-medium">${(company['Revenue Estimate (MUSD)'] || 0).toFixed(1)}M</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Profit</div>
                  <div className="font-medium">{formatPercentage(company['Estimated Profit Margin (%)'] || 0)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Location</div>
                  <div className="font-medium">{company.State_Province || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Employees</div>
                  <div className="font-medium">{company['Employees Count (LinkedIn)'] || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* AI Scores */}
            <div className="flex gap-2 pt-2 border-t">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">AI Risk</div>
                <Badge variant="outline" className="w-full justify-center font-mono">
                  {formatScore(company['AI_Disruption_Score'] || 0)}
                </Badge>
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">AI Opp</div>
                <Badge variant="outline" className="w-full justify-center font-mono">
                  {formatScore(company['AI-Opp_Score'] || 0)}
                </Badge>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={(e) => {
                e.stopPropagation();
                onCompanyClick?.(company);
              }}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

