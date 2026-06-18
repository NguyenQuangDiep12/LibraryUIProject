import React, { useState, useEffect } from 'react';
import { authorApi } from '../../apis/apis';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../hooks/useModal';
import { useRole } from '../../hooks/useRole';
import AuthorTable from './components/AuthorTable';
import AuthorFormModal from './components/AuthorFormModal';
import ConfirmModal from '../../components/common/ConfirmModal';

export const AuthorContainer = () => {
  const { showToast } = useToast();
  const { isAdmin, isStaff } = useRole();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const formModal = useModal();
  const deleteModal = useModal();
  const [modalMode, setModalMode] = useState('add');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const res = await authorApi.getAll();
      const data = res.data || res.Data;
      setAuthors(data?.items || data?.Items || (Array.isArray(data) ? data : []));
    } catch (err) {
      showToast(err.message || 'Lỗi tải tác giả', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    formModal.openModal(null);
  };

  const handleOpenEdit = (author) => {
    setModalMode('edit');
    formModal.openModal(author);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      if (modalMode === 'add') {
        await authorApi.create(formData);
        showToast('Thêm tác giả mới thành công', 'SUCCESS');
      } else {
        const id = formModal.modalData.id || formModal.modalData.authorId || formModal.modalData.AuthorId;
        await authorApi.update(id, formData);
        showToast('Cập nhật thông tin tác giả thành công', 'SUCCESS');
      }
      formModal.closeModal();
      fetchAuthors();
    } catch (err) {
      showToast(err.message || 'Lỗi lưu thông tin tác giả', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const id = deleteModal.modalData.id || deleteModal.modalData.authorId || deleteModal.modalData.AuthorId;
    setActionLoading(true);
    try {
      await authorApi.delete(id);
      showToast('Xóa tác giả thành công', 'SUCCESS');
      deleteModal.closeModal();
      fetchAuthors();
    } catch (err) {
      showToast(err.message || 'Lỗi xóa tác giả', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-2">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
        <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Tác giả sách</h6>
        {(isAdmin || isStaff) && (
          <button className="btn btn-primary d-flex align-items-center gap-1 px-3 py-1.5 rounded-1" onClick={handleOpenAdd}>
            <span className="fs-5 lh-1">+</span> Thêm mới
          </button>
        )}
      </div>

      <div className="card-body p-0">
        <AuthorTable
          authors={authors}
          isLoading={loading}
          onEdit={handleOpenEdit}
          onDelete={deleteModal.openModal}
        />
      </div>

      <AuthorFormModal
        isOpen={formModal.isOpen}
        mode={modalMode}
        initialData={formModal.modalData}
        onSave={handleSave}
        onCancel={formModal.closeModal}
        isLoading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Xóa tác giả"
        message={`Bạn có chắc chắn muốn xóa tác giả "${deleteModal.modalData?.name || deleteModal.modalData?.Name}"?`}
        onConfirm={handleDelete}
        onCancel={deleteModal.closeModal}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AuthorContainer;
