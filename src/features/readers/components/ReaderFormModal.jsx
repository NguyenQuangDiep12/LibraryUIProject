import React, { useState, useEffect } from 'react';

export const ReaderFormModal = ({
  isOpen,
  mode = 'details',
  initialData = null,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName || initialData.FullName || '');
      setPhone(initialData.phone || initialData.Phone || '');
      setAddress(initialData.address || initialData.Address || '');
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel}></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1045 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg rounded-3 text-dark">
            
            {/* DETAILS MODE */}
            {mode === 'details' && initialData && (
              <>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-dark">Chi tiết độc giả</h5>
                  <button type="button" className="btn-close" onClick={onCancel}></button>
                </div>
                <div className="modal-body row g-3 text-dark">
                  <div className="col-12 text-center mb-2">
                    <img
                      src={initialData.avatarUrl || initialData.AvatarUrl || 'https://via.placeholder.com/80'}
                      alt="Avatar"
                      className="rounded-circle border"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <span className="text-secondary small">Họ tên</span>
                    <div className="fw-semibold">{initialData.fullName || initialData.FullName}</div>
                  </div>
                  <div className="col-md-6">
                    <span className="text-secondary small">Email</span>
                    <div>{initialData.email || initialData.Email}</div>
                  </div>
                  <div className="col-md-6">
                    <span className="text-secondary small">Số điện thoại</span>
                    <div>{initialData.phone || initialData.Phone || '—'}</div>
                  </div>
                  <div className="col-md-6">
                    <span className="text-secondary small">Địa chỉ</span>
                    <div>{initialData.address || initialData.Address || '—'}</div>
                  </div>
                  <div className="col-md-6">
                    <span className="text-secondary small">Mã thẻ</span>
                    <div className="fw-mono fw-bold">{initialData.libraryCardCode || initialData.LibraryCardCode || 'Chưa cấp thẻ'}</div>
                  </div>
                  <div className="col-md-6">
                    <span className="text-secondary small">Trạng thái thẻ</span>
                    <div>{initialData.cardStatus || initialData.CardStatus || '—'}</div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-sm btn-light px-3" onClick={onCancel}>Đóng</button>
                </div>
              </>
            )}

            {/* EDIT MODE */}
            {mode === 'edit' && (
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-dark">Cập nhật hồ sơ độc giả</h5>
                  <button type="button" className="btn-close" onClick={onCancel} disabled={isLoading}></button>
                </div>
                <div className="modal-body row g-3">
                  <div className="col-12">
                    <label className="form-label text-dark fw-medium small">Họ tên <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-medium small">Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-medium small">Địa chỉ</label>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer border-top gap-2">
                  <button type="button" className="btn btn-sm btn-light" onClick={onCancel} disabled={isLoading}>Hủy</button>
                  <button type="submit" className="btn btn-sm btn-primary px-3" disabled={isLoading || !fullName.trim()}>
                    {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Cập nhật
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default ReaderFormModal;
