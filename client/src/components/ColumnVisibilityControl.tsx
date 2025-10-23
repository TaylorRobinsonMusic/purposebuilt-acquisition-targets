import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ColumnDefinition, getColumnsByCategory } from '@/lib/columnDefinitions';

interface ColumnVisibilityControlProps {
  columns: ColumnDefinition[];
  onColumnsChange: (columns: ColumnDefinition[]) => void;
}

export default function ColumnVisibilityControl({ columns, onColumnsChange }: ColumnVisibilityControlProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Core: true,
    'Fit Scores': true,
    Financial: true,
    AI: true,
  });

  const columnsByCategory = getColumnsByCategory(columns);
  const visibleCount = columns.filter(c => c.visible).length;

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleColumn = (columnId: string) => {
    const newColumns = columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(newColumns);
  };

  const showAllInCategory = (category: string) => {
    const newColumns = columns.map(col =>
      col.category === category ? { ...col, visible: true } : col
    );
    onColumnsChange(newColumns);
  };

  const hideAllInCategory = (category: string) => {
    const newColumns = columns.map(col =>
      col.category === category ? { ...col, visible: false } : col
    );
    onColumnsChange(newColumns);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          Columns
          <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs">
            {visibleCount}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[500px] overflow-y-auto" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Column Visibility</h4>
            <span className="text-xs text-muted-foreground">
              {visibleCount} of {columns.length} visible
            </span>
          </div>

          {Object.entries(columnsByCategory).map(([category, categoryCols]) => (
            <div key={category} className="border border-border rounded-lg">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 rounded-t-lg"
              >
                <div className="flex items-center gap-2">
                  {expandedCategories[category] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium text-sm">{category}</span>
                  <span className="text-xs text-muted-foreground">
                    ({categoryCols.filter(c => c.visible).length}/{categoryCols.length})
                  </span>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => showAllInCategory(category)}
                    className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20"
                  >
                    All
                  </button>
                  <button
                    onClick={() => hideAllInCategory(category)}
                    className="px-2 py-1 text-xs bg-secondary/10 rounded hover:bg-secondary/20"
                  >
                    None
                  </button>
                </div>
              </button>

              {expandedCategories[category] && (
                <div className="p-2 space-y-1 border-t border-border">
                  {categoryCols.map(col => (
                    <div
                      key={col.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted/30 cursor-pointer"
                      onClick={() => toggleColumn(col.id)}
                    >
                      <input
                        type="checkbox"
                        checked={col.visible}
                        onChange={() => {}}
                        className="w-4 h-4 pointer-events-none"
                      />
                      <label className="text-sm flex-1 cursor-pointer pointer-events-none">
                        {col.label}
                      </label>
                      {col.visible ? (
                        <Eye className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

