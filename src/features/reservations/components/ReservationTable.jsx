import React from 'react';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { useRole } from '../../../hooks/useRole';

export const ReservationTable = ({
  reservations,
  isLoading,
  onComplete,
  onCancel,
}) => {
  const { isStaff, isAdmin } = useRole();

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const getStatusType = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'muted';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'Hoàn thành';
      case 'PENDING': return 'Chờ nhận sách';
      case 'CANCELLED': return 'Đã hủy';
      default: return status || '—';
    }
  };

  const columns = [
    {
      key: 'fullName',
      label: 'Độc giả',
      renderFunction: (row) => row.fullName || row.FullName || '—',
    },
    {
      key: 'title',
      label: 'Đầu sách đặt',
      renderFunction: (row) => row.title || row.Title || '—',
    },
    {
      key: 'createdAt',
      label: 'Ngày đặt',
      renderFunction: (row) => formatDate(row.createdAt || row.CreatedAt),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      renderFunction: (row) => {
        const stat = row.status || row.Status;
        return <StatusBadge status={getStatusLabel(stat)} type={getStatusType(stat)} />;
      },
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'text-center',
      renderFunction: (row) => {
        const stat = (row.status || row.Status)?.toUpperCase();

        return (
          <div className="d-flex align-items-center justify-content-center gap-2">
            {/* Complete Reservation (convert to borrow) */}
            {(isStaff || isAdmin) && stat === 'PENDING' && onComplete && (
              <button
                className="btn btn-sm btn-outline-success px-2 py-0.5 rounded text-nowrap"
                style={{ fontSize: '0.75rem' }}
                onClick={() => onComplete(row)}
              >
                Nhận sách
              </button>
            )}

            {/* Cancel Reservation */}
            {(isStaff || isAdmin) && stat === 'PENDING' && onCancel && (
              <button
                className="btn btn-sm btn-outline-danger p-1 rounded"
                title="Hủy đặt trước"
                onClick={() => onCancel(row)}
                style={{ width: '28px', height: '28px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={reservations}
      isLoading={isLoading}
      emptyMessage="Chưa có yêu cầu đặt trước nào"
    />
  );
};

export default ReservationTable;
