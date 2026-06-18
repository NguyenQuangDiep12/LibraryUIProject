import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ id, title, imageUrl, language, status, rank }) => {
  const navigate = useNavigate();
  return (
    <div className="book-card" onClick={() => navigate(`/book/${id || 1}`)} style={{ width: '160px', flexShrink: 0, cursor: 'pointer' }}>
      <div className="position-relative" style={{ height: '240px', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Ảnh bìa sách */}
        <img src={imageUrl} alt={title} className="w-100 h-100" style={{ objectFit: 'cover' }} />

        {/* Overlay Gradient tối dần xuống đáy (giúp nổi số rank hoặc text) */}
        <div className="position-absolute w-100 h-100 top-0 start-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)' }}></div>

        {/* Tag Ngôn Ngữ */}
        {language && (
          <span className="badge position-absolute top-0 start-0 m-2 px-2 py-1" style={{ backgroundColor: 'var(--waka-primary)', fontSize: '0.75rem' }}>
            {language}
          </span>
        )}

        {/* Tag Trạng Thái Khả Dụng */}
        {status && (
          <span className="badge position-absolute top-0 end-0 m-2 px-2 py-1 text-white" style={{ backgroundColor: status === 'Sẵn có' ? 'var(--waka-success)' : 'var(--waka-danger)', fontSize: '0.7rem' }}>
            {status}
          </span>
        )}

        {/* Số Rank khổng lồ cho bảng xếp hạng */}
        {rank && (
          <div className="position-absolute bottom-0 start-0 ms-2 lh-1 fw-bold" style={{ fontSize: '6rem', color: 'rgba(255, 255, 255, 0.85)', letterSpacing: '-5px', marginBottom: '-15px' }}>
            {rank}
          </div>
        )}
      </div>

      {/* Tên sách bên dưới (Chỉ hiện nếu không phải bảng xếp hạng) */}
      {!rank && (
        <h6 className="text-white mt-3 fw-medium text-truncate" style={{ fontSize: '0.9rem' }} title={title}>
          {title}
        </h6>
      )}
      
      {/* Tên sách cho bảng xếp hạng (Nằm dưới số) */}
      {rank && (
         <h6 className="text-white mt-2 fw-medium text-truncate" style={{ fontSize: '0.9rem' }} title={title}>
         {title}
       </h6>
      )}
    </div>
  );
};

export default BookCard;