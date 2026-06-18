import React from 'react';
import DataTable from '../../../components/common/DataTable';
import StatusBadge from '../../../components/common/StatusBadge';
import { useRole } from '../../../hooks/useRole';

export const StaffTable = ({ staffs, isLoading, onEdit, onToggleStatus }) => {
  const { isAdmin } = useRole();

  const getStatusType = (status) => (status?.toUpperCase() === 'ACTIVE' ? 'success' : 'danger');
  const getStatusLabel = (status) => (status?.toUpperCase() === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa');

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
      key: 'address',
      label: 'Địa chỉ',
      renderFunction: (row) => row.address || row.Address || '—',
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
      key: 'actions',
      label: 'Thao tác',
      className: 'text-center',
      renderFunction: (row) => {
        const stat = (row.status || row.Status)?.toUpperCase();

        return (
          <div className="d-flex align-items-center justify-content-center gap-1">
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

            {/* Lock/Unlock Staff Account */}
            {isAdmin && onToggleStatus && (
              <button
                className={`btn btn-sm ${stat === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'} px-2 py-0.5 rounded text-nowrap`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => onToggleStatus(row)}
              >
                {stat === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
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
      data={staffs}
      isLoading={isLoading}
      emptyMessage="Chưa có nhân viên nào được tạo"
    />
  );
};

export default StaffTable;
