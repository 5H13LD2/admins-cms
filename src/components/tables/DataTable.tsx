import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface DataColumn<T extends Record<string, unknown>> {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataColumn<T>[];
  data: T[];
  emptyLabel?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyLabel = 'No records found',
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-sm text-muted-foreground">
                {emptyLabel}
              </TableCell>
            </TableRow>
          )}
          {data.map((row) => (
            <TableRow key={String(row.id ?? row.key ?? JSON.stringify(row))}>
              {columns.map((column) => (
                <TableCell key={String(column.key)} className={column.className}>
                  {column.render ? column.render(row) : (row[column.key] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

