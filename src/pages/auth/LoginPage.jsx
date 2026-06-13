import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../apis/apis";
import { Role } from "../../constants/constants";
import ForgotPassword from "../../components/ForgotPassword";
import { useToast } from "../../contexts/ToastContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remember, setRemember] = useState(false);
  const [openForgotModal, setOpenForgotModal] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Xóa lỗi field tương ứng và lỗi chung khi người dùng sửa lại
    if (error[name] || error.general) {
      setError(prev => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const validatedForm = () => {
    const newError = {};
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email) {
      newError.email = "Vui lòng nhập email";
    } else if (!regex.test(formData.email)) {
      newError.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newError.password = "Vui lòng nhập mật khẩu";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatedForm()) return;

    setIsSubmitting(true);
    setError({}); // clear lỗi cũ trước khi gọi API

    try {
      const result = await authApi.login(formData);

      // Sau interceptor, result chính là ApiResponse: { success, data, message }
      if (result?.success) {
        login(result.data); // Luu thong tin dang nhap

        // Kich hoat toast bao thanh cong
        showToast('Đăng nhập thành công!', 'SUCCESS');

        const role = result.data.userInfo?.role;
        if(role === Role.ADMIN){
           navigate('/dashboards');
        }
        else if (role === Role.STAFF) {
          navigate('/dashboard/staff');
        }
        else { 
          navigate('/reader/profile');
        }


      } else {
        showToast(result?.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại!');
      }
    } catch (err) {
      // err là payload reject từ axiosClient: { message } hoặc { success, message, data }
      switch (err?.statusCode) {
      case 400:
        // Lỗi validate input (email sai format, password < 6 ký tự...)
        setError({ general: err?.message || 'Thông tin đăng nhập không hợp lệ!' });
        break;
      case 401:
        setError({ general: err?.message || 'Email hoặc mật khẩu không đúng!' });
        break;
      case 403:
        setError({ general: err?.message || 'Tài khoản đã bị khóa!' });
        break;
      case 0:
        setError({ general: err?.message || 'Không thể kết nối đến máy chủ!' });
        break;
      default:
        setError({ general: err?.message || 'Đăng nhập thất bại, vui lòng thử lại sau!' });
      
      showToast(err?.message || 'Đăng nhập thất bại!', 'DANGER'); // Hiện lỗi bằng Toast
  }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light px-3">
      <div className="w-100 rounded-4 border bg-white p-4 shadow-lg" style={{ maxWidth: '28rem' }}>
        <div className="mb-4 text-center">
          <span className="fs-1">📚</span>
          <h1 className="mt-2 fs-4 fw-bold text-dark">Đăng nhập</h1>
          <p className="mt-1 small text-secondary">Hệ thống quản lý thư viện</p>
        </div>

        {/* Lỗi chung từ backend (sai email/mật khẩu, tài khoản bị khóa, lỗi server...) */}
        {error.general && (
          <div className="alert alert-danger py-2 small mb-3" role="alert">
            {error.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label mb-1 fw-medium text-secondary">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${error.email ? 'is-invalid' : ''}`}
              placeholder="Nhập email"
              autoComplete="email"
            />
            {error.email && <div className="invalid-feedback d-block">{error.email}</div>}
          </div>

          <div>
            <label className="form-label mb-1 fw-medium text-secondary">Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${error.password ? 'is-invalid' : ''}`}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />
            {error.password && <div className="invalid-feedback d-block">{error.password}</div>}
          </div>

          <label className="d-flex align-items-center gap-2 small text-secondary">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="form-check-input mt-0"
            />
            Ghi nhớ đăng nhập
          </label>

          <button type="submit" className="w-100 btn btn-primary" disabled={isSubmitting}>
            {isSubmitting && (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            )}
            {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-4 d-flex flex-column gap-2 text-center small">
          <div className="text-end my-2">
            <button
              type="button"
              onClick={() => setOpenForgotModal(true)}
              className="btn btn-link p-0 small text-decoration-none fw-medium"
            >
              Quên mật khẩu?
            </button>
          </div>

          <ForgotPassword show={openForgotModal} onClose={() => setOpenForgotModal(false)} />

          <p className="text-secondary mb-0">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="fw-medium text-primary text-decoration-none">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}