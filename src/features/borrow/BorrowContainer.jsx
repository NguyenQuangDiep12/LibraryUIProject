import React, { useState, useEffect } from 'react';
import { borrowApi } from '../../apis/apis';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../hooks/useModal';
import { useRole } from '../../hooks/useRole';
import BorrowTable from './components/BorrowTable';
import BorrowActionModal from './components/BorrowActionModal';
import ConfirmModal from '../../components/common/ConfirmModal';

export const BorrowContainer = () => {
  const { userInfo } = useAuth();
  const { role, isReader, isStaff, isAdmin } = useRole();
  const { showToast } = useToast();

  const currentUserId = userInfo?.userId || userInfo?.UserId;

  // Table Data State
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search / Filter State
  const [keyword, setKeyword] = useState(''); // Borrow Code
  const [readerSearch, setReaderSearch] = useState(''); // Reader Name
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals state using custom useModal hook
  const actionModal = useModal();
  const cancelModal = useModal();
  const [modalMode, setModalMode] = useState('details'); // 'create' | 'details' | 'return' | 'process_extension'
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBorrows();
  }, [page]);

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      let res;
      const params = {
        Page: page,
        PageSize: pageSize,
      };

      if (isReader) {
        res = await borrowApi.getByUser(currentUserId, params);
      } else {
        // Staff/Admin parameters
        const staffParams = {
          ...params,
          BorrowCode: keyword.trim() || null,
          ReaderName: readerSearch.trim() || null,
        };
        res = await borrowApi.getAll(staffParams);
      }

      const data = res.data || res.Data || {};
      setBorrows(data.items || data.Items || []);
      setTotalPages(data.totalPages || data.TotalPages || 1);
      setTotalRecords(data.totalRecords || data.TotalRecords || 0);
    } catch (err) {
      showToast(err.message || 'Lỗi tải danh sách phiếu mượn', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBorrows();
  };

  const handleReset = () => {
    setKeyword('');
    setReaderSearch('');
    setPage(1);
    fetchBorrows();
  };

  const handleViewDetails = async (row) => {
    setLoading(true);
    try {
      const res = await borrowApi.getById(row.borrowId || row.BorrowId);
      setModalMode('details');
      actionModal.openModal(res.data || res.Data);
    } catch (err) {
      showToast(err.message || 'Lỗi tải chi tiết phiếu mượn', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestExtension = async (row) => {
    if (!window.confirm('Bạn có chắc chắn muốn gửi yêu cầu gia hạn cho phiếu mượn này?')) return;
    try {
      await borrowApi.requestExtension(row.borrowId || row.BorrowId);
      showToast('Gửi yêu cầu gia hạn thành công!', 'SUCCESS');
      fetchBorrows();
    } catch (err) {
      showToast(err.message || 'Lỗi gửi yêu cầu gia hạn', 'DANGER');
    }
  };

  const handleOpenReturn = async (row) => {
    setLoading(true);
    try {
      const res = await borrowApi.getById(row.borrowId || row.BorrowId);
      setModalMode('return');
      actionModal.openModal(res.data || res.Data);
    } catch (err) {
      showToast(err.message || 'Lỗi tải chi tiết phiếu mượn', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProcessExtension = (row) => {
    setModalMode('process_extension');
    actionModal.openModal(row);
  };

  const handleSaveAction = async (payload) => {
    setActionLoading(true);
    try {
      const recordId = actionModal.modalData?.borrowId || actionModal.modalData?.BorrowId;
      if (modalMode === 'create') {
        await borrowApi.create(payload);
        showToast('Tạo phiếu mượn mới thành công', 'SUCCESS');
      } else if (modalMode === 'return') {
        await borrowApi.confirmReturn(recordId, payload);
        showToast('Xác nhận trả sách thành công', 'SUCCESS');
      } else if (modalMode === 'process_extension') {
        await borrowApi.extend(recordId, payload);
        showToast('Xử lý yêu cầu gia hạn thành công', 'SUCCESS');
      }
      actionModal.closeModal();
      fetchBorrows();
    } catch (err) {
      showToast(err.message || 'Lỗi thao tác trên phiếu mượn', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRecord = async () => {
    setActionLoading(true);
    try {
      const recordId = cancelModal.modalData?.borrowId || cancelModal.modalData?.BorrowId;
      await borrowApi.cancel(recordId);
      showToast('Hủy phiếu mượn thành công', 'SUCCESS');
      cancelModal.closeModal();
      fetchBorrows();
    } catch (err) {
      showToast(err.message || 'Lỗi hủy phiếu mượn', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-2">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
        <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Lịch sử mượn trả sách</h6>
        {(isStaff || isAdmin) && (
          <button className="btn btn-primary d-flex align-items-center gap-1 px-3 py-1.5 rounded-1" onClick={() => { setModalMode('create'); actionModal.openModal(null); }}>
            <span className="fs-5 lh-1">+</span> Tạo phiếu mượn
          </button>
        )}
      </div>

      <div className="card-body p-0">
        {/* Search bar (only show to Staff/Admin) */}
        {!isReader && (
          <form onSubmit={handleSearch} className="px-4 py-3 border-bottom bg-white d-flex gap-2 flex-wrap">
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: '250px' }}
              placeholder="Mã phiếu mượn..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: '250px' }}
              placeholder="Tên độc giả..."
              value={readerSearch}
              onChange={(e) => setReaderSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-outline-primary px-3 bg-white">Tìm</button>
            <button type="button" className="btn btn-outline-secondary px-3 bg-white" onClick={handleReset}>Đặt lại</button>
          </form>
        )}

        <BorrowTable
          borrows={borrows}
          isLoading={loading}
          onViewDetails={handleViewDetails}
          onRequestExtension={handleRequestExtension}
          onConfirmReturn={handleOpenReturn}
          onCancelRecord={cancelModal.openModal}
          onProcessExtension={handleOpenProcessExtension}
        />
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="card-footer bg-light border-top px-4 py-3 d-flex justify-content-between align-items-center">
          <span className="text-secondary small">Hiển thị {borrows.length} / {totalRecords} phiếu mượn</span>
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

      {/* Actions Modal (Create / Return / Process Extension / View details) */}
      <BorrowActionModal
        isOpen={actionModal.isOpen}
        mode={modalMode}
        initialData={actionModal.modalData}
        onSave={handleSaveAction}
        onCancel={actionModal.closeModal}
        isLoading={actionLoading}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModal.isOpen}
        title="Hủy phiếu mượn"
        message={`Bạn có chắc chắn muốn hủy phiếu mượn "${cancelModal.modalData?.borrowCode || cancelModal.modalData?.BorrowCode}"?`}
        onConfirm={handleCancelRecord}
        onCancel={cancelModal.closeModal}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default BorrowContainer;
