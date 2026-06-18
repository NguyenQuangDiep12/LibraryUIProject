import React from 'react';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { useRole } from '../../../hooks/useRole';

export const FineTable = ({ fines, isLoading, onPay }) => {
  const { isStaff, isAdmin } = useRole();

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const getFineTypeLabel = (type) => {
    const typeStr = typeof type === 'number' ? ['OVERDUE', 'LOST', 'DAMAGED'][type] : String(type);
    switch (typeStr?.toUpperCase()) {
      case 'OVERDUE': return 'Quá hạn';
      case 'LOST': return 'Mất sách';
      case 'DAMAGED': return 'Hỏng sách';
      default: return typeStr || '—';
    }
  };

  const getPaymentStatusType = (status) => {
    const statusStr = typeof status === 'number' ? ['PENDING', 'PAID', 'CANCELLED'][status] : String(status);
    switch (statusStr?.toUpperCase()) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'muted';
      default: return 'default';
    }
  };

  const getPaymentStatusLabel = (status) => {
    const statusStr = typeof status === 'number' ? ['PENDING', 'PAID', 'CANCELLED'][status] : String(status);
    switch (statusStr?.toUpperCase()) {
      case 'PAID': return 'Đã thanh toán';
      case 'PENDING': return 'Chưa thanh toán';
      case 'CANCELLED': return 'Đã hủy';
      default: return statusStr || '—';
    }
  };

  const columns = [
    {
      key: 'readerName',
      label: 'Độc giả',
      renderFunction: (row) => row.readerName || row.ReaderName,
    },
    {
      key: 'borrowCode',
      label: 'Mã phiếu',
      renderFunction: (row) => row.borrowCode || row.BorrowCode,
    },
    {
      key: 'fineType',
      label: 'Loại phạt',
      renderFunction: (row) => getFineTypeLabel(row.fineType ?? row.FineType),
    },
    {
      key: 'amount',
      label: 'Số tiền',
      renderFunction: (row) => {
        const amt = row.amount ?? row.Amount ?? 0;
        return <span className="fw-semibold text-danger">{amt.toLocaleString('vi-VN')} VNĐ</span>;
      },
    },
    {
      key: 'status',
      label: 'Trạng thái',
      renderFunction: (row) => {
        const stat = row.paymentStatus ?? row.PaymentStatus;
        return <StatusBadge status={getPaymentStatusLabel(stat)} type={getPaymentStatusType(stat)} />;
      },
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      renderFunction: (row) => formatDate(row.createdAt || row.CreatedAt),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'text-center',
      renderFunction: (row) => {
        const stat = row.paymentStatus ?? row.PaymentStatus;
        const statStr = typeof stat === 'number' ? ['PENDING', 'PAID', 'CANCELLED'][stat] : String(stat);
        
        return (
          <div className="d-flex align-items-center justify-content-center">
            {(isStaff || isAdmin) && statStr?.toUpperCase() === 'PENDING' && onPay && (
              <button
                className="btn btn-sm btn-outline-success px-2 py-0.5 rounded text-nowrap"
                style={{ fontSize: '0.75rem' }}
                onClick={() => onPay(row)}
              >
                Thu tiền
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
      data={fines}
      isLoading={isLoading}
      emptyMessage="Không có phiếu phạt nào"
    />
  );
};

export default FineTable;
