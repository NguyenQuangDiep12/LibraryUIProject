import React, { useState, useEffect } from 'react';
import { userApi } from '../../apis/apis';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../hooks/useModal';
import { useRole } from '../../hooks/useRole';
import StaffTable from './components/StaffTable';
import StaffFormModal from './components/StaffFormModal';

export const StaffContainer = () => {
  const { showToast } = useToast();
  const { isAdmin } = useRole();

  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search states
  const [nameSearch, setNameSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const formModal = useModal();
  const [modalMode, setModalMode] = useState('add');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStaffs();
  }, [page]);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const params = {
        FullName: nameSearch.trim() || null,
        Email: emailSearch.trim() || null,
        Page: page,
        PageSize: pageSize,
      };
      // userApi.getStaffs calls GET /api/users/staffs
      const res = await userApi.getStaffs(params);
      const data = res.data || res.Data || {};
      setStaffs(data.items || data.Items || []);
      setTotalPages(data.totalPages || data.TotalPages || 1);
      setTotalRecords(data.totalRecords || data.TotalRecords || 0);
    } catch (err) {
      showToast('error', err.message || 'Lỗi tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStaffs();
  };

  const handleReset = () => {
    setNameSearch('');
    setEmailSearch('');
    setPage(1);
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    formModal.openModal(null);
  };

  const handleOpenEdit = (row) => {
    setModalMode('edit');
    formModal.openModal(row);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      if (modalMode === 'add') {
        // userApi.addStaff calls POST /api/users/staff
        await userApi.addStaff(formData);
        showToast('success', 'Tạo tài khoản nhân viên thành công');
      } else {
        const id = formModal.modalData.id || formModal.modalData.Id;
        await userApi.update(id, formData);
        showToast('success', 'Cập nhật thông tin nhân viên thành công');
      }
      formModal.closeModal();
      fetchStaffs();
    } catch (err) {
      showToast('error', err.message || 'Lỗi lưu thông tin nhân viên');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (row) => {
    const currentStatus = row.status || row.Status;
    const nextStatus = currentStatus?.toUpperCase() === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    const msg = nextStatus === 'ACTIVE' ? 'Mở khóa tài khoản nhân viên?' : 'Khóa tài khoản nhân viên?';
    if (!window.confirm(msg)) return;

    try {
      const id = row.id || row.Id;
      await userApi.updateStatus(id, nextStatus);
      showToast('success', 'Cập nhật trạng thái tài khoản nhân viên thành công');
      fetchStaffs();
    } catch (err) {
      showToast('error', err.message || 'Lỗi cập nhật trạng thái tài khoản');
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-2">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
        <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Danh sách nhân viên</h6>
        {isAdmin && (
          <button className="btn btn-primary d-flex align-items-center gap-1 px-3 py-1.5 rounded-1" onClick={handleOpenAdd}>
            <span className="fs-5 lh-1">+</span> Thêm nhân viên
          </button>
        )}
      </div>

      <div className="card-body p-0">
        <form onSubmit={handleSearch} className="px-4 py-3 border-bottom bg-white d-flex gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: '250px' }}
            placeholder="Họ tên nhân viên..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: '250px' }}
            placeholder="Email nhân viên..."
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-primary px-3 bg-white">Tìm</button>
          <button type="button" className="btn btn-outline-secondary px-3 bg-white" onClick={handleReset}>Đặt lại</button>
        </form>

        <StaffTable
          staffs={staffs}
          isLoading={loading}
          onEdit={handleOpenEdit}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="card-footer bg-light border-top px-4 py-3 d-flex justify-content-between align-items-center">
          <span className="text-secondary small">Hiển thị {staffs.length} / {totalRecords} nhân viên</span>
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

      {/* Create / Edit Modal */}
      <StaffFormModal
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

export default StaffContainer;
