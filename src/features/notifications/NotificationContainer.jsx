import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../apis/apis';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../hooks/useModal';
import NotificationList from './components/NotificationList';

export const NotificationContainer = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const detailModal = useModal();

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getAll({ Page: page, PageSize: pageSize });
      const data = res.data || res.Data || {};
      setNotifications(data.items || data.Items || []);
      setTotalPages(data.totalPages || data.TotalPages || 1);
      setTotalRecords(data.totalRecords || data.TotalRecords || 0);
    } catch (err) {
      showToast(err.message || 'Lỗi tải thông báo', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id) => {
    try {
      await notificationApi.readOne(id);
      fetchNotifications();
    } catch (err) {
      showToast(err.message || 'Lỗi xử lý thông báo', 'DANGER');
    }
  };

  const handleReadAll = async () => {
    try {
      await notificationApi.readAll();
      showToast('Đã đọc toàn bộ thông báo', 'SUCCESS');
      fetchNotifications();
    } catch (err) {
      showToast(err.message || 'Lỗi xử lý thông báo', 'DANGER');
    }
  };

  const handleViewDetail = async (n) => {
    const isRead = n.isRead || n.IsRead;
    const id = n.id || n.notificationId || n.NotificationId;

    detailModal.openModal(n);

    if (!isRead) {
      await handleRead(id);
    }
  };

  return (
    <div className="d-flex flex-column gap-3 text-dark">
      <NotificationList
        notifications={notifications}
        isLoading={loading}
        onRead={handleRead}
        onReadAll={handleReadAll}
        onViewDetail={handleViewDetail}
      />

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-2 shadow-sm">
          <span className="text-secondary small">Hiển thị {notifications.length} / {totalRecords} thông báo</span>
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

      {/* Detail Modal */}
      {detailModal.isOpen && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={detailModal.closeModal}></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1045 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow-lg rounded-3">
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-dark">{detailModal.modalData?.title || detailModal.modalData?.Title}</h5>
                  <button type="button" className="btn-close" onClick={detailModal.closeModal}></button>
                </div>
                <div className="modal-body text-secondary small">
                  <p className="mb-3 whitespace-pre-wrap">{detailModal.modalData?.content || detailModal.modalData?.Content || detailModal.modalData?.message || detailModal.modalData?.Message}</p>
                  
                  {(detailModal.modalData?.reason || detailModal.modalData?.Reason || detailModal.modalData?.rejectionReason || detailModal.modalData?.RejectionReason || detailModal.modalData?.note || detailModal.modalData?.Note) && (
                    <div className="alert alert-danger p-2 mb-3">
                      <strong>Lý do từ chối:</strong> {detailModal.modalData?.reason || detailModal.modalData?.Reason || detailModal.modalData?.rejectionReason || detailModal.modalData?.RejectionReason || detailModal.modalData?.note || detailModal.modalData?.Note}
                    </div>
                  )}

                  <div className="text-muted text-end" style={{ fontSize: '0.75rem' }}>
                    Trạng thái: {(detailModal.modalData?.isRead || detailModal.modalData?.IsRead) ? 'Đã đọc' : 'Chưa đọc'} <br/>
                    Thời gian: {detailModal.modalData?.createdAt ? new Date(detailModal.modalData.createdAt).toLocaleString('vi-VN') : '—'}
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-sm btn-light px-3" onClick={detailModal.closeModal}>Đóng</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationContainer;
