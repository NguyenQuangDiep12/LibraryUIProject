import { Role } from '../constants/constants';

export const MENU_ITEMS = [
  {
    path: '/',
    icon: '🏠',
    label: 'Home',
    allowedRoles: [Role.ADMIN, Role.STAFF, Role.READER],
  },
  {
    path: '/dashboard/statistics',
    icon: '📊',
    label: 'Thống kê',
    allowedRoles: [Role.ADMIN],
  },
  {
    path: '/dashboard/borrow',
    icon: '🔄',
    label: 'Mượn / Trả',
    allowedRoles: [Role.ADMIN, Role.STAFF, Role.READER],
  },
  {
    path: '/dashboard/books',
    icon: '📖',
    label: 'Quản lý sách',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/category',
    icon: '🏷️',
    label: 'Danh mục',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/author',
    icon: '✏️',
    label: 'Tác giả',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/publisher',
    icon: '🏢',
    label: 'Nhà xuất bản',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/reader',
    icon: '👥',
    label: 'Độc giả',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/fine',
    icon: '🚫',
    label: 'Vi phạm',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/reservation',
    icon: '🔖',
    label: 'Đặt trước',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/notifications',
    icon: '🔔',
    label: 'Thông báo',
    allowedRoles: [Role.READER],
  },
  {
    path: '/dashboard/staff',
    icon: '🪪',
    label: 'Nhân viên',
    allowedRoles: [Role.ADMIN],
  },
  {
    path: '/dashboard/profile',
    icon: '👤',
    label: 'Cá nhân',
    allowedRoles: [Role.ADMIN, Role.STAFF, Role.READER],
  },
];

export default MENU_ITEMS;
