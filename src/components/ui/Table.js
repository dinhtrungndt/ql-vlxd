import React from 'react';

const Table = ({ columns, data, loading = false, emptyMessage = 'Không có dữ liệu' }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-800/50 text-xs uppercase text-slate-400">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className={`px-6 py-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700 bg-slate-900/50">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800/50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 ${col.cellClassName || ''}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
