import React from 'react';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { useRole } from '../../../hooks/useRole';

export const BorrowTable = ({
  borrows,
  isLoading,
  onViewDetails,
  onRequestExtension,
  onConfirmReturn,
  onCancelRecord,
  onProcessExtension,
}) => {
  const { isReader, isStaff, isAdmin } = useRole();

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const getBorrowStatusType = (status) => {
    switch (status?.toUpperCase()) {
      case 'RETURNED': return 'success';
      case 'BORROWING': return 'info';
      case 'OVERDUE': return 'danger';
      case 'CANCELLED': return 'muted';
      default: return 'default';
    }
  };

  const getBorrowStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'RETURNED': return 'Đã trả';
      case 'BORROWING': return 'Đang mượn';
      case 'OVERDUE': return 'Quá hạn';
      case 'CANCELLED': return 'Đã hủy';
      default: return status || '—';
    }
  };

  const getExtensionStatusType = (extStatus) => {
    switch (extStatus?.toUpperCase()) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'danger';
      case 'NONE':
      default: return 'muted';
    }
  };

  const getExtensionStatusLabel = (extStatus) => {
    switch (extStatus?.toUpperCase()) {
      case 'APPROVED': return 'Đã duyệt';
      case 'PENDING': return 'Chờ gia hạn';
      case 'REJECTED': return 'Bị từ chối';
      case 'NONE': return 'Không';
      default: return extStatus || '—';
    }
  };

  const columns = [
    {
      key: 'borrowCode',
      label: 'Mã phiếu',
      renderFunction: (row) => <span className="fw-semibold text-primary">{row.borrowCode || row.BorrowCode}</span>,
    },
    ...(!isReader ? [{
      key: 'readerName',
      label: 'Độc giả',
      renderFunction: (row) => row.readerName || row.ReaderName,
    }] : []),
    {
      key: 'borrowType',
      label: 'Hình thức',
      renderFunction: (row) => {
        const type = row.borrowType || row.BorrowType;
        return type?.toUpperCase() === 'TAKEHOME' ? 'Mang về' : 'Đọc tại chỗ';
      },
    },
    {
      key: 'borrowDate',
      label: 'Ngày mượn',
      renderFunction: (row) => formatDate(row.borrowDate || row.BorrowDate),
    },
    {
      key: 'dueDate',
      label: 'Hạn trả',
      renderFunction: (row) => {
        const status = row.status || row.Status;
        const isOverdue = status?.toUpperCase() === 'OVERDUE';
        return (
          <span className={isOverdue ? 'text-danger fw-semibold' : 'text-dark'}>
            {formatDate(row.dueDate || row.DueDate)}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Trạng thái',
      renderFunction: (row) => {
        const stat = row.status || row.Status;
        return <StatusBadge status={getBorrowStatusLabel(stat)} type={getBorrowStatusType(stat)} />;
      },
    },
    {
      key: 'extensionStatus',
      label: 'Yêu cầu gia hạn',
      renderFunction: (row) => {
        const extStatus = row.extensionRequestStatus || row.ExtensionRequestStatus;
        return <StatusBadge status={getExtensionStatusLabel(extStatus)} type={getExtensionStatusType(extStatus)} />;
      },
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'text-center',
      renderFunction: (row) => {
        const status = (row.status || row.Status)?.toUpperCase();
        const extStatus = (row.extensionRequestStatus || row.ExtensionRequestStatus)?.toUpperCase();

        return (
          <div className="d-flex align-items-center justify-content-center gap-1">
            {/* View Details Button */}
            <button
              className="btn btn-sm btn-outline-info p-1 rounded"
              title="Chi tiết phiếu mượn"
              onClick={() => onViewDetails(row)}
              style={{ width: '28px', height: '28px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>

            {/* Reader Action: Request Extension */}
            {isReader && status === 'BORROWING' && extStatus !== 'PENDING' && (
              <button
                className="btn btn-sm btn-outline-primary px-2 py-0.5 rounded text-nowrap"
                style={{ fontSize: '0.75rem' }}
                onClick={() => onRequestExtension(row)}
              >
                Gia hạn
              </button>
            )}

            {/* Staff Action: Confirm Return */}
            {(isStaff || isAdmin) && status === 'BORROWING' && (
              <button
                className="btn btn-sm btn-outline-success px-2 py-0.5 rounded text-nowrap"
                style={{ fontSize: '0.75rem' }}
                onClick={() => onConfirmReturn(row)}
              >
                Trả sách
              </button>
            )}

            {/* Staff Action: Process Extension Request */}
            {(isStaff || isAdmin) && extStatus === 'PENDING' && (
              <button
                className="btn btn-sm btn-outline-warning px-2 py-0.5 rounded text-nowrap"
                style={{ fontSize: '0.75rem' }}
                onClick={() => onProcessExtension(row)}
              >
                Duyệt gia hạn
              </button>
            )}

            {/* Staff Action: Cancel borrowing (only before return, usually pending or borrowing) */}
            {(isStaff || isAdmin) && status === 'BORROWING' && (
              <button
                className="btn btn-sm btn-outline-danger p-1 rounded"
                title="Hủy phiếu mượn"
                onClick={() => onCancelRecord(row)}
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
      data={borrows}
      isLoading={isLoading}
      emptyMessage="Không tìm thấy phiếu mượn nào"
    />
  );
};

export default BorrowTable;
