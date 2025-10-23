import { Button } from '@/components/ui/button';
import { Table, LayoutGrid, Map } from 'lucide-react';

export type ViewMode = 'table' | 'cards' | 'map';

interface ViewModeSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewModeSwitcher({ currentView, onViewChange }: ViewModeSwitcherProps) {
  return (
    <div className="flex gap-1 border rounded-lg p-1">
      <Button
        variant={currentView === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="gap-2"
      >
        <Table className="h-4 w-4" />
        Table
      </Button>
      <Button
        variant={currentView === 'cards' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('cards')}
        className="gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Cards
      </Button>
      <Button
        variant={currentView === 'map' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('map')}
        className="gap-2"
      >
        <Map className="h-4 w-4" />
        Map
      </Button>
    </div>
  );
}

