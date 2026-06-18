import React, { useState, useEffect } from 'react';
import { fineApi } from '../../apis/apis';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../hooks/useModal';
import { useRole } from '../../hooks/useRole';
import FineTable from './components/FineTable';
import FineFormModal from './components/FineFormModal';

export const FineContainer = () => {
  const { showToast } = useToast();
  const { isAdmin, isStaff } = useRole();

  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const formModal = useModal();
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchFines();
  }, [page]);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const res = await fineApi.getAll({ Page: page, PageSize: pageSize });
      const data = res.data || res.Data || {};
      setFines(data.items || data.Items || []);
      setTotalPages(data.totalPages || data.TotalPages || 1);
      setTotalRecords(data.totalRecords || data.TotalRecords || 0);
    } catch (err) {
      showToast(err.message || 'Lỗi tải phiếu phạt', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      await fineApi.create(formData);
      showToast('Tạo phiếu phạt thành công', 'SUCCESS');
      formModal.closeModal();
      fetchFines();
    } catch (err) {
      showToast(err.message || 'Lỗi tạo phiếu phạt', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePay = async (row) => {
    if (!window.confirm('Xác nhận thu tiền phạt cho độc giả này?')) return;
    try {
      const id = row.fineId || row.FineId;
      await fineApi.pay(id);
      showToast('Thu tiền phạt thành công', 'SUCCESS');
      fetchFines();
    } catch (err) {
      showToast(err.message || 'Lỗi thu tiền phạt', 'DANGER');
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-2">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
        <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Danh sách phiếu phạt vi phạm</h6>
        {(isAdmin || isStaff) && (
          <button className="btn btn-primary d-flex align-items-center gap-1 px-3 py-1.5 rounded-1" onClick={() => formModal.openModal(null)}>
            <span className="fs-5 lh-1">+</span> Tạo phạt
          </button>
        )}
      </div>

      <div className="card-body p-0">
        <FineTable
          fines={fines}
          isLoading={loading}
          onPay={handlePay}
        />
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="card-footer bg-light border-top px-4 py-3 d-flex justify-content-between align-items-center">
          <span className="text-secondary small">Hiển thị {fines.length} / {totalRecords} phiếu phạt</span>
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

      <FineFormModal
        isOpen={formModal.isOpen}
        onSave={handleSave}
        onCancel={formModal.closeModal}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default FineContainer;
