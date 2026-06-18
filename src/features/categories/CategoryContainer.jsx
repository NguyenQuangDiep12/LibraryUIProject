import React, { useState, useEffect } from 'react';
import { categoryApi } from '../../apis/apis';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../hooks/useModal';
import { useRole } from '../../hooks/useRole';
import CategoryTable from './components/CategoryTable';
import CategoryFormModal from './components/CategoryFormModal';
import ConfirmModal from '../../components/common/ConfirmModal';

export const CategoryContainer = () => {
  const { showToast } = useToast();
  const { isAdmin, isStaff } = useRole();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const formModal = useModal();
  const deleteModal = useModal();
  const [modalMode, setModalMode] = useState('add');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll();
      const data = res.data || res.Data;
      setCategories(data?.items || data?.Items || (Array.isArray(data) ? data : []));
    } catch (err) {
      showToast(err.message || 'Lỗi tải danh mục', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    formModal.openModal(null);
  };

  const handleOpenEdit = (category) => {
    setModalMode('edit');
    formModal.openModal(category);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      if (modalMode === 'add') {
        await categoryApi.create(formData);
        showToast('Thêm danh mục mới thành công', 'SUCCESS');
      } else {
        const id = formModal.modalData.id || formModal.modalData.categoryId || formModal.modalData.CategoryId;
        await categoryApi.update(id, formData);
        showToast('Cập nhật danh mục thành công', 'SUCCESS');
      }
      formModal.closeModal();
      fetchCategories();
    } catch (err) {
      showToast(err.message || 'Lỗi lưu danh mục', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const id = deleteModal.modalData.id || deleteModal.modalData.categoryId || deleteModal.modalData.CategoryId;
    setActionLoading(true);
    try {
      await categoryApi.delete(id);
      showToast('Xóa danh mục thành công', 'SUCCESS');
      deleteModal.closeModal();
      fetchCategories();
    } catch (err) {
      showToast(err.message || 'Lỗi xóa danh mục', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-2">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
        <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Danh mục sách</h6>
        {(isAdmin || isStaff) && (
          <button className="btn btn-primary d-flex align-items-center gap-1 px-3 py-1.5 rounded-1" onClick={handleOpenAdd}>
            <span className="fs-5 lh-1">+</span> Thêm mới
          </button>
        )}
      </div>

      <div className="card-body p-0">
        <CategoryTable
          categories={categories}
          isLoading={loading}
          onEdit={handleOpenEdit}
          onDelete={deleteModal.openModal}
        />
      </div>

      <CategoryFormModal
        isOpen={formModal.isOpen}
        mode={modalMode}
        initialData={formModal.modalData}
        onSave={handleSave}
        onCancel={formModal.closeModal}
        isLoading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${deleteModal.modalData?.name || deleteModal.modalData?.Name}"?`}
        onConfirm={handleDelete}
        onCancel={deleteModal.closeModal}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default CategoryContainer;
