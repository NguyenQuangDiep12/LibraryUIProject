import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { authApi } from "../apis/apis";
import { getPasswordStrength } from "../utils/helpers";

export default function RegisterPage(){
  const navigate = useNavigate();
  const { login } = useAuth();

  // Quan ly du lieu form va du lieu
  const [formData, setFormData] = new useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Theo doi do manh yeu cua mat khau
  const strengthPassword = getPasswordStrength(formData.password);

  // Ham bat su kien thay doi du lieu o nhap du lieu
  const handleChange = (e) => {
    const { name, value } = e.target;

    // luu thong tin nguoi dung nhap
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Xoa o loi khi nguoi dung nhap lai 
    if(error[name]){
      setError((prev) => ({ ...prev, [name]: '' }));
    }
  }

  // Ham validate du lieu 
  const validateForm = () => {
    const newError = {};

    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!formData.fullName.trim() || formData.fullName.length < 2){
      newError.fullName = 'Ho ten co toi thieu 2 ky tu';
    }else if(formData.fullName.length > 100){
      newError.fullName = 'Ho ten khong duoc vuot qua 100 ky tu';
    }

    if(!formData.email){
      newError.email = 'Vui long nhap email!';
    }else if(!regex.test(newError.email)){
      newError.email = 'Email khong hop le!';
    }

    if(!formData.phone){
      newError.phone = 'Vui long nhap so dien thoai!';
    }else if(formData.phone.trim().length < 10){
      newError.phone = 'So dien thoai khong hop le!';
    }

    if(!formData.password){
      newError.password = 'Vui long nhap mat khau';
    }else if(formData.password.length < 6){
      newError.password = 'Mat khau toi thieu 6 ky tu';
    }

    if(formData.confirmPassword.trim() !== formData.password.trim()){
      newError.confirmPassword = 'Mat khau xac nhan khong khop!';
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateForm){
      return;
    }

    setIsSubmitting(true);

    try{
      const { confirmPassword, ...payload } = formData;
      const result = await authApi.register(payload);

      if(result.success){
        login(result.data);
        // toast sucess (dang ky thanh cong!)
        navigate('/');
      }
    }catch(err){
      // toast error = (error.message || 'Dang ky that bai')
    }finally{
      setIsSubmitting(false);
    }
  }

  return(
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light px-3 py-4">
      <div className="w-100 rounded-4 border bg-white p-4 shadow-lg" style={{ maxWidth: '28rem' }}>
        <div className="mb-4 text-center">
          <span className="fs-1">📚</span>
          <h1 className="mt-2 fs-4 fw-bold text-dark">Đăng ký tài khoản</h1>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <label className="form-label mb-1 fw-medium text-secondary">FullName:</label>
          <input 
            label="Họ và tên" 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange} 
            error={error.fullName} 
          />
          <label className="form-label mb-1 fw-medium text-secondary">Email:</label>
          <input 
            label="Email" 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            error={error.email} 
          />
          <label className="form-label mb-1 fw-medium text-secondary">Phone Number:</label>
          <input 
            label="Số điện thoại" 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            error={error.phone} 
          />
          <label className="form-label mb-1 fw-medium text-secondary">Password:</label>
          <div>
            <input 
              label="Mật khẩu" 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              error={error.password} 
              className="w-100"
            />
            
            {formData.password && (
              <div className="mt-2">
                <div className="d-flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`flex-grow-1 rounded ${i <= strengthPassword.score ? 'bg-primary' : 'bg-secondary-subtle'}`}
                      style={{ height: '4px' }}
                    />
                  ))}
                </div>
                <p className="mt-1 small text-secondary">Độ mạnh: {strengthPassword.label}</p>
              </div>
            )}
          </div>
          <label className="form-label mb-1 fw-medium text-secondary">Confirm Password</label>
          <input 
            label="Xác nhận mật khẩu" 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            error={error.confirmPassword} 
          />

          <button type="submit" 
          className="w-100 btn btn-primary d-flex align-items-center justify-content-center gap-2" 
          disabled={isSubmitting}>
            {
              isSubmitting && (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              )
            }
            {isSubmitting ? 'Dang su ly....' : 'Dang ky'}
          </button>
        </form>

        <p className="mt-4 text-center small text-secondary mb-0">
          Đã có tài khoản?{' '}
          <Link to="/login" className="fw-medium text-primary text-decoration-none">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}