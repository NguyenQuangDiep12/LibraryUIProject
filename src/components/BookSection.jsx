import React from 'react';
import BookCard from './BookCard';

const BookSection = ({ 
  title, 
  books = [], 
  textColor = 'text-dark', 
  layout = 'scroll', // 'scroll' (cuộn ngang) hoặc 'grid' (lưới rớt dòng)
  onLoadMore, 
  hasMore, 
  loading 
}) => {
  
  if (!books || books.length === 0) return null;

  // Hàm render từng card sách với logic mapping dữ liệu rất tốt của bạn
  const renderBooks = () => {
    return books.map((book, index) => {
      const bookId = book.bookId !== undefined ? book.bookId : (book.BookId !== undefined ? book.BookId : book.id);
      const bookTitle = book.title !== undefined ? book.title : (book.Title !== undefined ? book.Title : '');
      const coverImage = book.coverImage !== undefined ? book.coverImage : (book.CoverImage !== undefined ? book.CoverImage : (book.image || book.imageUrl));
      const language = book.language !== undefined ? book.language : (book.Language !== undefined ? book.Language : '');
      const availableCopies = book.availableCopies !== undefined ? book.availableCopies : (book.AvailableCopies !== undefined ? book.AvailableCopies : null);
      const status = book.status !== undefined ? book.status : (availableCopies !== null ? (availableCopies > 0 ? "Sẵn có" : "Hết sách") : '');

      const card = (
        <BookCard 
          key={bookId || index}
          id={bookId}
          title={bookTitle}
          imageUrl={coverImage}
          language={language}
          status={status}
        />
      );

      // Nếu là dạng lưới (grid) thì bọc thêm cột (col) của Bootstrap
      return layout === 'grid' ? (
        <div className="col" key={bookId || index}>
          {card}
        </div>
      ) : card;
    });
  };

  return (
    <div className="mb-5 pb-3" style={layout === 'grid' ? { borderBottom: '1px solid #e9ecef' } : {}}>
      
      {/* Tiêu đề Section */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <h4 className={`${textColor} fw-bold mb-0`} style={{ fontSize: '1.4rem' }}>{title}</h4>
        
        {/* Nút Xem tất cả ở góc phải (Chỉ hiện khi cuộn ngang) */}
        {layout === 'scroll' && (
          <a href="#" onClick={(e) => e.preventDefault()} className="text-decoration-none" style={{ color: 'var(--waka-primary)', fontSize: '0.9rem', fontWeight: '500' }}>
            Xem thêm &gt;
          </a>
        )}
      </div>

      {/* Vùng hiển thị sách: Chọn lưới (Grid) HOẶC Cuộn ngang (Scroll) */}
      {layout === 'grid' ? (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
          {renderBooks()}
        </div>
      ) : (
        <div className="d-flex gap-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {renderBooks()}
        </div>
      )}

      {/* Nút "Xem thêm sách" dưới cùng (Chỉ hiện khi ở dạng Grid và còn dữ liệu) */}
      {layout === 'grid' && hasMore && (
        <div className="text-center mt-4">
          <button 
            onClick={(e) => { e.preventDefault(); onLoadMore && onLoadMore(e); }} 
            disabled={loading}
            className="btn rounded-pill px-4 py-2"
            style={{ 
              border: '1px solid #dee2e6', 
              backgroundColor: '#f8f9fa', 
              color: '#495057', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          >
            {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
            {loading ? "Đang tải dữ liệu..." : "Xem thêm sách >"}
          </button>
        </div>
      )}

    </div>
  );
};

export default BookSection;