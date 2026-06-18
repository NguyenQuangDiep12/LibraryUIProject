import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import Footer from "../components/Footer";
import Header from '../components/Header';
import { bookApi, categoryApi } from '../apis/apis';

// --- HELPERS ---
const getApiData = (res) => res?.data || res?.Data;
const getApiItems = (data) => data?.items || data?.Items || (Array.isArray(data) ? data : []);

const getBookInfo = (book) => ({
  id: book.bookId || book.BookId || book.id,
  title: book.title || book.Title || '',
  coverImage: book.coverImage || book.CoverImage || book.image || book.imageUrl,
  language: book.language || book.Language || '',
  availableCopies: book.availableCopies ?? book.AvailableCopies ?? null
});

// --- COMPONENT CON: KHỐI DANH MỤC ---
const CategoryBlock = ({ category }) => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async (pageIndex) => {
      try {
        setLoading(true);
        const res = await bookApi.getAll({ CategoryId: category.categoryId, PageNumber: pageIndex, PageSize: 6 });
        const resData = getApiData(res);
        const success = res?.success ?? res?.Success;

        if (success && resData) {
          const itemsList = getApiItems(resData);
          if (itemsList.length < 6) setHasMore(false);

          setBooks(prevBooks => {
            if (pageIndex === 1) return itemsList;
            const existingIds = new Set(prevBooks.map(b => getBookInfo(b).id));
            const filteredNewBooks = itemsList.filter(b => !existingIds.has(getBookInfo(b).id));
            return [...prevBooks, ...filteredNewBooks];
          });
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error(`Lỗi lấy sách cho danh mục ${category.categoryName}:`, error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks(page);
  }, [page, category.categoryId, category.categoryName]);
  if (books.length === 0 && !loading) return null;

  return (
    <div className="mb-5">
      {/* Tiêu đề Section */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <h4 className="text-white fw-bold mb-0 category-title" style={{ fontSize: '1.25rem' }}>
          {category.categoryName}
        </h4>
        {hasMore && (
          <button 
            className="btn btn-sm text-uppercase fw-bold px-3 py-1 rounded-pill btn-xem-them" 
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Xem thêm"}
          </button>
        )}
      </div>

      {/* Danh sách sách cuộn ngang */}
      <div className="d-flex gap-4 overflow-auto pb-3 book-scroll-container">
        {books.map((book, index) => {
          const { id, title, coverImage, language, availableCopies } = getBookInfo(book);
          const status = availableCopies !== null ? (availableCopies > 0 ? "Sẵn có" : "Hết sách") : '';

          return (
            <BookCard 
              key={id || index}
              id={id}
              title={title}
              imageUrl={coverImage || 'https://placehold.co/300x450/2d2d2a/FFF?text=Sach'}
              language={language}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH: TRANG CHỦ ---
export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [spotlightBook, setSpotlightBook] = useState(null);
  const [loadingSpotlight, setLoadingSpotlight] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(getApiItems(getApiData(res)));
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      } finally {
        setLoadingCats(false);
      }
    };

    const fetchSpotlightBook = async () => {
      try {
        setLoadingSpotlight(true);
        const listRes = await bookApi.getAll({ PageNumber: 1, PageSize: 1, SortBy: 'Popular' });
        const listResData = getApiData(listRes);
        
        if ((listRes?.success ?? listRes?.Success) && listResData) {
          const items = getApiItems(listResData);
          if (items.length > 0) {
            const topBookId = getBookInfo(items[0]).id;
            const detailRes = await bookApi.getById(topBookId);
            const detailResData = getApiData(detailRes);

            if ((detailRes?.success ?? detailRes?.Success) && detailResData) {
              const authors = detailResData.authors || detailResData.Authors || [];
              const categoriesList = detailResData.categories || detailResData.Categories || [];
              
              setSpotlightBook({
                id: topBookId,
                title: detailResData.title || detailResData.Title,
                author: authors.length ? authors.map(a => a.authorName || a.AuthorName).join(', ') : 'Đang cập nhật',
                category: categoriesList.length ? categoriesList.map(c => c.categoryName || c.CategoryName).join(', ') : 'Đang cập nhật',
                description: detailResData.description || detailResData.Description || 'Chưa có mô tả cho cuốn sách này.',
                coverImage: detailResData.coverImage || detailResData.CoverImage || items[0].coverImage
              });
              return;
            }
          }
        }
        setSpotlightBook(null);
      } catch (error) {
        console.error("Lỗi khi lấy sách nổi bật:", error);
        setSpotlightBook(null);
      } finally {
        setLoadingSpotlight(false);
      }
    };

    fetchCategories();
    fetchSpotlightBook();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--waka-bg-dark)', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Header />
      
      {/* Hero Banner Section */}
      <div 
        className="position-relative w-100 d-flex align-items-center mb-5" 
        style={{ 
          height: '500px', 
          backgroundImage: 'linear-gradient(180deg, rgba(20,20,20,0.3) 0%, rgba(20,20,20,0.85) 75%, var(--waka-bg-dark) 100%), url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1920")',
          backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(32, 201, 151, 0.15) 0%, rgba(20, 20, 20, 0) 70%)', pointerEvents: 'none' }} />

        <div className="container-fluid px-md-5 px-3 position-relative" style={{ zIndex: 2 }}>
          <span className="badge px-3 py-2 mb-3 text-uppercase fw-bold" style={{ backgroundColor: 'var(--waka-primary)', color: 'var(--waka-bg-dark)', fontSize: '0.75rem', letterSpacing: '2px' }}>
            Chào mừng đến với WAKA Library
          </span>
          <h1 className="display-4 fw-bold text-white mb-3" style={{ letterSpacing: '-1px', lineHeight: '1.1', maxWidth: '700px' }}>
            Khám Phá Tri Thức,<br />
            <span style={{ color: 'var(--waka-primary)' }}>Khởi Nguồn Thành Công.</span>
          </h1>
          <p className="text-white-50 fs-6 mb-4" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
            Hàng ngàn đầu sách thuộc nhiều lĩnh vực khác nhau đang chờ đón bạn. Đăng ký thành viên ngay hôm nay để mượn sách trực tuyến miễn phí và tham gia cộng đồng yêu sách.
          </p>
          <div className="d-flex gap-3">
            <button className="btn rounded-pill px-4 py-2 fw-bold btn-hero" onClick={() => document.querySelector('input[type="text"]')?.focus()}>
              Mượn Sách Ngay
            </button>
            <a href="#books-catalog" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold btn-hero-outline">
              Khám Phá Danh Mục
            </a>
          </div>
        </div>
      </div>

      {/* Featured Book Spotlight */}
      {!loadingSpotlight && spotlightBook && (
        <div className="container-fluid px-md-5 px-3 py-3 mb-5">
          <div className="row align-items-center g-4 p-4 p-md-5 rounded-4" style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)', border: '1px solid #2d2d2d' }}>
            <div className="col-md-3 d-flex justify-content-center">
              <div className="position-relative book-cover-3d spotlight-cover" style={{ width: '180px', height: '270px', borderRadius: '8px', border: '3px solid #ffffff', boxShadow: '0 15px 35px rgba(0,0,0,0.6)', cursor: 'pointer' }} onClick={() => navigate(`/book/${spotlightBook.id}`)}>
                <img src={spotlightBook.coverImage} alt={spotlightBook.title} className="w-100 h-100" style={{ objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-md-9 text-white">
              <span className="badge bg-danger mb-2 text-uppercase fw-bold shadow-sm" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>Sách Nổi Bật Tuần Này</span>
              <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '2rem' }}>{spotlightBook.title}</h2>
              <div className="d-flex align-items-center gap-3 mb-3 text-white-50" style={{ fontSize: '0.85rem' }}>
                <span>Tác giả: <strong className="text-white">{spotlightBook.author}</strong></span><span>•</span>
                <span>Thể loại: <strong className="text-white">{spotlightBook.category}</strong></span>
              </div>
              <p className="text-white-50 mb-4" style={{ lineHeight: '1.6', fontSize: '0.9rem', maxWidth: '750px' }}>
                {spotlightBook.description}
              </p>
              <button className="btn rounded-pill px-4 py-2 fw-bold btn-waka-success" onClick={() => navigate(`/book/${spotlightBook.id}`)}>
                Mượn & Đọc Thử
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh mục sách */}
      <div id="books-catalog" className="container-fluid px-md-5 px-3 py-4" style={{ minHeight: '500px' }}>
        {loadingCats ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="spinner-border text-success mb-3" role="status"><span className="visually-hidden">Đang tải...</span></div>
            <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Đang kết nối thư viện...</div>
          </div>
        ) : categories.length > 0 ? (
          categories.map(cat => <CategoryBlock key={cat.categoryId || cat.CategoryId} category={cat} />)
        ) : (
          <div className="text-center py-5 text-muted"><h4 className="text-white-50">Chưa có danh mục sách nào trong hệ thống.</h4></div>
        )}
      </div>

      <Footer />
    </div>
  );
}