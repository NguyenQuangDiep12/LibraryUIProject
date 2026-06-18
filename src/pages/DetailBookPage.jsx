import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import BookSection from '../components/BookSection'; // Nhớ import BookSection
import { bookApi } from '../apis/apis';

export default function DetailBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [selectedBorrowType, setSelectedBorrowType] = useState("Mang về");
  
  // State lưu danh sách sách liên quan
  const [relatedByAuthor, setRelatedByAuthor] = useState([]);
  const [relatedByCategory, setRelatedByCategory] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);

        const res = await bookApi.getById(id);
        console.log("API Response:", res);

        const data = res?.data; 

        if (!data) {
          console.error("Không tìm thấy dữ liệu (data bị undefined)!");
          return;
        }

        setBook({
          id: data.bookId,
          title: data.title,
          author: data.authors?.map(a => a.authorName).join(', ') || 'Chưa cập nhật',
          category: data.categories?.map(c => c.categoryName).join(', ') || 'Chưa cập nhật',
          publisher: data.publisher?.publisherName || 'Chưa cập nhật',
          isbn: data.isbn,
          language: data.language,
          description: data.description,

          totalCopies: data.totalCopies,
          availableCopies: data.availableCopies,

          coverUrl: data.coverImage,
          borrowTypes: ["Đọc tại chỗ", "Mang về"],

          promo: {
            title: "TÌNH TRẠNG SÁCH",
            availableStatus: `Còn ${data.availableCopies}/${data.totalCopies} cuốn`,
            giftInfo: "Cho phép mượn tối đa 7 ngày",
            buttonText: "ĐĂNG KÝ ĐẶT TRƯỚC"
          }
        });

        // Lấy ID tác giả và thể loại đầu tiên
        const firstAuthorId = data.authors && data.authors.length > 0 ? data.authors[0].authorId : null;
        const firstCategoryId = data.categories && data.categories.length > 0 ? data.categories[0].categoryId : null;
        
        try {
          // Dùng bookApi.getAll thay vì getBooks theo đúng setting của bạn
          const [authorRes, categoryRes] = await Promise.all([
            firstAuthorId 
              ? bookApi.getAll({ AuthorId: firstAuthorId, PageSize: 6, Page: 1 }) 
              : Promise.resolve(null),
            firstCategoryId 
              ? bookApi.getAll({ CategoryId: firstCategoryId, PageSize: 6, Page: 1 }) 
              : Promise.resolve(null)
          ]);

          // Trích xuất mảng dữ liệu
          const booksByAuthor = authorRes?.data?.data || authorRes?.data?.items || authorRes?.data || [];
          const booksByCategory = categoryRes?.data?.data || categoryRes?.data?.items || categoryRes?.data || [];

          // Lọc bỏ cuốn sách đang xem ra khỏi danh sách gợi ý
          setRelatedByAuthor(booksByAuthor.filter(b => b.bookId !== data.bookId));
          setRelatedByCategory(booksByCategory.filter(b => b.bookId !== data.bookId));

        } catch (relatedErr) {
          console.error("Lỗi khi fetch sách liên quan:", relatedErr);
        }

      } catch (err) {
        console.error("Lỗi khi lấy thông tin sách:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading || !book) {
    return (
      <div style={{ backgroundColor: 'var(--waka-bg-card-light)', minHeight: '100vh', color: 'var(--waka-text-dark)' }} className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--waka-bg-light)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'var(--waka-text-dark)', overflowX: 'hidden' }}>
      <Header />
      <div className="container-fluid px-4 bg-white" style={{ borderBottom: '1px solid var(--waka-border-light)' }}>
        <div className="py-3">
          <Breadcrumb items={[
              { label: "Trang chủ", path: "/" },
              { label: book.category || "Thể loại", path: "/" },
              { label: book.title }
            ]} 
          />
        </div>
      </div>

      <div className="container-fluid px-4 py-4 position-relative">
        <div className="row mb-5">
          
          {/* Cột 1: Ảnh bìa sách */}
          <div className="col-lg-4 col-md-4 mb-4 d-flex justify-content-center justify-content-md-start align-items-start">
            <div 
              className="position-relative" 
              style={{ 
                width: '280px', 
                height: '420px', 
                borderRadius: '4px', 
                border: '1px solid var(--waka-border-light)', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                backgroundColor: 'var(--waka-bg-card-light)',
                overflow: 'hidden'
              }}>
              <img src={book.coverUrl} alt={book.title} className="w-100 h-100" style={{ objectFit: 'cover' }}/>
              
              {book.availableCopies > 0 ? (
                <div className="position-absolute d-flex align-items-center gap-1 px-3 py-1 text-white fw-bold shadow-sm" 
                  style={{ 
                    top: '12px', 
                    right: '0px', 
                    backgroundColor: 'var(--waka-success)',
                    borderTopLeftRadius: '4px',
                    borderBottomLeftRadius: '4px',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px'
                  }}>
                  SẴN CÓ
                </div>
              ) : (
                <div className="position-absolute d-flex align-items-center gap-1 px-3 py-1 text-white fw-bold shadow-sm" 
                  style={{ 
                    top: '12px', 
                    right: '0px', 
                    backgroundColor: 'var(--waka-danger)',
                    borderTopLeftRadius: '4px',
                    borderBottomLeftRadius: '4px',
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px'
                  }}>
                  ĐANG MƯỢN
                </div>
              )}
            </div>
          </div>

          {/* Cột 2: Thông tin sách */}
          <div className="col-lg-5 col-md-8 mb-4">
            <h1 className="fw-bold mb-2 text-dark" style={{ fontSize: '2.2rem', lineHeight: '1.2' }}>
              {book.title}
            </h1>

            <div className="row g-3 mb-4 pb-3 mt-2" style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--waka-border-light)' }}>
              <div className="col-sm-6">
                <div className="d-flex mb-2">
                  <span className="text-muted" style={{ width: '110px', flexShrink: 0 }}>Tác giả</span>
                  <span className="text-dark fw-medium">{book.author}</span>
                </div>
                <div className="d-flex mb-2">
                  <span className="text-muted" style={{ width: '110px', flexShrink: 0 }}>Nhà xuất bản</span>
                  <span className="text-dark fw-medium">{book.publisher}</span>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex mb-2">
                  <span className="text-muted" style={{ width: '110px', flexShrink: 0 }}>Thể loại</span>
                  <span className="text-dark fw-medium">{book.category}</span>
                </div>
                <div className="d-flex mb-2">
                  <span className="text-muted" style={{ width: '110px', flexShrink: 0 }}>ISBN</span>
                  <span className="text-dark fw-medium">{book.isbn}</span>
                </div>
                <div className="d-flex mb-2">
                  <span className="text-muted" style={{ width: '110px', flexShrink: 0 }}>Ngôn ngữ</span>
                  <span className="text-dark fw-medium">{book.language}</span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <span className="text-muted" style={{ width: '110px', fontSize: '0.9rem' }}>Hình thức mượn</span>
              <div className="d-flex gap-1 p-1 rounded" style={{ backgroundColor: 'var(--waka-bg-light)', border: '1px solid var(--waka-border-light)' }}>
                {book.borrowTypes.map((type) => {
                  const isSelected = selectedBorrowType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedBorrowType(type)}
                      className="btn btn-sm rounded px-3 py-1 border-0 btn-format"
                      style={{
                        fontSize: '0.8rem',
                        backgroundColor: isSelected ? 'var(--waka-bg-card-light)' : 'transparent',
                        color: isSelected ? 'var(--waka-text-dark)' : 'var(--waka-text-muted)',
                        fontWeight: isSelected ? '600' : 'normal',
                        boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cột 3: Sidebar Tình trạng Sách */}
          <div className="col-lg-3 col-md-12">
            <div 
              className="card border-0 p-4 d-flex flex-column" 
              style={{ 
                backgroundColor: 'var(--waka-bg-card-light)',
                border: '1px solid var(--waka-border-light) !important',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                minHeight: '280px'
              }}
            >
              <h5 className="text-dark fw-bold text-center mb-4" style={{ fontSize: '1.1rem' }}>
                {book.promo.title}
              </h5>

              <div 
                className="d-flex flex-column gap-2 p-3 rounded mb-4"
                style={{
                  backgroundColor: 'var(--waka-bg-light)',
                  border: '1px solid var(--waka-border-light)'
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '0.8rem', color: '#6c757d', fontWeight: '600' }}>TRẠNG THÁI:</span>
                  <span className="fw-bold" style={{ fontSize: '0.85rem', color: 'var(--waka-success)' }}>
                    {book.promo.availableStatus}
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2 mb-4 text-muted">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                </svg>
                <span style={{ fontSize: '0.90rem' }}>{book.promo.giftInfo}</span>
              </div>

              <button 
                className="btn btn-lg w-100 rounded text-white fw-bold mt-auto"
                style={{
                  backgroundColor: 'var(--waka-btn-primary-light)',
                  border: 'none',
                  fontSize: '1rem',
                  padding: '12px 0',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--waka-btn-primary-light-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--waka-btn-primary-light)'}
                onClick={() => alert(`Gửi yêu cầu đặt trước (POST /reservations) cho cuốn sách ID: ${book.id}`)}
              >
                {book.promo.buttonText}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Section hiển thị sách liên quan */}
      <div className="container-fluid px-4 py-5 bg-white" style={{ borderTop: '1px solid var(--waka-border-light)' }}>
        <div className="row">
          <div className="col-12">
            
            <BookSection 
              title={`Sách cùng tác giả: ${book.author}`} 
              books={relatedByAuthor} 
              textColor="text-dark"
            />

            <BookSection 
              title={`Cùng thể loại: ${book.category}`} 
              books={relatedByCategory} 
              textColor="text-dark"
            />

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}