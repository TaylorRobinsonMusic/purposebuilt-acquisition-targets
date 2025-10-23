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
        className={currentView === 'table' ? 'bg-blue-500/20 border-blue-500/50 text-blue-500' : 'border-blue-500/30 text-blue-500/70 hover:bg-blue-500/10'}
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onViewChange('cards')}
        title="Cards view"
        className={currentView === 'cards' ? 'bg-purple-500/20 border-purple-500/50 text-purple-500' : 'border-purple-500/30 text-purple-500/70 hover:bg-purple-500/10'}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onViewChange('map')}
        title="Map view"
        className={currentView === 'map' ? 'bg-orange-500/20 border-orange-500/50 text-orange-500' : 'border-orange-500/30 text-orange-500/70 hover:bg-orange-500/10'}
      >
        <Map className="h-4 w-4" />
      </Button>
    </div>
  );
}

