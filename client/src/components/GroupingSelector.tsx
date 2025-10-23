import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Group, X, ChevronDown } from 'lucide-react';

export type GroupByOption = 
  | 'none'
  | 'overallScore'
  | 'profitScore'
  | 'businessType'
  | 'state'
  | 'ownershipType'
  | 'revenueRange';

interface GroupingSelectorProps {
  currentGrouping: GroupByOption;
  onGroupingChange: (grouping: GroupByOption) => void;
}

const groupingOptions: { value: GroupByOption; label: string }[] = [
  { value: 'none', label: 'No Grouping' },
  { value: 'overallScore', label: 'Overall Score' },
  { value: 'profitScore', label: 'Profit Score' },
  { value: 'businessType', label: 'Business Type' },
  { value: 'state', label: 'State' },
  { value: 'ownershipType', label: 'Ownership Type' },
  { value: 'revenueRange', label: 'Revenue Range' },
];

export default function GroupingSelector({ currentGrouping, onGroupingChange }: GroupingSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = groupingOptions.find(opt => opt.value === currentGrouping)?.label || 'No Grouping';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value: GroupByOption) => {
    onGroupingChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Group className="h-4 w-4" />
        Group by: {currentLabel}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <Card className="absolute left-0 top-full mt-2 w-64 z-50 p-2">
          <div className="space-y-1">
            {groupingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  currentGrouping === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

