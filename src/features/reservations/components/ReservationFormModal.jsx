import React, { useState, useEffect } from 'react';

export const ReservationFormModal = ({ isOpen, onSave, onCancel, isLoading = false }) => {
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUserId('');
      setBookId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      userId: Number(userId),
      bookId: Number(bookId),
    });
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel}></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1045 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg rounded-3">
            <form onSubmit={handleSubmit}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">Tạo phiếu đặt trước sách</h5>
                <button type="button" className="btn-close" onClick={onCancel} disabled={isLoading}></button>
              </div>
              <div className="modal-body row g-3 text-dark">
                <div className="col-12">
                  <label className="form-label text-dark fw-medium small">ID Độc giả <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="VD: 5"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-dark fw-medium small">ID Đầu sách <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="VD: 3"
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer border-top gap-2">
                <button type="button" className="btn btn-sm btn-light" onClick={onCancel} disabled={isLoading}>Hủy</button>
                <button type="submit" className="btn btn-sm btn-primary px-3" disabled={isLoading}>
                  {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                  Xác nhận đặt
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationFormModal;
