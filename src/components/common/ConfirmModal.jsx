import React from 'react';

export const ConfirmModal = ({
  isOpen,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onCancel}
      ></div>

      {/* Modal Dialog */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1055, top: '20%' }}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
          <div className="modal-content border-0 shadow-lg rounded-3">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold text-dark">{title}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onCancel}
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body py-3 text-secondary">
              <p className="mb-0">{message}</p>
            </div>
            <div className="modal-footer border-top-0 pt-0 gap-2">
              <button
                type="button"
                className="btn btn-light px-3 py-1.5 rounded-1 text-secondary fw-semibold small"
                onClick={onCancel}
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-danger px-3 py-1.5 rounded-1 fw-semibold small d-flex align-items-center gap-1"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
