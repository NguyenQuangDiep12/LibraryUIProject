import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useRole } from '../hooks/useRole';

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { role, isAdmin, isStaff, isReader } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // If user accesses the base dashboard path, redirect to their authorized default tab
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      if (hasRedirected.current) return;
      if (isAdmin) {
        navigate('/dashboard/statistics', { replace: true });
      } else if (isStaff || isReader) {
        navigate('/dashboard/borrow', { replace: true });
      }
      hasRedirected.current = true;
    }
  }, [location.pathname, isAdmin, isStaff, isReader, navigate]);


  return (
    <div className="d-flex vh-100 bg-light">
      {/* 1. SIDEBAR: Fixed left navigation */}
      <Sidebar collapsed={collapsed} />

      {/* 2. RIGHT CONTENT AREA: Navbar, Outlet, and Footer */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Header / Navbar */}
        <Navbar onToggleSidebar={() => setCollapsed((prev) => !prev)} />

        {/* 3. MAIN OUTLET: Render matching sub-routes */}
        <main className="flex-grow-1 overflow-auto p-4 p-md-5">
          <React.Suspense fallback={
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          }>
            <Outlet />
          </React.Suspense>
        </main>

        {/* Footer */}
        <footer className="bg-white border-top px-4 py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
            <span>© {year} LibraryHub. All rights reserved.</span>
            <span>Phiên bản 1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;