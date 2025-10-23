import { Button } from '@/components/ui/button';
import { Table, LayoutGrid, Map } from 'lucide-react';

export type ViewMode = 'table' | 'cards' | 'map';

interface ViewModeSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewModeSwitcher({ currentView, onViewChange }: ViewModeSwitcherProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant={currentView === 'table' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onViewChange('table')}
        title="Table view"
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === 'cards' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onViewChange('cards')}
        title="Cards view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={currentView === 'map' ? 'default' : 'outline'}
        size="icon"
        onClick={() => onViewChange('map')}
        title="Map view"
      >
        <Map className="h-4 w-4" />
      </Button>
    </div>
  );
}

