import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-5 pb-4" style={{ backgroundColor: '#111111', borderTop: '1px solid #333', color: '#a3a3a3', fontSize: '0.9rem' }}>
      
      <div className="container">
        <div className="row">
          

          <div className="col-lg-4 col-md-12 mb-4 pe-lg-5">
            <h2 className="fw-bold mb-3" style={{ color: '#20c997' }}>WAKA</h2>
            <p className="text-white mb-2 fw-medium">Công ty cổ phần sách điện tử Waka</p>
            <p className="mb-1">0877736289</p>
            <p>Support@nhp.vn</p>
          </div>


          <div className="col-lg-2 col-md-3 col-6 mb-4">
            <h6 className="text-white mb-3 fw-bold">Về chúng tôi</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to='/about-us' className="text-decoration-none text-secondary footer-link">Giới thiệu</Link></li>
            </ul>
          </div>


          <div className="col-lg-2 col-md-3 col-6 mb-4">
            <h6 className="text-white mb-3 fw-bold">Thông tin hữu ích</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><a href="#" className="text-decoration-none text-secondary footer-link">Quy định riêng tư</a></li>
            </ul>
          </div>

          {/* SỬA LỖI 2: Tách Hỗ trợ khách hàng ra 1 cột riêng (Chiếm 2 cột) */}
          <div className="col-lg-2 col-md-3 col-6 mb-4">
            <h6 className="text-white mb-3 fw-bold">Hỗ trợ khách hàng</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/complain" className="text-decoration-none text-secondary footer-link">Giải quyết khiếu nại</Link></li>
            </ul>
          </div>
        </div>
        
        <hr style={{ borderColor: '#333' }} className="my-4" />
        

        <div className="row">
          <div className="col-12 text-center text-md-start">
            <p className="mb-0 text-secondary" style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
              Công ty Cổ phần Sách điện tử NHP - Tầng 6, Tháp văn phòng<br/>
              Giấy xác nhận Đăng ký hoạt động phát hành xuất bản phẩm điện tử
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;