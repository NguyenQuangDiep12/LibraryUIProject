import React from 'react';

export const NotificationList = ({
  notifications,
  isLoading,
  onRead,
  onReadAll,
  onViewDetail,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('vi-VN');
  };

  return (
    <div className="card shadow-sm border-0 rounded-2 text-dark">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
        <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Thông báo cá nhân</h6>
        {notifications.length > 0 && (
          <button className="btn btn-sm btn-outline-primary px-3 py-1.5 fw-semibold" onClick={onReadAll}>
            Đánh dấu đọc tất cả
          </button>
        )}
      </div>

      <div className="card-body p-0">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border spinner-border-sm text-primary me-2"></div>
            <span className="text-secondary small">Đang tải thông báo...</span>
          </div>
        ) : notifications.length > 0 ? (
          <div className="list-group list-group-flush">
            {notifications.map((n) => {
              const id = n.id || n.notificationId || n.NotificationId;
              const isRead = n.isRead || n.IsRead || false;
              const title = n.title || n.Title || 'Thông báo';
              const content = n.content || n.Content || n.message || n.Message || '';
              const date = n.createdAt || n.CreatedAt;
              const reason = n.reason || n.Reason || n.rejectionReason || n.RejectionReason || n.note || n.Note;

              return (
                <div
                  key={id}
                  className={`list-group-item list-group-item-action p-4 border-bottom ${
                    !isRead ? 'bg-light border-start border-primary border-4' : 'bg-white'
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onViewDetail(n)}
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className={`mb-0 ${!isRead ? 'fw-bold text-dark' : 'text-secondary'}`}>
                        {title}
                      </h6>
                      {!isRead ? (
                        <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>Mới</span>
                      ) : (
                        <span className="badge bg-secondary" style={{ fontSize: '0.65rem' }}>Đã đọc</span>
                      )}
                    </div>
                    <small className="text-muted small text-nowrap">{formatDate(date)}</small>
                  </div>
                  <p className="mb-2 mt-2 text-secondary small text-truncate" style={{ maxWidth: '650px' }}>
                    {content}
                  </p>
                  {reason && (
                    <div className="mb-2 text-danger small">
                      <strong>Lý do:</strong> {reason}
                    </div>
                  )}
                  
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <button
                      className="btn btn-sm btn-primary fw-semibold text-white px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(n);
                      }}
                    >
                      Đọc thông báo
                    </button>
                    {!isRead && (
                      <button
                        className="btn btn-sm btn-link p-0 text-primary small fw-semibold text-decoration-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRead(id);
                        }}
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5 text-muted small bg-white">
            Bạn chưa có thông báo nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
