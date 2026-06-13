import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { authApi, userApi } from '../../apis/apis';
import { ColorStatus } from '../../constants/constants';

const USER_STATUS_MAP = {
  ACTIVE: { label: 'Hoạt động', className: ColorStatus.SUCCESS },
  LOCKED: { label: 'Đã khóa', className: ColorStatus.DANGER },
};

const CARD_STATUS_MAP = {
  ACTIVE: { label: 'Hoạt động', className: ColorStatus.SUCCESS },
  EXPIRED: { label: 'Hết hạn', className: ColorStatus.MUTED },
  BLOCKED: { label: 'Bị khóa', className: ColorStatus.DANGER },
};

function renderBadge(value, map) {
  if (!value) return '—';
  const info = map[value] || { label: value, className: ColorStatus.DISABLED };
  return <span className={info.className}>{info.label}</span>;
}

function Profile() {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    avatarUrl: '',
    role: '',
    status: '',
    libraryCardCode: '',
    cardStatus: '',
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadProfile(user.userId);
  }, [user]);

  const loadProfile = async (userId) => {
    try {
      const res = await userApi.getById(userId);
      const u = res.data;
      setProfile({
        fullName: u.fullName || '',
        email: u.email || '',
        phone: u.phone || '',
        address: u.address || '',
        avatarUrl: u.avatarUrl || '',
        role: u.role || '',
        status: u.status || '',
        libraryCardCode: u.libraryCardCode || '',
        cardStatus: u.cardStatus || '',
      });
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleUpdateProfile = async () => {
    if (user.role !== 'READER') {
      showToast('warning', 'Chỉ độc giả có thể tự cập nhật hồ sơ qua API này');
      return;
    }

    setUpdatingProfile(true);
    try {
      await userApi.updateProfile({
        fullName: profile.fullName.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim(),
        avatarUrl: profile.avatarUrl.trim() || null,
      });

      const updatedUser = { ...user, fullName: profile.fullName.trim() };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      showToast('success', 'Cập nhật hồ sơ thành công');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast('error', 'Mật khẩu xác nhận không khớp');
      return;
    }

    setChangingPassword(true);
    try {
      await authApi.resetPassword({
        oldPassword,
        password: newPassword,
        confirmPassword,
      });

      showToast('success', 'Đổi mật khẩu thành công');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="row g-3">
      <div className="col-md-8">
        {/* Thông tin cá nhân */}
        <div className="card shadow-sm mb-3">
          <div className="card-header fw-semibold">Thông tin cá nhân</div>
          <div className="card-body">
            <div className="mb-3 text-center">
              {profile.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  className="rounded-circle"
                  style={{ width: 80, height: 80, objectFit: 'cover' }}
                  alt="avatar"
                />
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Họ tên</label>
              <input
                type="text"
                className="form-control"
                value={profile.fullName}
                onChange={handleChange('fullName')}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={profile.email}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                value={profile.phone}
                onChange={handleChange('phone')}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                className="form-control"
                value={profile.address}
                onChange={handleChange('address')}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Avatar URL</label>
              <input
                type="url"
                className="form-control"
                value={profile.avatarUrl}
                onChange={handleChange('avatarUrl')}
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={handleUpdateProfile}
              disabled={updatingProfile}
            >
              <i className="bi bi-save me-1"></i>
              {updatingProfile ? 'Đang lưu...' : 'Cập nhật'}
            </button>
          </div>
        </div>

        {/* Đổi mật khẩu */}
        <div className="card shadow-sm">
          <div className="card-header fw-semibold">Đổi mật khẩu</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Mật khẩu cũ</label>
              <input
                type="password"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mật khẩu mới</label>
              <input
                type="password"
                className="form-control"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Xác nhận mật khẩu</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-warning"
              onClick={handleChangePassword}
              disabled={changingPassword}
            >
              <i className="bi bi-key me-1"></i>
              {changingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </div>
      </div>

      {/* Thông tin tài khoản */}
      <div className="col-md-4">
        <div className="card shadow-sm">
          <div className="card-header fw-semibold">Thông tin tài khoản</div>
          <div className="card-body">
            <p>
              <small className="text-muted">Vai trò</small>
              <br />
              <span>{profile.role || '—'}</span>
            </p>
            <p>
              <small className="text-muted">Trạng thái</small>
              <br />
              {renderBadge(profile.status, USER_STATUS_MAP)}
            </p>
            <p>
              <small className="text-muted">Mã thẻ</small>
              <br />
              <span>{profile.libraryCardCode || 'Chưa có thẻ'}</span>
            </p>
            <p>
              <small className="text-muted">Thẻ</small>
              <br />
              {renderBadge(profile.cardStatus, CARD_STATUS_MAP)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;