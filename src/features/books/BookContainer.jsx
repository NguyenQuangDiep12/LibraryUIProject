import React, { useState, useEffect } from 'react';
import { bookApi, categoryApi, authorApi, publisherApi } from '../../apis/apis';
import { useToast } from '../../contexts/ToastContext';
import { useModal } from '../../hooks/useModal';
import { useRole } from '../../hooks/useRole';
import BookTable from './components/BookTable';
import BookFormModal from './components/BookFormModal';
import BookCopiesModal from './components/BookCopiesModal';
import ConfirmModal from '../../components/common/ConfirmModal';

export const BookContainer = () => {
  const { showToast } = useToast();
  const { isAdmin, isStaff } = useRole();

  // Lists and loading
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search and Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals state using custom useModal hook
  const formModal = useModal();
  const deleteModal = useModal();
  const copiesModal = useModal();
  const [modalMode, setModalMode] = useState('add');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [page, selectedCategory]);

  const fetchMetadata = async () => {
    try {
      const [cats, auths, pubs] = await Promise.all([
        categoryApi.getAll(),
        authorApi.getAll(),
        publisherApi.getAll(),
      ]);
      setCategories(cats.data || cats.Data || []);
      setAuthors(auths.data || auths.Data || []);
      setPublishers(pubs.data || pubs.Data || []);
    } catch (err) {
      showToast('error', 'Lỗi tải danh mục/tác giả/nhà xuất bản');
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {
        Keyword: searchTerm.trim() || null,
        CategoryId: selectedCategory ? Number(selectedCategory) : null,
        Page: page,
        PageSize: pageSize,
      };
      const res = await bookApi.getAll(params);
      const data = res.data || res.Data || {};
      setBooks(data.items || data.Items || []);
      setTotalPages(data.totalPages || data.TotalPages || 1);
      setTotalRecords(data.totalRecords || data.TotalRecords || 0);
    } catch (err) {
      showToast('error', err.message || 'Lỗi tải danh sách sách');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPage(1);
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    formModal.openModal(null);
  };

  const handleOpenEdit = (book) => {
    setModalMode('edit');
    formModal.openModal(book);
  };

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      if (modalMode === 'add') {
        await bookApi.create(formData);
        showToast('success', 'Thêm đầu sách mới thành công');
      } else {
        const bookId = formModal.modalData.bookId || formModal.modalData.BookId;
        await bookApi.update(bookId, formData);
        showToast('success', 'Cập nhật thông tin sách thành công');
      }
      formModal.closeModal();
      fetchBooks();
    } catch (err) {
      showToast('error', err.message || 'Lỗi lưu thông tin sách');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const bookId = deleteModal.modalData.bookId || deleteModal.modalData.BookId;
    setActionLoading(true);
    try {
      await bookApi.delete(bookId);
      showToast('success', 'Xóa đầu sách thành công');
      deleteModal.closeModal();
      fetchBooks();
    } catch (err) {
      showToast('error', err.message || 'Lỗi xóa đầu sách');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-2">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
        <h6 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Quản lý sách</h6>
        {(isAdmin || isStaff) && (
          <button className="btn btn-primary d-flex align-items-center gap-1 px-3 py-1.5 rounded-1" onClick={handleOpenAdd}>
            <span className="fs-5 lh-1">+</span> Thêm mới
          </button>
        )}
      </div>

      <div className="card-body p-0">
        {/* Search filter bar */}
        <form onSubmit={handleSearch} className="px-4 py-3 border-bottom bg-white d-flex gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: '250px' }}
            placeholder="Tìm theo tên hoặc mã sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            style={{ maxWidth: '200px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Tất cả danh mục --</option>
            {categories.map((c) => (
              <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-outline-primary px-3 bg-white">Tìm</button>
          <button type="button" className="btn btn-outline-secondary px-3 bg-white" onClick={handleReset}>Đặt lại</button>
        </form>

        {/* Presentational Table */}
        <BookTable
          books={books}
          isLoading={loading}
          page={page}
          pageSize={pageSize}
          onEdit={handleOpenEdit}
          onDelete={deleteModal.openModal}
          onManageCopies={copiesModal.openModal}
        />
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="card-footer bg-light border-top px-4 py-3 d-flex justify-content-between align-items-center">
          <span className="text-secondary small">Hiển thị {books.length} / {totalRecords} đầu sách</span>
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

      {/* Add / Edit Modal */}
      <BookFormModal
        isOpen={formModal.isOpen}
        mode={modalMode}
        initialData={formModal.modalData}
        categories={categories}
        authors={authors}
        publishers={publishers}
        onSave={handleSave}
        onCancel={formModal.closeModal}
        isLoading={actionLoading}
      />

      {/* Copies management Modal */}
      <BookCopiesModal
        isOpen={copiesModal.isOpen}
        book={copiesModal.modalData}
        onCancel={copiesModal.closeModal}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Xóa đầu sách"
        message={`Bạn có chắc chắn muốn xóa đầu sách "${deleteModal.modalData?.title || deleteModal.modalData?.Title}"? Hành động này sẽ xóa toàn bộ bản sao vật lý liên quan.`}
        onConfirm={handleDelete}
        onCancel={deleteModal.closeModal}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default BookContainer;
