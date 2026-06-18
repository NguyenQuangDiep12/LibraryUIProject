import React, { useState, useEffect } from 'react';

export const PublisherFormModal = ({
  isOpen,
  mode = 'add',
  initialData = null,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setName(initialData.name || initialData.Name || '');
    } else {
      setName('');
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name: name.trim() });
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel}></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1045 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg rounded-3">
            <form onSubmit={handleSubmit}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">
                  {mode === 'edit' ? 'Cập nhật nhà xuất bản' : 'Thêm nhà xuất bản mới'}
                </h5>
                <button type="button" className="btn-close" onClick={onCancel} disabled={isLoading}></button>
              </div>
              <div className="modal-body row g-3">
                <div className="col-12">
                  <label className="form-label text-dark fw-medium small">Tên nhà xuất bản <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer border-top gap-2">
                <button type="button" className="btn btn-sm btn-light" onClick={onCancel} disabled={isLoading}>Hủy</button>
                <button type="submit" className="btn btn-sm btn-primary px-3" disabled={isLoading || !name.trim()}>
                  {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublisherFormModal;
