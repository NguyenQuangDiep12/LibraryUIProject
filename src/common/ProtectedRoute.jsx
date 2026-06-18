import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // Lấy dữ liệu từ localStorage (tuỳ thuộc vào cách bạn lưu lúc login)
  const token = localStorage.getItem('accessToken');
  const userString = localStorage.getItem('user'); // Giả sử bạn lưu chuỗi JSON thông tin user

  // 1. Kiểm tra đăng nhập: Không có token hoặc user -> Về trang login
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userString);
  const userRole = user?.role; // Ví dụ: 'READER', 'STAFF', hoặc 'ADMIN'

  // 2. Kiểm tra quyền: Nếu role của user không nằm trong danh sách cho phép -> Về trang mặc định
  if (!allowedRoles.includes(userRole)) {
    // Thường sẽ điều hướng về trang báo lỗi 403 (Unauthorized) hoặc trang profile/dashboard
    return <Navigate to="/dashboard/profile" replace />; 
  }

  // 3. Hợp lệ: Render các component con bên trong
  return <Outlet />;
};

export default ProtectedRoute;