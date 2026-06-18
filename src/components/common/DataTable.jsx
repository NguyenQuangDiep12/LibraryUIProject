import React from 'react';

export const DataTable = ({ columns, data, isLoading, emptyMessage = 'Không có dữ liệu' }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0 align-middle">
        <thead className="table-light border-bottom">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                scope="col"
                className={`text-muted fw-semibold small py-3 px-4 text-uppercase ${col.className || ''}`}
                style={col.style}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-5">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <span className="text-secondary small">Đang tải dữ liệu...</span>
              </td>
            </tr>
          ) : data && data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr key={row.id || row.userId || row.bookId || row.reservationId || row.borrowId || row.fineId || rowIdx}>
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={`py-3 px-4 text-dark ${col.cellClassName || ''}`}
                  >
                    {col.renderFunction
                      ? col.renderFunction(row, rowIdx)
                      : row[col.key] !== undefined && row[col.key] !== null
                      ? String(row[col.key])
                      : '—'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-secondary bg-white">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
