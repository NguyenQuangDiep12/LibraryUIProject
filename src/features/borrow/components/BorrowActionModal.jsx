import React, { useState, useEffect } from 'react';

export const BorrowActionModal = ({
  isOpen,
  mode = 'details', // 'create' | 'details' | 'return' | 'process_extension'
  initialData = null, // borrow record info
  onSave, // callback to save
  onCancel,
  isLoading = false,
}) => {
  // 1. Create mode state
  const [createForm, setCreateForm] = useState({ readerId: '', copyIdsStr: '', borrowType: 'TAKEHOME' });
  
  // 2. Return mode state
  const [returnItems, setReturnItems] = useState([]); // Array of { copyId, condition, fineAmount, fineReason }
  
  // 3. Extension approval state
  const [extForm, setExtForm] = useState({ isApproved: true, reason: '' });

  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'create') {
      setCreateForm({ readerId: '', copyIdsStr: '', borrowType: 'TAKEHOME' });
    } else if (mode === 'return' && initialData?.details) {
      // Pre-fill return list from borrow details
      const items = initialData.details.map((item) => ({
        copyId: item.copyId ?? item.CopyId,
        title: item.bookTitle ?? item.BookTitle ?? '',
        barcode: item.barcode ?? item.Barcode ?? '',
        condition: 'NORMAL',
        copyStatus: 'AVAILABLE',
        fineAmount: '',
        fineReason: '',
      }));
      setReturnItems(items);
    } else if (mode === 'process_extension') {
      setExtForm({ isApproved: true, reason: '' });
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const ids = createForm.copyIdsStr
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x !== '')
      .map(Number);

    onSave({
      readerId: Number(createForm.readerId),
      copyIds: ids,
      borrowType: createForm.borrowType,
    });
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    const formattedItems = returnItems.map((item) => ({
      copyId: item.copyId,
      condition: item.condition,
      copyStatus: item.copyStatus,
      fineAmount: item.fineAmount ? Number(item.fineAmount) : null,
      fineReason: item.fineReason ? item.fineReason.trim() : null,
    }));
    onSave({ returnItems: formattedItems });
  };

  const handleExtSubmit = (e) => {
    e.preventDefault();
    onSave({
      isApproved: extForm.isApproved,
      reason: extForm.isApproved ? null : extForm.reason.trim(),
    });
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel}></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1045 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg rounded-3">
            
            {/* --- 1. DETAILS MODE --- */}
            {mode === 'details' && initialData && (
              <>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-dark">Chi tiết phiếu mượn: {initialData.borrowCode || initialData.BorrowCode}</h5>
                  <button type="button" className="btn-close" onClick={onCancel}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="text-secondary small">Độc giả</div>
                      <div className="fw-semibold text-dark">{initialData.readerName || initialData.ReaderName} (ID: {initialData.readerId || initialData.ReaderId})</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-secondary small">Hình thức mượn</div>
                      <div className="fw-semibold text-dark">{(initialData.borrowType || initialData.BorrowType) === 'TAKEHOME' ? 'Mang về' : 'Đọc tại chỗ'}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-secondary small">Ngày mượn / Hạn trả</div>
                      <div className="fw-semibold text-dark">
                        {initialData.borrowDate ? new Date(initialData.borrowDate).toLocaleDateString('vi-VN') : '—'} / {new Date(initialData.dueDate || initialData.DueDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-secondary small">Ngày trả thực tế</div>
                      <div className="fw-semibold text-success">
                        {initialData.returnedDate ? new Date(initialData.returnedDate).toLocaleDateString('vi-VN') : 'Chưa trả'}
                      </div>
                    </div>
                  </div>

                  <h6 className="fw-bold text-dark mb-2">Danh sách sách mượn</h6>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle">
                      <thead className="table-light">
                        <tr>
                          <th className="small text-secondary px-3 py-2">Tên sách</th>
                          <th className="small text-secondary px-3 py-2">Mã bản sao</th>
                          <th className="small text-secondary px-3 py-2">Trạng thái trả</th>
                          <th className="small text-secondary px-3 py-2">Phạt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {initialData.details?.map((d, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2 text-dark">{d.bookTitle || d.BookTitle}</td>
                            <td className="px-3 py-2 text-secondary small">{d.barcode || d.Barcode}</td>
                            <td className="px-3 py-2 text-secondary small">
                              {d.returnDate ? `Đã trả (${new Date(d.returnDate).toLocaleDateString('vi-VN')})` : 'Chưa trả'}
                              {d.condition && d.condition !== 'NORMAL' && <span className="text-danger ms-1">({d.condition})</span>}
                            </td>
                            <td className="px-3 py-2 text-danger small">
                              {d.fineAmount ? `${d.fineAmount.toLocaleString('vi-VN')}đ (${d.fineReason})` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-sm btn-light px-3" onClick={onCancel}>Đóng</button>
                </div>
              </>
            )}

            {/* --- 2. CREATE MODE --- */}
            {mode === 'create' && (
              <form onSubmit={handleCreateSubmit}>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-dark">Tạo phiếu mượn mới</h5>
                  <button type="button" className="btn-close" onClick={onCancel} disabled={isLoading}></button>
                </div>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-medium small">ID Độc giả <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="VD: 5"
                      value={createForm.readerId}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, readerId: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-medium small">Hình thức mượn <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={createForm.borrowType}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, borrowType: e.target.value }))}
                      required
                    >
                      <option value="TAKEHOME">Mang về nhà</option>
                      <option value="READINGONSITE">Đọc tại chỗ</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label text-dark fw-medium small">Mã bản sao vật lý (IDs - phân cách bằng dấu phẩy) <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ví dụ: 12, 15, 17"
                      value={createForm.copyIdsStr}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, copyIdsStr: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-top gap-2">
                  <button type="button" className="btn btn-sm btn-light" onClick={onCancel} disabled={isLoading}>Hủy</button>
                  <button type="submit" className="btn btn-sm btn-primary px-3" disabled={isLoading}>
                    {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Xác nhận tạo
                  </button>
                </div>
              </form>
            )}

            {/* --- 3. RETURN MODE --- */}
            {mode === 'return' && (
              <form onSubmit={handleReturnSubmit}>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-dark">Xác nhận trả sách</h5>
                  <button type="button" className="btn-close" onClick={onCancel} disabled={isLoading}></button>
                </div>
                <div className="modal-body">
                  <p className="small text-secondary mb-3">Kiểm tra tình trạng vật lý của sách khi nhận lại từ độc giả để thiết lập phạt nếu hư hỏng/mất.</p>
                  
                  {returnItems.map((item, idx) => (
                    <div className="card mb-3 p-3 bg-light border-0 rounded-2" key={item.copyId}>
                      <div className="fw-semibold text-dark mb-2">{item.title} ({item.barcode})</div>
                      <div className="row g-2">
                        <div className="col-md-4">
                          <label className="small text-secondary">Tình trạng vật lý</label>
                          <select
                            className="form-select form-select-sm"
                            value={item.condition}
                            onChange={(e) => {
                              const val = e.target.value;
                              setReturnItems((prev) =>
                                prev.map((x, i) => (i === idx ? { ...x, condition: val } : x))
                              );
                            }}
                          >
                            <option value="NORMAL">Bình thường</option>
                            <option value="TORN">Bị rách</option>
                            <option value="DAMAGED">Hư hỏng</option>
                            <option value="LOST">Làm mất</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="small text-secondary">Số tiền phạt (nếu có)</label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            placeholder="đ"
                            value={item.fineAmount}
                            onChange={(e) => {
                              const val = e.target.value;
                              setReturnItems((prev) =>
                                prev.map((x, i) => (i === idx ? { ...x, fineAmount: val } : x))
                              );
                            }}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="small text-secondary">Lý do phạt</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="VD: Rách trang 12"
                            value={item.fineReason}
                            onChange={(e) => {
                              const val = e.target.value;
                              setReturnItems((prev) =>
                                prev.map((x, i) => (i === idx ? { ...x, fineReason: val } : x))
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer border-top gap-2">
                  <button type="button" className="btn btn-sm btn-light" onClick={onCancel} disabled={isLoading}>Hủy</button>
                  <button type="submit" className="btn btn-sm btn-success px-3" disabled={isLoading}>
                    {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Xác nhận hoàn thành trả
                  </button>
                </div>
              </form>
            )}

            {/* --- 4. PROCESS EXTENSION MODE --- */}
            {mode === 'process_extension' && (
              <form onSubmit={handleExtSubmit}>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-dark">Duyệt yêu cầu gia hạn sách</h5>
                  <button type="button" className="btn-close" onClick={onCancel} disabled={isLoading}></button>
                </div>
                <div className="modal-body row g-3">
                  <div className="col-md-12">
                    <label className="form-label text-dark fw-medium small">Kết quả duyệt <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={extForm.isApproved ? 'true' : 'false'}
                      onChange={(e) => setExtForm((prev) => ({ ...prev, isApproved: e.target.value === 'true' }))}
                      required
                    >
                      <option value="true">Đồng ý gia hạn</option>
                      <option value="false">Từ chối yêu cầu</option>
                    </select>
                  </div>
                  {!extForm.isApproved && (
                    <div className="col-md-12">
                      <label className="form-label text-dark fw-medium small">Lý do từ chối gia hạn <span className="text-danger">*</span></label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Nêu rõ lý do từ chối để gửi thông báo..."
                        value={extForm.reason}
                        onChange={(e) => setExtForm((prev) => ({ ...prev, reason: e.target.value }))}
                        required
                      ></textarea>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-top gap-2">
                  <button type="button" className="btn btn-sm btn-light" onClick={onCancel} disabled={isLoading}>Hủy</button>
                  <button type="submit" className="btn btn-sm btn-primary px-3" disabled={isLoading}>
                    {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Lưu kết quả
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

export default BorrowActionModal;
