import React, { useState, useEffect } from 'react';

export const FineFormModal = ({ isOpen, onSave, onCancel, isLoading = false }) => {
  const [borrowDetailId, setBorrowDetailId] = useState('');
  const [fineType, setFineType] = useState('DAMAGED');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setBorrowDetailId('');
      setFineType('DAMAGED');
      setAmount('');
      setReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      borrowDetailId: Number(borrowDetailId),
      fineType,
      amount: Number(amount),
      reason: reason.trim(),
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
                <h5 className="modal-title fw-bold text-dark">Tạo phiếu phạt mới</h5>
                <button type="button" className="btn-close" onClick={onCancel} disabled={isLoading}></button>
              </div>
              <div className="modal-body row g-3">
                <div className="col-md-6">
                  <label className="form-label text-dark fw-medium small">ID Chi tiết mượn <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="VD: 12"
                    value={borrowDetailId}
                    onChange={(e) => setBorrowDetailId(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-dark fw-medium small">Loại vi phạm <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={fineType}
                    onChange={(e) => setFineType(e.target.value)}
                    required
                  >
                    <option value="DAMAGED">Hỏng sách</option>
                    <option value="LOST">Mất sách</option>
                    <option value="OVERDUE">Quá hạn</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label text-dark fw-medium small">Số tiền phạt (1,000 - 1,000,000đ) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    min="1000"
                    max="1000000"
                    placeholder="VD: 50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-dark fw-medium small">Lý do phạt <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Nêu rõ lý do (Ví dụ: Làm mất sách, rách bìa...)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-top gap-2">
                <button type="button" className="btn btn-sm btn-light" onClick={onCancel} disabled={isLoading}>Hủy</button>
                <button type="submit" className="btn btn-sm btn-primary px-3" disabled={isLoading}>
                  {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                  Tạo phạt
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FineFormModal;
