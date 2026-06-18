import React, { useState, useEffect } from 'react';
import { userApi } from '../../apis/apis';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../hooks/useModal';
import { useRole } from '../../hooks/useRole';
import ReaderTable from './components/ReaderTable';
import ReaderFormModal from './components/ReaderFormModal';

export const ReaderContainer = () => {
  const { showToast } = useToast();
  const { isAdmin } = useRole();
  
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search states
  const [nameSearch, setNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const formModal = useModal();
  const [modalMode, setModalMode] = useState('details');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReaders();
  }, [page]);

  const fetchReaders = async () => {
    setLoading(true);
    try {
      const params = {
        FullName: nameSearch.trim() || null,
        Email: emailSearch.trim() || null,
        RoleName: 'READER',
        Page: page,
        PageSize: pageSize,
      };
      const res = await userApi.getAll(params);
      const data = res.data || res.Data || {};
      setReaders(data.items || data.Items || []);
      setTotalPages(data.totalPages || data.TotalPages || 1);
      setTotalRecords(data.totalRecords || data.TotalRecords || 0);
    } catch (err) {
      showToast(err.message || 'Lỗi tải danh sách độc giả', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReaders();
  };

  const handleReset = () => {
    setNameSearch('');
    setEmailSearch('');
    setPage(1);
  };

  const handleOpenDetails = async (row) => {
    setLoading(true);
    try {
      const res = await userApi.getById(row.id || row.Id);
      setModalMode('details');
      formModal.openModal(res.data || res.Data);
    } catch (err) {
      showToast(err.message || 'Lỗi tải chi tiết độc giả', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (row) => {
    setModalMode('edit');
    formModal.openModal(row);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      const id = formModal.modalData.id || formModal.modalData.Id;
      await userApi.update(id, formData);
      showToast('Cập nhật thông tin độc giả thành công', 'SUCCESS');
      formModal.closeModal();
      fetchReaders();
    } catch (err) {
      showToast(err.message || 'Lỗi lưu thông tin độc giả', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (row) => {
    const currentStatus = row.status || row.Status;
    const nextStatus = currentStatus?.toUpperCase() === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    const msg = nextStatus === 'ACTIVE' ? 'Mở khóa tài khoản?' : 'Khóa tài khoản độc giả?';
    if (!window.confirm(msg)) return;

    try {
      // updateStatus: (id, status) => apiClient.patch(`/users/${id}/status`, { status })
      // On backend: public async Task<IActionResult> UpdateUserStatus([FromRoute] int id, [FromBody] UpdateUserStatusRequest request)
      // DTO expects request body: { Status: nextStatus } (or deserialized enum index)
      // We will pass the status value. Since backend DTO is UpdateUserStatusRequest:
      // public class UpdateUserStatusRequest { public UserStatus Status { get; set; } }
      // Sending Status as number or string. Let's send the string: nextStatus (ACTIVE = 0, LOCKED = 1).
      // Wait, let's verify if userApi.updateStatus takes (id, status)
      // Yes, in apis.js: updateStatus: (id, status) => apiClient.patch(`/users/${id}/status`, { status })
      // So status gets wrapped in an object like { status: status }.
      // Wait, let's check if the casing of parameter on backend expects Status or status.
      // ASP.NET Core deserializes camelCase, so { status: nextStatus } works perfectly!
      const id = row.id || row.Id;
      await userApi.updateStatus(id, nextStatus);
      showToast('Cập nhật trạng thái tài khoản thành công', 'SUCCESS');
      fetchReaders();
    } catch (err) {
      showToast(err.message || 'Lỗi cập nhật trạng thái tài khoản', 'DANGER');
    }
  };

  const handleToggleCardStatus = async (row) => {
    const currentStatus = row.cardStatus || row.CardStatus;
    const nextStatus = currentStatus?.toUpperCase() === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const msg = nextStatus === 'ACTIVE' ? 'Mở khóa thẻ thư viện?' : 'Khóa thẻ thư viện?';
    if (!window.confirm(msg)) return;

    try {
      const id = row.id || row.Id;
      await userApi.updateCardStatus(id, nextStatus);
      showToast('Cập nhật trạng thái thẻ thành công', 'SUCCESS');
      fetchReaders();
    } catch (err) {
      showToast(err.message || 'Lỗi cập nhật trạng thái thẻ', 'DANGER');
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-2">
      <div className="card-header bg-white px-4 py-3 border-bottom">
        <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Danh sách độc giả</h6>
      </div>

      <div className="card-body p-0">
        <form onSubmit={handleSearch} className="px-4 py-3 border-bottom bg-white d-flex gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: '250px' }}
            placeholder="Họ tên độc giả..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: '250px' }}
            placeholder="Email độc giả..."
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-primary px-3 bg-white">Tìm</button>
          <button type="button" className="btn btn-outline-secondary px-3 bg-white" onClick={handleReset}>Đặt lại</button>
        </form>

        <ReaderTable
          readers={readers}
          isLoading={loading}
          onViewDetails={handleOpenDetails}
          onEdit={isAdmin ? handleOpenEdit : null}
          onToggleStatus={handleToggleStatus}
          onToggleCardStatus={handleToggleCardStatus}
        />
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="card-footer bg-light border-top px-4 py-3 d-flex justify-content-between align-items-center">
          <span className="text-secondary small">Hiển thị {readers.length} / {totalRecords} độc giả</span>
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

      {/* Details & Edit Modal */}
      <ReaderFormModal
        isOpen={formModal.isOpen}
        mode={modalMode}
        initialData={formModal.modalData}
        onSave={handleSave}
        onCancel={formModal.closeModal}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default ReaderContainer;
