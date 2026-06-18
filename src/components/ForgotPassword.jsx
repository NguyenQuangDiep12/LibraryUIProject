import React, { useEffect, useRef, useState } from 'react';
import { authApi } from '../apis/apis';
import { useToast } from '../contexts/ToastContext';

export default function ForgotPassword({ show, onClose }){
  const [otpNumber, setOtpNumber] = useState(['','','','','','']);
  const [loading, setLoading ] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [countDown, setCountDown] = useState(300);
  const inputRefs = useRef([]);
  const { showToast } = useToast();

  // step 1: Nhap email, step 2: Nhap OTP
  const [step, setStep] = useState(1);

  useEffect(() => {
    if(step !== 2 || countDown <= 0) return;
    const timer = setTimeout(() => setCountDown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countDown, step]);

  // neu nhu khong show thi an modal
  if(!show){
    return null;
  }

  // Ham xu ly: Gui email de lay ma otp o gmail (POST: /api/auth/forgot-password)
  const handleSendEmail = async (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!email){
      setErrorMessage('Email không được để trống!');
      return;
    }

    if(!regex.test(email)){
      setErrorMessage('Email không đúng định dạng!');
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try{
      const result = await authApi.forgotPassword({email});

      if(result?.success){
        setCountDown(300);
        showToast('Mã OTP đã được gửi đến gmail của bạn!');

        setStep(2); // chuyen sang step 2 nhap 6 ma otp
      }else{
        setErrorMessage(result?.message || 'Email khong ton tai!');
      }

    }catch(err){

      setErrorMessage(err?.message || "Co loi he thong xay ra, vui long thu lai sau!");
    }finally{
      setLoading(false);
    }
  };

  // Ham xu ly gui OTP len de nhan mat khau moi (POST: /api/auth/verify-otp)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otpNumber.join(""); // noi chuoi 6 ky tu thanh chuoi string "123456"

    if(otpCode.length < 6){
      setErrorMessage("Vui long nhap du 6 ky tu!");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try{
      const result = await authApi.verifyOtp({email, otp: otpCode});

      if(result?.success){
        showToast('Mã OTP hợp lệ mật khẩu mới đã được gửi qua email', 'SUCCESS');
        handleCloseModal();
      }else{
        setErrorMessage(result?.message || 'Ma OTP khong dung hoac da het han!');
      }
    }catch(err){
      setErrorMessage(err?.message || "Xac thuc that bai, vui long kiem tra lai ma OTP!");
    }finally{
      setLoading(false);
      setErrorMessage("");
    }
  };

   // Gui lai ma OTP 
  const handleResendOtp = async () => {
    setCountDown(300);
    setErrorMessage("");

    try{
      await authApi.forgotPassword({email});

    }catch(err){
      setErrorMessage("Khong the gui lai ma luc nay!");
    }
  };

  function handleCloseModal(){
    setEmail("");
    setOtpNumber(new Array(6).fill(""));
    setCountDown(300);
    setErrorMessage("");
    setStep(1);
    onClose(); // Kich hoat dong tu trang cha
  }

  function handleOtpChange(index, value){
    // Loại bỏ các ký tự lạ không phải số và lấy ký tự cuối cùng
    const digitRegex = value.replace(/[^0-9]/g, '').slice(-1);

    const newOtp = [...otpNumber];
    newOtp[index] = value;
    setOtpNumber(newOtp);

    // tu dong chuyen sang (focus) sang o tiep theo
    if(value !== "" && index < 5){
      inputRefs.current[index + 1]?.focus();
    }
  };


  return(
    <>
      {/**Lop mo nen*/}
        {/**Giao dien chinh cua Modal*/}
        <div className='modal fade show d-block' onClick={handleCloseModal} tabIndex="-1" style={{zIndex: 1050, background: "rgba(0,0,0,0.5)"}}>
          <div className='modal-dialog modal-dialog-centered' style={{maxWidth: "26rem"}}>
            <div className='modal-content rounded-4 p-3 shadow-lg border-0' onClick={(e) => e.stopPropagation()}>
              {/**Header Modal*/}
              <div className='modal-header border-0 pb-0 d-flex justify-content-between align-items-center'>
                <h5 className='modal-title fw-bold text-dark'>Quen mat khau</h5>
                <button type='button' className='btn-close shadow-none' onClick={handleCloseModal}></button>
              </div>
              {/**Body Modal*/}
              <div className='modal-body py-3'>
                {/**Hien thi dong thong bao loi chung neu co*/}
                {errorMessage && (
                  <div className='alert alert-danger py-2 small mb-3 text-center' role='alert'>
                    {errorMessage}
                  </div>
                )}

                {/** Giao dien 1: Nhap Email quen mat khau de gui ma OTP*/}
                {step === 1 && (
                  <form onSubmit={handleSendEmail}>
                    <p className='text-secondary small mb-3'>
                      Vui long nhap dia chi email cua ban. <br/>He thong se gui mot ma OTP xac thuc ve Gmail
                    </p>
                    <div className='mb-4'>
                      <label className='form-lable small fw-medium text-secondary mb-2'>Email tai khoan:</label>
                      <input 
                        type='email' 
                        required 
                        placeholder='name@example.com' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className='form-control'// Da them class Bootstrap
                        />
                    </div>
                    <button type='submit' className='btn btn-primary w-100 py-2' disabled={loading}>
                      { loading ? (<span className='spinner-border spinner-border-sm me-2'></span>) : null }
                      { loading ? "Dang xy ly..." : "Gui ma xac thuc"}
                    </button>
                  </form>
                )}

                {/**Giao dien 2: Nhap ma OTP 6 chu so */}
                {step === 2 && (
                  <form onSubmit={handleVerifyOtp}>
                    <p className='text-secondary small mb-2 text-center'>
                      Ma xac thuc gom 6 chu so da duoc gui toi Gmail: <br/>
                      <strong className='text-dark'>{email}</strong>
                    </p>
                    
                    <div className='mb-4'>
                      <div className='d-flex justify-content-between gap-2 my-3'>
                        {otpNumber.map((value, index) => (
                          <input 
                            className='form-control text-center fs-5 fw-bold p-0 shadow-none'
                            style={{width: '3rem', height: '3.2rem'}}
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type='text'
                            inputMode='numeric'
                            maxLength={1}
                            value={value}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                          />
                        ))}
                      </div>

                      {/**Dem nguoc thoi gian hạn mã OTP*/}
                      <p className='text-center small text-secondary mb-0'>
                        {countDown > 0 ? 
                        (
                          <>Mã hết hạn sau: <span className='fw-bold text-danger'>{countDown}s</span></>
                        ) : 
                        (
                          <button type='button' 
                          onClick={handleResendOtp} 
                          className='btn btn-link p-0 small text-decoration-none fw-medium'>
                            Gui lai ma OTP
                          </button>
                        )}
                      </p>
                    </div>
                    
                    {/**Nut dieu huong*/}
                    <div className='d-flex gap-2'>
                      <button 
                        type='button' 
                        className='btn btn-light border w-50 py-2'
                        onClick={() => {setStep(1); setErrorMessage("");}}
                        disabled={loading}
                      >
                        Quay lại
                      </button>
                      <button type='submit' className='btn btn-primary w-50 py-2' disabled={loading}>
                        { loading ? 
                        (<span className='spinner-border spinner-border-sm me-2'></span>)
                        :
                          null
                        }
                        Xác thực mã
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
    </>
  );
}