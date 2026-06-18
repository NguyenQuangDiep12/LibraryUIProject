import React from 'react';
import DataTable from '../../../components/common/DataTable';
import ActionButtons from '../../../components/common/ActionButtons';
import { useRole } from '../../../hooks/useRole';

export const CategoryTable = ({ categories, isLoading, onEdit, onDelete }) => {
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
      label: 'Tên danh mục',
      renderFunction: (row) => row.name || row.Name || '—',
    },
    {
      key: 'description',
      label: 'Mô tả',
      renderFunction: (row) => row.description || row.Description || '—',
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
      data={categories}
      isLoading={isLoading}
      emptyMessage="Chưa có danh mục nào được tạo"
    />
  );
};

export default CategoryTable;
