import { Company } from '@/lib/dataLoader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  companies: Company[];
}

export default function MapView({ companies }: MapViewProps) {
  // Group companies by state
  const companiesByState = companies.reduce((acc, company) => {
    const state = company.State_Province || 'Unknown';
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(company);
    return acc;
  }, {} as Record<string, Company[]>);

  const sortedStates = Object.entries(companiesByState)
    .sort(([, a], [, b]) => b.length - a.length);

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-muted/50">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold">Geographic Distribution</h2>
            <p className="text-sm text-muted-foreground">
              Companies grouped by location ({companies.length} total)
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedStates.map(([state, stateCompanies]) => (
          <Card key={state} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{state}</h3>
                </div>
                <Badge variant="secondary">{stateCompanies.length}</Badge>
              </div>

              <div className="space-y-2">
                {stateCompanies.slice(0, 5).map((company, idx) => (
                  <div 
                    key={company.id || idx}
                    className="text-sm p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="font-medium truncate">{company['Company name']}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {company['Business Type']}
                    </div>
                  </div>
                ))}
                
                {stateCompanies.length > 5 && (
                  <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                    +{stateCompanies.length - 5} more
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          💡 Interactive map with markers coming soon
        </p>
      </Card>
    </div>
  );
}

