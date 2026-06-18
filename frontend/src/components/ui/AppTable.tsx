import React from 'react';

interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface AppTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
}

export function AppTable<T>({ columns, data, keyExtractor, emptyState, isLoading = false }: AppTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2.5 animate-pulse py-2">
        <div className="h-7 bg-[#1E293B]/40 rounded-lg w-full" />
        <div className="h-10 bg-[#111827]/40 rounded-lg w-full" />
        <div className="h-10 bg-[#111827]/40 rounded-lg w-full" />
        <div className="h-10 bg-[#111827]/40 rounded-lg w-full" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-10 text-center font-sans text-xs text-slate-500 border border-[#1E293B] rounded-2xl bg-[#0F172A]/10">
        {emptyState || "No records available."}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#1E293B] bg-[#0F172A]/10 font-sans text-xs">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[#1E293B] bg-[#111827]/50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {columns.map((col, idx) => (
              <th key={idx} className={`p-3.5 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1E293B]/60 text-slate-300">
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-[#1E293B]/20 transition-colors">
              {columns.map((col, idx) => (
                <td key={idx} className={`p-3.5 align-middle ${col.className || ''}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
