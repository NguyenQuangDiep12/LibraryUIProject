import React, { useState } from 'react';
import StatusBadge from '../../../components/common/StatusBadge';

export const ProfileForm = ({
  profile,
  isReader,
  onUpdateProfile,
  onChangePassword,
  updatingProfile = false,
  changingPassword = false,
}) => {
  const [profileData, setProfileData] = useState({
    fullName: profile.fullName || '',
    phone: profile.phone || '',
    address: profile.address || '',
    avatarUrl: profile.avatarUrl || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    onChangePassword(passwordForm, () => {
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    });
  };

  const getStatusType = (status) => (status?.toUpperCase() === 'ACTIVE' ? 'success' : 'danger');
  const getStatusLabel = (status) => (status?.toUpperCase() === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa');

  const getCardStatusType = (cStatus) => {
    switch (cStatus?.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'BLOCKED': return 'danger';
      case 'EXPIRED':
      default: return 'muted';
    }
  };

  const getCardStatusLabel = (cStatus) => {
    switch (cStatus?.toUpperCase()) {
      case 'ACTIVE': return 'Hoạt động';
      case 'BLOCKED': return 'Bị khóa';
      case 'EXPIRED': return 'Hết hạn';
      default: return cStatus || '—';
    }
  };

  return (
    <div className="row g-3">
      {/* Cột trái: Form thông tin & Form mật khẩu */}
      <div className="col-md-8">
        
        {/* Card 1: Thông tin cá nhân */}
        <div className="card shadow-sm mb-3 border-0">
          <div className="card-header bg-white fw-bold text-dark py-3">Thông tin cá nhân</div>
          <div className="card-body">
            <form onSubmit={handleProfileSubmit}>
              <div className="mb-3 text-center">
                <img
                  src={profileData.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=eaeaea&color=adb5bd&size=80'}
                  className="rounded-circle border"
                  style={{ width: 80, height: 80, objectFit: 'cover' }}
                  alt="avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://ui-avatars.com/api/?name=User&background=eaeaea&color=adb5bd&size=80';
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Họ tên</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  disabled={!isReader}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Email (Tài khoản)</label>
                <input
                  type="email"
                  className="form-control"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  disabled={!isReader}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  disabled={!isReader}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Avatar URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="avatarUrl"
                  value={profileData.avatarUrl}
                  onChange={handleProfileChange}
                  disabled={!isReader}
                />
              </div>

              {isReader ? (
                <button type="submit" className="btn btn-primary px-3" disabled={updatingProfile}>
                  {updatingProfile ? 'Đang lưu...' : 'Cập nhật thông tin'}
                </button>
              ) : (
                <div className="alert alert-info py-2 small mb-0">
                  Lưu ý: Chỉ độc giả có quyền tự cập nhật thông tin cá nhân.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Card 2: Đổi mật khẩu */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white fw-bold text-dark py-3">Đổi mật khẩu</div>
          <div className="card-body">
            <form onSubmit={handlePasswordSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small text-secondary">Mật khẩu cũ <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-secondary">Mật khẩu mới <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    minLength={6}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-secondary">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-warning mt-3 px-3 fw-medium text-dark" disabled={changingPassword}>
                {changingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Cột phải: Thông tin thẻ & Tài khoản */}
      <div className="col-md-4">
        <div className="card shadow-sm border-0 text-dark">
          <div className="card-header bg-white fw-bold py-3">Chi tiết tài khoản</div>
          <div className="card-body">
            <div className="mb-3">
              <small className="text-secondary d-block mb-1">Vai trò hệ thống</small>
              <span className="badge bg-secondary px-2.5 py-1.5 fw-semibold">{profile.role || '—'}</span>
            </div>

            <div className="mb-3">
              <small className="text-secondary d-block mb-1">Trạng thái tài khoản</small>
              <StatusBadge status={getStatusLabel(profile.status)} type={getStatusType(profile.status)} />
            </div>

            <div className="mb-3">
              <small className="text-secondary d-block mb-1">Mã thẻ thư viện</small>
              <span className="font-monospace fw-bold text-primary">{profile.libraryCardCode || 'Chưa cấp thẻ'}</span>
            </div>

            <div className="mb-0">
              <small className="text-secondary d-block mb-1">Trạng thái thẻ</small>
              <StatusBadge status={getCardStatusLabel(profile.cardStatus)} type={getCardStatusType(profile.cardStatus)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
