import React from 'react';
import DataTable from '../../../components/common/DataTable';
import ActionButtons from '../../../components/common/ActionButtons';
import { useRole } from '../../../hooks/useRole';

export const PublisherTable = ({ publishers, isLoading, onEdit, onDelete }) => {
  const { isAdmin, isStaff } = useRole();

  const columns = [
    {
      key: 'stt',
      label: 'STT',
      style: { width: '80px' },
      renderFunction: (row, idx) => idx + 1,
    },
    {
      key: 'name',
      label: 'Nhà xuất bản',
      renderFunction: (row) => row.name || row.Name || row.publisherName || row.PublisherName || '—',
    },
    {
      key: 'actions',
      label: 'Thao tác',
      className: 'text-center',
      renderFunction: (row) => (
        <ActionButtons
          onEdit={(isAdmin || isStaff) ? () => onEdit(row) : null}
          onDelete={isAdmin ? () => onDelete(row) : null}
          showView={false}
          showEdit={isAdmin || isStaff}
          showDelete={isAdmin}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={publishers}
      isLoading={isLoading}
      emptyMessage="Chưa có nhà xuất bản nào được tạo"
    />
  );
};

export default PublisherTable;
