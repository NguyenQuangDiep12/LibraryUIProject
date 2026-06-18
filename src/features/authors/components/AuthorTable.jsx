import React from 'react';
import DataTable from '../../../components/common/DataTable';
import ActionButtons from '../../../components/common/ActionButtons';
import { useRole } from '../../../hooks/useRole';

export const AuthorTable = ({ authors, isLoading, onEdit, onDelete }) => {
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
      label: 'Tác giả',
      renderFunction: (row) => row.name || row.Name || row.authorName || row.AuthorName || '—',
    },
    {
      key: 'biography',
      label: 'Tiểu sử',
      renderFunction: (row) => row.biography || row.Biography || '—',
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
      data={authors}
      isLoading={isLoading}
      emptyMessage="Chưa có tác giả nào được tạo"
    />
  );
};

export default AuthorTable;
