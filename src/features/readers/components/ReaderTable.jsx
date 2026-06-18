import React from 'react';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { useRole } from '../../../hooks/useRole';

export const ReaderTable = ({
  readers,
  isLoading,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onToggleCardStatus,
}) => {
  const { isAdmin } = useRole();

  const getStatusType = (status) => (status?.toUpperCase() === 'ACTIVE' ? 'success' : 'danger');
  const getStatusLabel = (status) => (status?.toUpperCase() === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa');

  const getCardStatusType = (cardStatus) => {
    switch (cardStatus?.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'BLOCKED': return 'danger';
      case 'EXPIRED':
      default: return 'muted';
    }
  };

  const getCardStatusLabel = (cardStatus) => {
    switch (cardStatus?.toUpperCase()) {
      case 'ACTIVE': return 'Hoạt động';
      case 'BLOCKED': return 'Bị khóa';
      case 'EXPIRED': return 'Hết hạn';
      default: return cardStatus || '—';
    }
  };

  const columns = [
    {
      key: 'fullName',
      label: 'Họ tên',
      renderFunction: (row) => row.fullName || row.FullName,
    },
    {
      key: 'email',
      label: 'Email',
      renderFunction: (row) => row.email || row.Email,
    },
    {
      key: 'phone',
      label: 'Số điện thoại',
      renderFunction: (row) => row.phone || row.Phone || '—',
    },
    {
      key: 'status',
      label: 'Tài khoản',
      renderFunction: (row) => {
        const stat = row.status || row.Status;
        return <StatusBadge status={getStatusLabel(stat)} type={getStatusType(stat)} />;
      },
    },
    {
      key: 'cardStatus',
      label: 'Thẻ thư viện',
      renderFunction: (row) => {
        const cStat = row.cardStatus || row.CardStatus;
        return <StatusBadge status={getCardStatusLabel(cStat)} type={getCardStatusType(cStat)} />;
      },
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'text-center',
      renderFunction: (row) => {
        const stat = (row.status || row.Status)?.toUpperCase();
        const cStat = (row.cardStatus || row.CardStatus)?.toUpperCase();

        return (
          <div className="d-flex align-items-center justify-content-center gap-1">
            {/* View Profile */}
            <button
              className="btn btn-sm btn-outline-info p-1 rounded"
              title="Xem chi tiết"
              onClick={() => onViewDetails(row)}
              style={{ width: '28px', height: '28px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>

            {/* Edit Profile */}
            {onEdit && (
              <button
                className="btn btn-sm btn-outline-warning p-1 rounded"
                title="Sửa thông tin"
                onClick={() => onEdit(row)}
                style={{ width: '28px', height: '28px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            )}

            {/* Admin Lock/Unlock Account */}
            {isAdmin && onToggleStatus && (
              <button
                className={`btn btn-sm ${stat === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'} px-2 py-0.5 rounded text-nowrap`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => onToggleStatus(row)}
              >
                {stat === 'ACTIVE' ? 'Khóa TK' : 'Mở TK'}
              </button>
            )}

            {/* Admin Lock/Unlock Card */}
            {isAdmin && onToggleCardStatus && (
              <button
                className={`btn btn-sm ${cStat === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'} px-2 py-0.5 rounded text-nowrap`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => onToggleCardStatus(row)}
              >
                {cStat === 'ACTIVE' ? 'Khóa Thẻ' : 'Mở Thẻ'}
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
      data={readers}
      isLoading={isLoading}
      emptyMessage="Không tìm thấy độc giả nào"
    />
  );
};

export default ReaderTable;
