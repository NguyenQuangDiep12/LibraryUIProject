import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="d-flex vh-100 bg-light">
      
      {/* 1. SIDEBAR: Cố định bên trái, hỗ trợ thu gọn */}
      <Sidebar collapsed={collapsed} />

      {/* 2. PHẦN BÊN PHẢI: Chứa Navbar, Nội dung và Footer */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        
        {/* Navbar cố định phía trên */}
        <Navbar onToggleSidebar={() => setCollapsed((prev) => !prev)} />

        {/* 3. MAIN CONTENT: Phần nội dung có thể cuộn (scroll) */}
        <main className="flex-grow-1 overflow-auto p-4 p-md-5">
          <Outlet/>
        </main>
        {/* Footer nằm ở dưới cùng của phần bên phải */}
        <Footer />
      </div>
      
    </div>
  );
};

export default DashboardPage;