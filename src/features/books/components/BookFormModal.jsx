import React, { useState, useEffect } from 'react';

export const BookFormModal = ({
  isOpen,
  mode = 'add',
  initialData = null,
  categories = [],
  authors = [],
  publishers = [],
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [authorSearch, setAuthorSearch] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    publisherId: '',
    categoryIds: [],
    authorIds: [],
    language: 'Tiếng Việt',
    description: '',
    coverImage: '',
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title || initialData.Title || '',
        isbn: initialData.isbn || initialData.ISBN || '',
        publisherId: initialData.publisherId || initialData.PublisherId || '',
        categoryIds: initialData.categoryIds || initialData.CategoryIds || [],
        authorIds: initialData.authorIds || initialData.AuthorIds || [],
        language: initialData.language || initialData.Language || 'Tiếng Việt',
        description: initialData.description || initialData.Description || '',
        coverImage: initialData.coverImage || initialData.CoverImage || '',
      });
    } else {
      setFormData({
        title: '',
        isbn: '',
        publisherId: publishers[0]?.id || publishers[0]?.publisherId || '',
        categoryIds: [],
        authorIds: [],
        language: 'Tiếng Việt',
        description: '',
        coverImage: '',
      });
    }
  }, [initialData, mode, isOpen, publishers]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (field, id) => {
    setFormData((prev) => {
      const list = prev[field];
      const newList = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      return { ...prev, [field]: newList };
    });
  };

  const filteredAuthors = authors.filter((a) => {
    const name = a.name || a.Name || '';
    return name.toLowerCase().includes(authorSearch.toLowerCase());
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      publisherId: Number(formData.publisherId),
      categoryIds: formData.categoryIds.map(Number),
      authorIds: formData.authorIds.map(Number),
    });
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel}></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1045 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg rounded-3">
            <form onSubmit={handleSubmit}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">
                  {mode === 'edit' ? 'Cập nhật thông tin sách' : 'Thêm sách mới'}
                </h5>
                <button type="button" className="btn-close" onClick={onCancel} disabled={isLoading}></button>
              </div>

              <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <div className="row g-3">
                  {/* Title */}
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-medium small">Tên sách <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* ISBN */}
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-medium small">ISBN <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Publisher */}
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-medium small">Nhà xuất bản <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      name="publisherId"
                      value={formData.publisherId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn nhà xuất bản --</option>
                      {publishers.map((p) => {
                        const id = p.id || p.publisherId;
                        return <option key={id} value={id}>{p.name}</option>;
                      })}
                    </select>
                  </div>

                  {/* Language */}
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-medium small">Ngôn ngữ <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Cover Image */}
                  <div className="col-md-12">
                    <label className="form-label text-dark fw-medium small">Link ảnh bìa <span className="text-danger">*</span></label>
                    <input
                      type="url"
                      className="form-control"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleChange}
                      placeholder="https://example.com/cover.png"
                      required
                    />
                  </div>

                  {/* Categories checkboxes */}
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-medium small d-block">Danh mục sách <span className="text-danger">*</span></label>
                    <div className="border rounded p-3 bg-light" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {categories.map((c) => {
                        const id = c.id || c.categoryId;
                        const isChecked = formData.categoryIds.includes(id);
                        return (
                          <div className="form-check" key={id}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`cat-${id}`}
                              checked={isChecked}
                              onChange={() => handleMultiSelect('categoryIds', id)}
                            />
                            <label className="form-check-label text-dark small" htmlFor={`cat-${id}`}>
                              {c.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Authors checkboxes */}
                  <div className="col-md-6">
                    <label className="form-label text-dark fw-medium small d-block">Tác giả <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm mb-2" 
                      placeholder="Tìm kiếm tác giả..." 
                      value={authorSearch}
                      onChange={(e) => setAuthorSearch(e.target.value)}
                    />
                    <div className="border rounded p-3 bg-light" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {filteredAuthors.map((a) => {
                        const id = a.id || a.authorId;
                        const isChecked = formData.authorIds.includes(id);
                        return (
                          <div className="form-check" key={id}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`auth-${id}`}
                              checked={isChecked}
                              onChange={() => handleMultiSelect('authorIds', id)}
                            />
                            <label className="form-check-label text-dark small" htmlFor={`auth-${id}`}>
                              {a.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-md-12">
                    <label className="form-label text-dark fw-medium small">Mô tả tóm tắt sách <span className="text-danger">*</span></label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top gap-2">
                <button
                  type="button"
                  className="btn btn-light px-3 py-1.5 text-secondary fw-semibold small"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-3 py-1.5 fw-semibold small d-flex align-items-center gap-1"
                  disabled={isLoading || formData.categoryIds.length === 0 || formData.authorIds.length === 0}
                >
                  {isLoading && <span className="spinner-border spinner-border-sm" role="status"></span>}
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookFormModal;
