import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-top px-4 py-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
        <span>© {year} LibraryHub. All rights reserved.</span>
        <span>Phiên bản 1.0.0</span>
      </div>
    </footer>
  );
};

export default Footer;