import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FilterPanelProps {
  children: React.ReactNode;
  activeFilters?: number;
}

export default function FilterPanel({ children, activeFilters = 0 }: FilterPanelProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilters > 0 && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
              {activeFilters}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-4 space-y-4">{children}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
