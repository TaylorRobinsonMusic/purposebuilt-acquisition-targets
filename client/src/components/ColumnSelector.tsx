import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Columns3, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Column {
  id: string;
  label: string;
  accessor: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
  category?: string;
}

interface ColumnSelectorProps {
  columns: Column[];
  onColumnsChange: (columns: Column[]) => void;
}

export default function ColumnSelector({ columns, onColumnsChange }: ColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const visibleCount = columns.filter(c => c.visible).length;

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

  const toggleColumn = (columnId: string) => {
    const newColumns = columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(newColumns);
  };

  const showAll = () => {
    const newColumns = columns.map(col => ({ ...col, visible: true }));
    onColumnsChange(newColumns);
  };

  const hideAll = () => {
    const newColumns = columns.map(col => ({ ...col, visible: false }));
    onColumnsChange(newColumns);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Columns3 className="h-4 w-4" />
        Columns
        <Badge variant="secondary" className="ml-1">
          {visibleCount}/{columns.length}
        </Badge>
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm">Column Visibility</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-muted rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={showAll}
              className="flex-1"
            >
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={hideAll}
              className="flex-1"
            >
              Hide All
            </Button>
          </div>

          <div className="space-y-2">
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded cursor-pointer"
                onClick={() => toggleColumn(column.id)}
              >
                <Checkbox
                  checked={column.visible}
                  onCheckedChange={() => toggleColumn(column.id)}
                />
                <label className="text-sm cursor-pointer flex-1">
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

