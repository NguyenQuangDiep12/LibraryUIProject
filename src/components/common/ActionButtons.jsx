import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}) => {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      {showView && onView && (
        <button
          className="btn btn-sm btn-outline-info p-1 rounded-1 d-flex align-items-center justify-content-center"
          title="Xem chi tiết"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          style={{ width: '32px', height: '32px' }}
        >
          <FontAwesomeIcon icon={faPlus}/>
        </button>
      )}

      {showEdit && onEdit && (
        <button
          className="btn btn-sm btn-outline-warning p-1 rounded-1 d-flex align-items-center justify-content-center"
          title="Sửa"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          style={{ width: '32px', height: '32px' }}
        >
          <FontAwesomeIcon icon={faPenToSquare}/>
        </button>
      )}

      {showDelete && onDelete && (
        <button
          className="btn btn-sm btn-outline-danger p-1 rounded-1 d-flex align-items-center justify-content-center"
          title="Xóa"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{ width: '32px', height: '32px' }}
        >
          <FontAwesomeIcon icon={faTrash}/>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
