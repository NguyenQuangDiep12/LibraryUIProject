import React, { useState, useEffect } from 'react';
import { publisherApi } from '../../apis/apis';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../hooks/useModal';
import { useRole } from '../../hooks/useRole';
import PublisherTable from './components/PublisherTable';
import PublisherFormModal from './components/PublisherFormModal';
import ConfirmModal from '../../components/common/ConfirmModal';

export const PublisherContainer = () => {
  const { showToast } = useToast();
  const { isAdmin, isStaff } = useRole();
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);

  const formModal = useModal();
  const deleteModal = useModal();
  const [modalMode, setModalMode] = useState('add');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    setLoading(true);
    try {
      const res = await publisherApi.getAll();
      const data = res.data || res.Data;
      setPublishers(data?.items || data?.Items || (Array.isArray(data) ? data : []));
    } catch (err) {
      showToast(err.message || 'Lỗi tải nhà xuất bản', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    formModal.openModal(null);
  };

  const handleOpenEdit = (publisher) => {
    setModalMode('edit');
    formModal.openModal(publisher);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      if (modalMode === 'add') {
        await publisherApi.create(formData);
        showToast('Thêm nhà xuất bản mới thành công', 'SUCCESS');
      } else {
        const id = formModal.modalData.id || formModal.modalData.publisherId || formModal.modalData.PublisherId;
        await publisherApi.update(id, formData);
        showToast('Cập nhật thông tin nhà xuất bản thành công', 'SUCCESS');
      }
      formModal.closeModal();
      fetchPublishers();
    } catch (err) {
      showToast(err.message || 'Lỗi lưu thông tin nhà xuất bản', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const id = deleteModal.modalData.id || deleteModal.modalData.publisherId || deleteModal.modalData.PublisherId;
    setActionLoading(true);
    try {
      await publisherApi.delete(id);
      showToast('Xóa nhà xuất bản thành công', 'SUCCESS');
      deleteModal.closeModal();
      fetchPublishers();
    } catch (err) {
      showToast(err.message || 'Lỗi xóa nhà xuất bản', 'DANGER');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-2">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
        <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Nhà xuất bản sách</h6>
        {(isAdmin || isStaff) && (
          <button className="btn btn-primary d-flex align-items-center gap-1 px-3 py-1.5 rounded-1" onClick={handleOpenAdd}>
            <span className="fs-5 lh-1">+</span> Thêm mới
          </button>
        )}
      </div>

      <div className="card-body p-0">
        <PublisherTable
          publishers={publishers}
          isLoading={loading}
          onEdit={handleOpenEdit}
          onDelete={deleteModal.openModal}
        />
      </div>

      <PublisherFormModal
        isOpen={formModal.isOpen}
        mode={modalMode}
        initialData={formModal.modalData}
        onSave={handleSave}
        onCancel={formModal.closeModal}
        isLoading={actionLoading}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Xóa nhà xuất bản"
        message={`Bạn có chắc chắn muốn xóa nhà xuất bản "${deleteModal.modalData?.name || deleteModal.modalData?.Name}"?`}
        onConfirm={handleDelete}
        onCancel={deleteModal.closeModal}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default PublisherContainer;
