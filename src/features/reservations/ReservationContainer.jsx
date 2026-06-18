import React, { useState, useEffect } from 'react';
import { reservationApi } from '../../apis/apis';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../hooks/useModal';
import { useRole } from '../../hooks/useRole';
import ReservationTable from './components/ReservationTable';
import ReservationFormModal from './components/ReservationFormModal';

export const ReservationContainer = () => {
  const { showToast } = useToast();
  const { isAdmin, isStaff } = useRole();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const formModal = useModal();
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, [page]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await reservationApi.getAll({ Page: page, PageSize: pageSize });
      const data = res.data || res.Data || {};
      setReservations(data.items || data.Items || []);
      setTotalPages(data.totalPages || data.TotalPages || 1);
      setTotalRecords(data.totalRecords || data.TotalRecords || 0);
    } catch (err) {
      showToast('error', err.message || 'Lỗi tải đặt trước');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      await reservationApi.create(formData);
      showToast('success', 'Tạo phiếu đặt trước thành công');
      formModal.closeModal();
      fetchReservations();
    } catch (err) {
      showToast('error', err.message || 'Lỗi đặt trước sách');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (row) => {
    if (!window.confirm('Xác nhận độc giả đã đến nhận sách? Hệ thống sẽ chuyển phiếu đặt trước thành phiếu mượn.')) return;
    try {
      const id = row.reservationId || row.ReservationId;
      await reservationApi.complete(id);
      showToast('success', 'Nhận sách thành công. Đã tự động tạo phiếu mượn!');
      fetchReservations();
    } catch (err) {
      showToast('error', err.message || 'Lỗi nhận sách đặt trước');
    }
  };

  const handleCancel = async (row) => {
    if (!window.confirm('Hủy phiếu đặt trước sách này?')) return;
    try {
      const id = row.reservationId || row.ReservationId;
      await reservationApi.cancel(id);
      showToast('success', 'Hủy đặt trước thành công');
      fetchReservations();
    } catch (err) {
      showToast('error', err.message || 'Lỗi hủy đặt trước');
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-2">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
        <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Danh sách đặt trước sách</h6>
        {(isAdmin || isStaff) && (
          <button className="btn btn-primary d-flex align-items-center gap-1 px-3 py-1.5 rounded-1" onClick={formModal.openModal}>
            <span className="fs-5 lh-1">+</span> Tạo đặt trước
          </button>
        )}
      </div>

      <div className="card-body p-0">
        <ReservationTable
          reservations={reservations}
          isLoading={loading}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="card-footer bg-light border-top px-4 py-3 d-flex justify-content-between align-items-center">
          <span className="text-secondary small">Hiển thị {reservations.length} / {totalRecords} đặt trước</span>
          <div className="btn-group btn-group-sm">
            <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Trước
            </button>
            <span className="btn btn-light disabled text-dark px-3 fw-medium">
              Trang {page} / {totalPages}
            </span>
            <button className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Sau
            </button>
          </div>
        </div>
      )}

      <ReservationFormModal
        isOpen={formModal.isOpen}
        onSave={handleSave}
        onCancel={formModal.closeModal}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default ReservationContainer;
