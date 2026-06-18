import React, { useState, useEffect } from 'react';

export const StaffFormModal = ({
  isOpen,
  mode = 'add',
  initialData = null,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFullName(initialData.fullName || initialData.FullName || '');
      setPhone(initialData.phone || initialData.Phone || '');
      setAddress(initialData.address || initialData.Address || '');
    } else {
      setEmail('');
      setFullName('');
      setPassword('');
      setPhone('');
      setAddress('');
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'add') {
      onSave({
        email: email.trim(),
        fullName: fullName.trim(),
        password,
        phone: phone.trim(),
        address: address.trim(),
      });
    } else {
      onSave({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel}></div>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1045 }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg rounded-3">
            <form onSubmit={handleSubmit}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">
                  {mode === 'edit' ? 'Cập nhật tài khoản nhân viên' : 'Tạo tài khoản nhân viên mới'}
                </h5>
                <button type="button" className="btn-close" onClick={onCancel} disabled={isLoading}></button>
              </div>
              
              <div className="modal-body row g-3">
                {mode === 'add' && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-medium small">Email <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-dark fw-medium small">Mật khẩu mới <span className="text-danger">*</span></label>
                      <input
                        type="password"
                        className="form-control"
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="col-12">
                  <label className="form-label text-dark fw-medium small">Họ tên nhân viên <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-dark fw-medium small">Số điện thoại {mode === 'add' && <span className="text-danger">*</span>}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={mode === 'add'}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-dark fw-medium small">Địa chỉ {mode === 'add' && <span className="text-danger">*</span>}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required={mode === 'add'}
                  />
                </div>
              </div>

              <div className="modal-footer border-top gap-2">
                <button type="button" className="btn btn-sm btn-light" onClick={onCancel} disabled={isLoading}>Hủy</button>
                <button type="submit" className="btn btn-sm btn-primary px-3" disabled={isLoading}>
                  {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
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

export default StaffFormModal;
