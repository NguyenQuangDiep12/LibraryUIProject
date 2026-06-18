import React from 'react';
import DataTable from '../../../components/common/DataTable';
import ActionButtons from '../../../components/common/ActionButtons';
import { useRole } from '../../../hooks/useRole';

export const BookTable = ({
  books,
  isLoading,
  page,
  pageSize,
  onEdit,
  onDelete,
  onManageCopies,
}) => {
  const { isAdmin, isStaff } = useRole();

  const columns = [
    {
      key: 'stt',
      label: 'STT',
      style: { width: '60px' },
      renderFunction: (row, idx) => (page - 1) * pageSize + idx + 1,
    },
    {
      key: 'coverImage',
      label: 'Bìa',
      style: { width: '80px' },
      renderFunction: (row) => {
        const cover = row.coverImage || row.CoverImage || '';
        return cover ? (
          <img
            src={cover}
            alt="Bìa sách"
            className="rounded"
            style={{ width: '40px', height: '56px', objectFit: 'cover' }}
          />
        ) : (
          <div
            className="bg-light text-muted d-flex align-items-center justify-content-center rounded"
            style={{ width: '40px', height: '56px', fontSize: '0.65rem' }}
          >
            Không ảnh
          </div>
        );
      },
    },
    {
      key: 'title',
      label: 'Tên sách',
      renderFunction: (row) => (
        <div>
          <div className="fw-semibold text-dark">{row.title || row.Title}</div>
          <div className="text-secondary small">{row.language || row.Language || 'Chưa rõ ngôn ngữ'}</div>
        </div>
      ),
    },
    {
      key: 'isbn',
      label: 'ISBN',
      renderFunction: (row) => row.isbn || row.ISBN,
    },
    {
      key: 'copies',
      label: 'Bản sao',
      renderFunction: (row) => {
        const total = row.totalCopies ?? row.TotalCopies ?? 0;
        const available = row.availableCopies ?? row.AvailableCopies ?? 0;
        const isOutOfStock = total === 0 || available === 0;

        return (
          <span className={`badge ${isOutOfStock ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'} px-2 py-1`}>
            {available}/{total} bản
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'text-center',
      renderFunction: (row) => (
        <div className="d-flex align-items-center justify-content-center gap-1">
          {/* Manage copies button */}
          {(isAdmin || isStaff) && onManageCopies && (
            <button
              className="btn btn-sm btn-outline-primary p-1 rounded-1 d-flex align-items-center justify-content-center"
              title="Quản lý bản sao vật lý"
              onClick={(e) => {
                e.stopPropagation();
                onManageCopies(row);
              }}
              style={{ width: '32px', height: '32px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
            </button>
          )}

          <ActionButtons
            onEdit={(isAdmin || isStaff) ? () => onEdit(row) : null}
            onDelete={isAdmin ? () => onDelete(row) : null}
            showView={false}
            showEdit={isAdmin || isStaff}
            showDelete={isAdmin}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={books}
      isLoading={isLoading}
      emptyMessage="Không tìm thấy đầu sách nào"
    />
  );
};

export default BookTable;
