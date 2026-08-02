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
        <div className="h-10 rounded-xl w-full" style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',  background: 'var(--theme-surface)' }} />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl w-full" style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',  background: 'var(--theme-card)', opacity: 0.6 }} />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className="py-12 text-center font-sans text-sm rounded-2xl"
        style={{
          color: 'var(--theme-text-muted)',
          border: '1px solid var(--theme-border)',
          background: 'var(--theme-bg)',
        }}
      >
        {emptyState || 'No security records available.'}
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-x-auto rounded-2xl font-sans text-xs"
      style={{
        background: 'var(--theme-bg)',
        border: '1px solid var(--theme-border)',
      }}
    >
      <table className="w-full border-collapse text-left">
        <thead>
          <tr
            style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', 
              background: 'var(--theme-surface)',
              borderBottom: '1px solid var(--theme-border)',
            }}
          >
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`p-4 text-[10px] font-mono font-bold uppercase tracking-[0.08em] ${col.className || ''}`}
                style={{ color: 'var(--theme-text-muted)' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className="transition-colors"
              style={{ borderBottom: '1px solid color-mix(in srgb, var(--theme-border) 50%, transparent)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--theme-border) 35%, transparent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  className={`p-4 align-middle font-medium ${col.className || ''}`}
                  style={{ color: 'var(--theme-text)' }}
                >
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
