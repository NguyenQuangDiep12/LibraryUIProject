import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="breadcrumb">
      <style>{`
        .custom-breadcrumb .breadcrumb-item + .breadcrumb-item::before {
          color: #666 !important;
          content: ">" !important;
          padding: 0 8px;
        }
      `}</style>
      <ol className="breadcrumb mb-0 custom-breadcrumb" style={{ fontSize: '0.85rem' }}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return isLast ? (
            <li 
              key={idx} 
              className="breadcrumb-item active text-white" 
              aria-current="page" 
              style={{ opacity: 0.8 }}
            >
              {item.label}
            </li>
          ) : (
            <li key={idx} className="breadcrumb-item">
              <Link 
                to={item.path || "/"} 
                className="text-decoration-none" 
                style={{ color: 'var(--waka-text-muted)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--waka-text-white)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--waka-text-muted)'}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}