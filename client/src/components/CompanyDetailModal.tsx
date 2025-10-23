import { Company } from '@/lib/dataLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatScore, formatPercentage } from '@/lib/filterUtils';
import InlineRating from './InlineRating';
import { 
  X, Building2, DollarSign, TrendingUp, MapPin, Users, 
  Calendar, Globe, Briefcase, Target, Zap, AlertTriangle 
} from 'lucide-react';
import { useEffect } from 'react';

interface CompanyDetailModalProps {
  company: Company | null;
  onClose: () => void;
}

export default function CompanyDetailModal({ company, onClose }: CompanyDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (company) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [company, onClose]);

  if (!company) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">{company['Company name']}</h2>
              <Badge 
                className={
                  (company['MA_Overall_Fit_Score'] || 0) >= 9 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : (company['MA_Overall_Fit_Score'] || 0) >= 8
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }
              >
                Overall Score: {formatScore(company['MA_Overall_Fit_Score'] || 0)}
              </Badge>
            </div>
            <p className="text-muted-foreground">{company['Business Type']}</p>
            <div className="mt-2">
              <InlineRating company={company} />
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {company.Description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {company.Description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Revenue</span>
                </div>
                <p className="text-2xl font-bold">
                  ${(company['Revenue Estimate (MUSD)'] || 0).toFixed(1)}M
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Profit Margin</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatPercentage(company['Estimated Profit Margin (%)'] || 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Employees</span>
                </div>
                <p className="text-2xl font-bold">
                  {company['Employees Count (LinkedIn)'] || 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Location</span>
                </div>
                <p className="text-2xl font-bold">
                  {company.State_Province || 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Fit Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Acquisition Fit Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Revenue Fit</div>
                  <Badge variant="outline" className="w-full justify-center font-mono text-base">
                    {formatScore(company['Revenue Fit Score'] || 0)}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Profit Fit</div>
                  <Badge variant="outline" className="w-full justify-center font-mono text-base">
                    {formatScore(company['Profit Fit Score'] || 0)}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Growth Fit</div>
                  <Badge variant="outline" className="w-full justify-center font-mono text-base">
                    {formatScore(company['Growth Fit Score'] || 0)}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Industry Fit</div>
                  <Badge variant="outline" className="w-full justify-center font-mono text-base">
                    {formatScore(company['Industry Fit Score'] || 0)}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Location Fit</div>
                  <Badge variant="outline" className="w-full justify-center font-mono text-base">
                    {formatScore(company['Location Fit Score'] || 0)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  AI Disruption Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-2xl font-mono px-4 py-2">
                    {formatScore(company['AI_Disruption_Score'] || 0)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Risk assessment of AI disruption
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-cyan-500" />
                  AI Opportunity Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-2xl font-mono px-4 py-2">
                    {formatScore(company['AI-Opp_Score'] || 0)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Potential for AI enhancement
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {company['Ownership Type'] && (
                  <div>
                    <span className="text-muted-foreground">Ownership Type:</span>
                    <span className="ml-2 font-medium">{company['Ownership Type']}</span>
                  </div>
                )}
                {company.Founded && (
                  <div>
                    <span className="text-muted-foreground">Founded:</span>
                    <span className="ml-2 font-medium">{company.Founded}</span>
                  </div>
                )}
                {company.City && (
                  <div>
                    <span className="text-muted-foreground">City:</span>
                    <span className="ml-2 font-medium">{company.City}</span>
                  </div>
                )}
                {company.Region && (
                  <div>
                    <span className="text-muted-foreground">Region:</span>
                    <span className="ml-2 font-medium">{company.Region}</span>
                  </div>
                )}
                {company['Website'] && (
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">Website:</span>
                    <a 
                      href={company['Website']} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 font-medium text-primary hover:underline"
                    >
                      {company['Website']}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

