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
        variant="outline"
        size="icon"
        onClick={() => onViewChange('table')}
        title="Table view"
        className={currentView === 'table' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-muted'}
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onViewChange('cards')}
        title="Cards view"
        className={currentView === 'cards' ? 'bg-purple-500 text-white hover:bg-purple-600' : 'hover:bg-muted'}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onViewChange('map')}
        title="Map view"
        className={currentView === 'map' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'hover:bg-muted'}
      >
        <Map className="h-4 w-4" />
      </Button>
    </div>
  );
}

