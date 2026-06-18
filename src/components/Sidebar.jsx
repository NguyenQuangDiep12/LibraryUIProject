import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import { MENU_ITEMS } from '../config/menuConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Sidebar = ({ collapsed }) => {
  const { role } = useRole();

  // Filter menu items by allowed roles
  const filteredMenuItems = MENU_ITEMS.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(role)
  );

  return (
    <div
      className={`bg-dark text-white d-flex flex-column flex-shrink-0 ${
        collapsed ? 'sidebar-collapsed' : ''
      }`}
      style={{
        width: collapsed ? '80px' : '260px',
        transition: 'width 0.3s ease',
        overflowX: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        className="d-flex align-items-center px-3 py-3 border-bottom border-secondary"
        style={{ height: '64px' }}
      >
        <span className="fs-4 me-2">📖</span>
        {!collapsed && (
          <span className="fs-5 fw-bold text-white text-nowrap">LibraryHub</span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-grow-1 overflow-auto py-2">
        <ul className="nav nav-pills flex-column">
          {filteredMenuItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/' || item.path === '/dashboard'}
                className={({ isActive }) =>
                  `nav-link rounded-0 d-flex align-items-center text-white px-3 py-2 ${
                    isActive ? 'active bg-primary' : 'text-white-50'
                  }`
                }
              >
                <span className="fs-5" style={{ width: '24px' }}>
                  <FontAwesomeIcon icon={item.icon} className='fs-5'/>
                </span>
                {!collapsed && <span className="ms-2 text-nowrap">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;