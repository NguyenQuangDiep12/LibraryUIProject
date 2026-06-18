import React, { useState, useEffect } from 'react';
import { bookCopyApi } from '../../../apis/apis';
import apiClient from '../../../apis/axiosClient';
import { useToast } from '../../../contexts/ToastContext';
import { useRole } from '../../../hooks/useRole';

export const BookCopiesModal = ({ isOpen, book, onCancel }) => {
  const { showToast } = useToast();
  const { isAdmin } = useRole();
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Copy Form State
  const [addForm, setAddForm] = useState({ quantity: 1, shelfLocation: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isOpen && book) {
      fetchCopies();
    }
  }, [isOpen, book]);

  const fetchCopies = async () => {
    setLoading(true);
    try {
      const res = await bookCopyApi.getAll({ BookId: book.bookId || book.BookId });
      setCopies(res.data?.items || res.Data?.Items || []);
    } catch (err) {
      showToast(err.message || 'Lỗi tải bản sao', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCopy = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await bookCopyApi.create(book.bookId || book.BookId, {
        quantity: Number(addForm.quantity),
        shelfLocation: addForm.shelfLocation.trim() || null,
      });
      showToast('Thêm bản sao thành công', 'SUCCESS');
      setAddForm({ quantity: 1, shelfLocation: '' });
      fetchCopies();
    } catch (err) {
      showToast(err.message || 'Lỗi thêm bản sao', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (copyId, status) => {
    try {
      await bookCopyApi.updateStatus(copyId, status);
      showToast('Cập nhật trạng thái bản sao thành công', 'SUCCESS');
      fetchCopies();
    } catch (err) {
      showToast(err.message || 'Lỗi cập nhật trạng thái', 'DANGER');
    }
  };

  const handleDeleteCopy = async (copyId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bản sao này?')) return;
    try {
      await apiClient.delete(`/book-copies/${copyId}`);
      showToast('Xóa bản sao thành công', 'SUCCESS');
      fetchCopies();
    } catch (err) {
      showToast(err.message || 'Lỗi xóa bản sao', 'DANGER');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel}></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1045 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg rounded-3">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold text-dark">
                Bản sao vật lý: {book.title || book.Title}
              </h5>
              <button type="button" className="btn-close" onClick={onCancel} disabled={actionLoading}></button>
            </div>

            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
              {/* Form thêm bản sao */}
              <form onSubmit={handleAddCopy} className="row g-3 mb-4 p-3 bg-light rounded-2 align-items-end">
                <div className="col-md-4">
                  <label className="form-label text-dark fw-medium small">Số lượng bản sao</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min="1"
                    max="100"
                    value={addForm.quantity}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, quantity: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-5">
                  <label className="form-label text-dark fw-medium small">Vị trí kệ sách</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="VD: Kệ A1-Tầng 3"
                    value={addForm.shelfLocation}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, shelfLocation: e.target.value }))}
                  />
                </div>
                <div className="col-md-3">
                  <button type="submit" className="btn btn-sm btn-primary w-100 py-1.5 fw-semibold" disabled={actionLoading}>
                    {actionLoading ? 'Đang thêm...' : '+ Thêm bản sao'}
                  </button>
                </div>
              </form>

              {/* Danh sách bản sao hiện tại */}
              <h6 className="fw-semibold text-dark mb-3">Danh sách bản sao ({copies.length})</h6>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                  <span className="text-secondary small">Đang tải danh sách bản sao...</span>
                </div>
              ) : copies.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="small text-muted py-2 px-3">MÃ BẢN SAO</th>
                        <th className="small text-muted py-2 px-3">VỊ TRÍ</th>
                        <th className="small text-muted py-2 px-3">TÌNH TRẠNG</th>
                        <th className="small text-muted py-2 px-3">TRẠNG THÁI</th>
                        <th className="small text-muted py-2 px-3 text-center">THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {copies.map((c) => {
                        const copyId = c.copyId ?? c.CopyId;
                        const barcode = c.barcode ?? c.Barcode ?? `BC-${copyId}`;
                        const location = c.shelfLocation ?? c.ShelfLocation ?? 'Chưa xếp kệ';
                        const cond = c.condition ?? c.Condition ?? 'NORMAL';
                        const stat = c.status ?? c.Status ?? 'AVAILABLE';

                        return (
                          <tr key={copyId}>
                            <td className="px-3 py-2 fw-medium text-dark">{barcode}</td>
                            <td className="px-3 py-2 text-secondary small">{location}</td>
                            <td className="px-3 py-2">
                              <span className="small text-dark">{cond}</span>
                            </td>
                            <td className="px-3 py-2">
                              <select
                                className="form-select form-select-sm"
                                style={{ width: '130px', fontSize: '0.8rem' }}
                                value={stat}
                                onChange={(e) => handleUpdateStatus(copyId, e.target.value)}
                              >
                                <option value="AVAILABLE">Sẵn sàng</option>
                                <option value="BORROWED" disabled>Đang mượn</option>
                                <option value="RESERVED" disabled>Đặt trước</option>
                                <option value="UNAVAILABLE">Tạm khóa</option>
                              </select>
                            </td>
                            <td className="px-3 py-2 text-center">
                              {isAdmin && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger p-1 rounded"
                                  title="Xóa bản sao"
                                  onClick={() => handleDeleteCopy(copyId)}
                                  style={{ width: '28px', height: '28px' }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">
                  Đầu sách này chưa có bản sao vật lý nào.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookCopiesModal;
