import React from 'react'

const Navbar = () => {

  return (
    <div className='navbar'>
      <header className="topbar d-flex align-items-center justify-content-between px-4">
        <div className='d-flex align-items-center gap-3'> // Thanh thong tin Trang
          <button className='btn btn-link text-dark' id='sidebarToggle'> // thay doi dong
            <i className="bi bi-list fs-4"></i>
          </button>
          <h5 className="mb-0" id='pageTitle'>DashBoard</h5> // thay doi dong
        </div>
        <div className='d-flex align-items-center gap-3'> // Thanh thong tin ben trai
          <div className='d-flex align-items-center gap-2'> 
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" 
            style={{ width: '36px', height: '36px' }} id="userAvatar"></div> // avatar nguoi dung
            <div className='d-none d-sm-block'> // Thong tin nguoi dung
              <div className='fw-semibold small' id='userName'></div> // Ten nguoi dung
              <div className='small text-muted' style={{fontSize: "0.7rem"}} id='userRole'></div> // Vai tro nguoi dung
            </div>
            <button className='btn btn-outline-secondary btn-sm' id='btnLogout'>
              <i className='bi bi-box-arrow-right'></i>
            </button>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Navbar