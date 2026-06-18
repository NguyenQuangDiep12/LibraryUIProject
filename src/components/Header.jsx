import React, { useEffect, useState } from 'react';
import { useDebounce } from '../utils/useDebounce';
import { bookApi } from '../apis/apis';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const [searchItem, setSearchItem] = useState('');
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]); 
    const [showDropdown, setShowDropdown] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    const debouncedSearchItem = useDebounce(searchItem, 500);

    useEffect(() => {
      if (debouncedSearchItem.trim() === '') {
        setBooks([]);
        return;
      }

      const fetchData = async () => {
        setLoading(true);

        // Tạo object tham số khớp chuẩn với DTO backend 
        const params = {
          Keyword: debouncedSearchItem,
          CategoryId: null,
          AuthorId: null,
          PageNumber: 1,
          PageSize: 10 // Lấy tối đa 10 cuốn gần nhất để gợi ý cuộn
        };

        try {
          const res = await bookApi.getAll(params);
          
          if (res) {
            // Hỗ trợ cả camelCase và PascalCase để tăng độ tương thích
            const success = res.success !== undefined ? res.success : res.Success;
            const data = res.data !== undefined ? res.data : res.Data;

            if (success && data) {
              const bookList = data.items !== undefined ? data.items : data.Items;
              const totalBooks = data.totalRecords !== undefined ? data.totalRecords : data.TotalRecords;

              setBooks(bookList || []); 
              console.log('Tổng số sách tìm thấy: ', totalBooks);
              console.log('Danh sách sách: ', bookList);
            }
          }
        } catch (err) {
          console.error('Lỗi khi lấy danh sách: ', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData(); 

    }, [debouncedSearchItem]);

  return (
    <nav className="navbar py-3" style={{ backgroundColor: 'var(--waka-bg-card)', borderBottom: '1px solid var(--waka-border)' }}>
      <div className="container-fluid px-md-5 px-3 d-flex align-items-center justify-content-between">
        {/* Logo */}
        <Link 
          className="navbar-brand fw-bold fs-3 text-uppercase" href="#" 
          style={{ color: 'var(--waka-primary)', letterSpacing: '1px' }}
          to='/' replace
        >
          WAKA
        </Link>

        {/* Thanh tìm kiếm & Cụm nút hành động */}
        <div className="d-flex align-items-center gap-2 gap-sm-3">
          
          {/* Ô Input tìm kiếm */}
          <div className="position-relative d-flex align-items-center">
            <input 
              type="text"
              className="form-control form-control-sm bg-dark text-white border-secondary rounded-pill ps-3 pe-5"
              placeholder="Tìm kiếm sách..."
              value={searchItem}
              onChange={(e) => {
                setSearchItem(e.target.value);
                setShowDropdown(true);
              }} 
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              style={{ width: '200px', fontSize: '0.85rem' }}
            />
            {/* Biểu tượng kính lúp hoặc Loading */}
            <span className="position-absolute end-0 me-3 text-white-50">
              {loading ? (
                <div className="spinner-border spinner-border-sm text-success" role="status"></div>
              ) : (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              )}
            </span>

            {/* Dropdown kết quả tìm kiếm gần đúng */}
            {showDropdown && searchItem.trim() !== '' && (
              <div 
                className="position-absolute top-100 start-0 mt-2 bg-dark rounded border border-secondary shadow-lg py-2" 
                style={{ 
                  zIndex: 1000, 
                  width: '320px', 
                  maxHeight: '225px', // Giới hạn chiều cao hiển thị khoảng 3 cuốn, cuộn dọc cho các cuốn tiếp theo
                  overflowY: 'auto' 
                }}
              >
                {loading ? (
                  <div className="text-center py-3 text-white-50" style={{ fontSize: '0.8rem' }}>
                    Đang tìm kiếm...
                  </div>
                ) : books.length > 0 ? (
                  <>
                    <div className="px-3 py-1 text-white-50 border-bottom border-secondary mb-1" style={{ fontSize: '0.75rem' }}>
                      Gợi ý kết quả ({books.length})
                    </div>
                    {books.map((book) => {
                      const bookId = book.bookId !== undefined ? book.bookId : (book.BookId !== undefined ? book.BookId : book.id);
                      const title = book.title !== undefined ? book.title : (book.Title !== undefined ? book.Title : '');
                      const coverImage = book.coverImage !== undefined ? book.coverImage : (book.CoverImage !== undefined ? book.CoverImage : book.image);
                      const isbn = book.isbn !== undefined ? book.isbn : (book.ISBN !== undefined ? book.ISBN : '');
                      const language = book.language !== undefined ? book.language : (book.Language !== undefined ? book.Language : '');

                      return (
                        <div 
                          key={bookId} 
                          className="d-flex align-items-center gap-2 px-3 py-2 text-white"
                          style={{ 
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            borderBottom: '1px solid var(--waka-border)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--waka-bg-card-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          onClick={() => {
                            navigate(`/book/${bookId}`);
                            setSearchItem('');
                            setShowDropdown(false);
                          }}
                        >
                          <img 
                            src={coverImage || 'https://placehold.co/40x60?text=No+Cover'} 
                            alt={title} 
                            style={{ width: '35px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div className="text-truncate fw-medium" style={{ fontSize: '0.85rem' }} title={title}>
                              {title}
                            </div>
                            <div className="text-white-50 text-truncate" style={{ fontSize: '0.75rem' }}>
                              {isbn ? `ISBN: ${isbn}` : ''} {language ? `• ${language}` : ''}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-center py-3 text-white-50" style={{ fontSize: '0.8rem' }}>
                    Không tìm thấy sách
                  </div>
                )}
              </div>
            )}
          </div>
          

          {
            !isAuthenticated ? (
              <>
                {/* Nút Đăng ký */}
                <Link 
                  className="btn btn-outline-secondary text-white rounded-pill px-3 py-1.5 fw-medium" 
                  style={{ fontSize: '0.85rem', borderColor: 'var(--waka-border)', transition: 'all 0.2s' }}
                  to='/register' replace
                >
                  Đăng ký
                </Link>

                {/* Nút Đăng nhập */}
                <Link 
                  className="btn rounded-pill px-3 px-sm-4 py-1.5 text-dark fw-bold" 
                  style={{ backgroundColor: 'var(--waka-primary)', fontSize: '0.85rem', transition: 'all 0.2s' }}
                  to='/login' replace
                >
                  Đăng nhập
                </Link>
              </>
            ) : (
               <>
                  <Link
                      className="btn btn-success rounded-pill px-3"
                      to="/dashboard"
                  >
                      Dashboard
                  </Link>

                  <button
                      className="btn btn-danger rounded-pill px-3"
                      onClick={logout}
                  >
                      Đăng xuất
                  </button>
                </>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Header;