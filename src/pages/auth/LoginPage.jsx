import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import { authApi } from "../apis/apis";
import { Role } from "../constants/constants"

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // lay ra ham login trong AuthContext
  // Khoi tao cac State quan ly du lieu
  const [formData, setFormData] = useState({email: '', password: ''});
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remember, setRemember] = useState(false);

  // Ham bat su kien khi nguoi dung go phim
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cap nhat gia tri vao state formData
    setFormData(prev => ({...prev, [name]: value}));

    // Tu dong xoa dong thong bao loi khi nguoi dung bat dau sua lai truong 
    if(error[name]){
      setError(prev => ({...prev, [name]: ''}));
    }
  }

  // Ham kiem tra du lieu nhap vao
  const validatedForm = () => {
    const newError = {};

    // kiem tra dinh dang email bang regex
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!formData.email){
      newError.email = "Vui long nhap email";
    }else if(!regex.test(formData.email)){
      newError.email = "Emai hoac mat khau khong hop le!";
    }

    // kiem tra password
    if(!formData.password){
      newError.password = "Vui long nhap mat khau";
    }

    setError(newError);

    // tra ve true neu object newError rong (khong co loi nao)
    return Object.keys(newError).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngan chan hanh vi mac dinh cua form 

    // chay kiem tra du lieu, neu loi ngung lun khong chay API
    if(!validatedForm()){
      return;
    }

    setIsSubmitting(true);

    try{
      const result = await authApi.login(formData);

      if(result?.success){
        login(result.data); // Login tu AuthContext();
        // Toast dang nhap thanh cong

        const role = result.data.userInfo?.role;
        if(role === Role.ADMIN) navigate('/dashboards');
        else if(role === Role.STAFF) navigate(`/dashboard/staff`)
        else navigate('/reader/profile')
      }else{
        alert(result?.message || 'Dang nhap that bai, vui long kiem tra lai!');
      }
    }catch(err){
      // toast err.message || Dang nhap that bai
      console.log(err || "Dang nhap khong thanh cong!");
    }finally{
      setIsSubmitting(false);
    }
  }

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light px-3">
      <div className="w-100 rounded-4 border bg-white p-4 shadow-lg" style={{maxWidth: '28rem'}}>
        <div className="mb-4 text-center">
      <span className="fs-1">📚</span>
      <h1 className="mt-2 fs-4 fw-bold text-dark">Đăng nhập</h1>
      <p className="mt-1 small text-secondary">Hệ thống quản lý thư viện</p>
      </div>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <label className="form-label mb-1 fw-medium text-secondary">Email:</label>
        <input 
          label="Email" 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={error.email} 
        />
        <label className="form-label mb-1 fw-medium text-secondary">Password:</label>
        <input 
          label="Mật khẩu" 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={error.password} 
        />

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
             <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          )}
          {isSubmitting ? 'Dang xu ly....' : 'Dang Ky'}
        </button>
      </form>

      <div className="mt-4 d-flex flex-column gap-2 text-center small">
        <Link to="/forgot-password" className="d-block text-primary text-decoration-none">
          Quên mật khẩu?
        </Link>
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