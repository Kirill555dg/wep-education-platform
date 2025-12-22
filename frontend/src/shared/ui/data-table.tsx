import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

export function DataTable<TData>(props: {
  data: TData[];
  columns: Array<ColumnDef<TData>>;
  sortable?: boolean;
}) {
  const { data, columns, sortable = false } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const sortedRowModel = useMemo(() => (sortable ? getSortedRowModel() : undefined), [sortable]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortedRowModel,
    state: sortable ? { sorting } : undefined,
    onSortingChange: sortable ? setSorting : undefined,
  });

  return (
    <div className="w-full overflow-auto border rounded-md">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b">
              {hg.headers.map((h) => (
                <th key={h.id} className="px-3 py-2 text-left font-medium">
                  {h.isPlaceholder ? null : sortable && h.column.getCanSort() ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 hover:underline underline-offset-4"
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {{
                        asc: "▲",
                        desc: "▼",
                      }[h.column.getIsSorted() as string] ?? null}
                    </button>
                  ) : (
                    flexRender(h.column.columnDef.header, h.getContext())
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((r) => (
            <tr key={r.id} className="border-b last:border-b-0">
              {r.getVisibleCells().map((c) => (
                <td key={c.id} className="px-3 py-2 align-top">
                  {flexRender(c.column.columnDef.cell, c.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


