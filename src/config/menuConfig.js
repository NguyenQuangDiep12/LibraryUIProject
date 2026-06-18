import { faBell, faBookmark, faBuilding, faChartBar, faHouse, faUser } from '@fortawesome/free-regular-svg-icons';
import { Role } from '../constants/constants';
import { faArrowsRotate, faBook, faClockRotateLeft, faPenNib, faTags, faTriangleExclamation, faUsers, faUserTie } from '@fortawesome/free-solid-svg-icons';

export const MENU_ITEMS = [
  {
    path: '/',
    icon: faHouse,
    label: 'Home',
    allowedRoles: [Role.ADMIN, Role.STAFF, Role.READER],
  },
  {
    path: '/dashboard/statistics',
    icon: faChartBar,
    label: 'Thống kê',
    allowedRoles: [Role.ADMIN],
  },
  {
    path: '/dashboard/borrow',
    icon: faArrowsRotate,
    label: 'Mượn / Trả',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/borrow',
    icon: faClockRotateLeft,
    label: 'Lịch sử mượn',
    allowedRoles: [Role.READER],
  },
  {
    path: '/dashboard/books',
    icon: faBook,
    label: 'Quản lý sách',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/category',
    icon: faTags,
    label: 'Danh mục',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/author',
    icon: faPenNib,
    label: 'Tác giả',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/publisher',
    icon: faBuilding,
    label: 'Nhà xuất bản',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/reader',
    icon: faUsers,
    label: 'Độc giả',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/fine',
    icon: faTriangleExclamation,
    label: 'Vi phạm',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/reservation',
    icon: faBookmark,
    label: 'Đặt trước',
    allowedRoles: [Role.ADMIN, Role.STAFF],
  },
  {
    path: '/dashboard/notifications',
    icon: faBell,
    label: 'Thông báo',
    allowedRoles: [Role.READER],
  },
  {
    path: '/dashboard/staff',
    icon: faUserTie,
    label: 'Nhân viên',
    allowedRoles: [Role.ADMIN],
  },
  {
    path: '/dashboard/profile',
    icon: faUser,
    label: 'Cá nhân',
    allowedRoles: [Role.ADMIN, Role.STAFF, Role.READER],
  },
];

export default MENU_ITEMS;
