import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { authApi, userApi } from '../../apis/apis';
import ProfileForm from './components/ProfileForm';

export const ProfileContainer = () => {
  const { userInfo, setUserInfo } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const currentUserId = userInfo?.userId || userInfo?.UserId;
  const isReader = (userInfo?.role || userInfo?.Role) === 'READER';

  useEffect(() => {
    if (currentUserId) {
      loadProfile();
    }
  }, [currentUserId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await userApi.getById(Number(currentUserId));
      setProfile(res.data || res.Data);
    } catch (err) {
      showToast(err.message || 'Lỗi tải hồ sơ cá nhân', 'DANGER');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    setUpdating(true);
    try {
      await userApi.updateMyProfile(formData);
      showToast('Cập nhật thông tin cá nhân thành công', 'SUCCESS');
      
      // Sync local context state
      const updatedUser = { ...userInfo, fullName: formData.fullName };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUserInfo(updatedUser);
      loadProfile();
    } catch (err) {
      showToast(err.message || 'Lỗi cập nhật thông tin', 'DANGER');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (passData, resetFormCallback) => {
    if (passData.newPassword !== passData.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp', 'DANGER');
      return;
    }
    setChangingPass(true);
    try {
      await authApi.resetPassword({
        oldPassword: passData.oldPassword,
        password: passData.newPassword,
        confirmPassword: passData.confirmPassword,
      });
      showToast('Thay đổi mật khẩu thành công', 'SUCCESS');
      if (resetFormCallback) resetFormCallback();
    } catch (err) {
      showToast(err.message || 'Lỗi thay đổi mật khẩu', 'DANGER');
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary me-2" role="status"></div>
        <span className="text-secondary small">Đang tải hồ sơ...</span>
      </div>
    );
  }

  if (!profile) {
    return <div className="alert alert-danger">Không thể tải thông tin hồ sơ cá nhân.</div>;
  }

  return (
    <ProfileForm
      profile={profile}
      isReader={isReader}
      onUpdateProfile={handleUpdateProfile}
      onChangePassword={handleChangePassword}
      updatingProfile={updating}
      changingPassword={changingPass}
    />
  );
};

export default ProfileContainer;
