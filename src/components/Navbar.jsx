import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faTrophy } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onToggleSidebar }) => {
  const { userInfo, logout } = useAuth();
  const user = userInfo || { name: 'Guest', role: '' };
  return (
    <nav className="navbar navbar-light bg-white border-bottom px-3 px-md-4 py-2">
      <div className="d-flex align-items-center justify-content-between w-100">
        {/* Bên trái: nút toggle + tiêu đề */}
        <div className="d-flex align-items-center">
          <button
            className="btn btn-light border-0 me-3 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span className="fs-4">☰</span>
          </button>
          <h4 className="mb-0 fw-bold text-dark">Dashboard</h4>
        </div>

        {/* Bên phải: thông tin người dùng */}
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold me-2"
            style={{ width: '40px', height: '40px' }}
          >
            {user.name?.charAt(0)}
          </div>
          <div className="d-none d-sm-flex flex-column me-3">
            <span className="fw-semibold text-dark" style={{ lineHeight: 1.2 }}>
              {user.name}
            </span>
            <span className="text-muted small" style={{ lineHeight: 1.2 }}>
              {user.role}
            </span>
          </div>
          <button
            className="btn btn-light border-0 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px' }}
            aria-label="Đăng xuất"
            title="Đăng xuất"
            onClick={logout}
          >
            <span className="fs-5">
              <FontAwesomeIcon icon={faRightFromBracket}/>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;