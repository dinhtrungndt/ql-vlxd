
const Table = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = 'Không có dữ liệu'
}) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-800/50 text-xs uppercase text-slate-400">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-4 font-semibold ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <svg className="mb-3 h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="transition-colors hover:bg-slate-800/40"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className={`whitespace-nowrap px-6 py-4 ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
