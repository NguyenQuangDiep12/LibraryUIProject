// CONFIG REQUEST AXIOS
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:5131/api",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        success: false,
        statusCode: 0,
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!',
      });
    }

    const { status, data } = error.response;

    // Chuẩn hóa message: hỗ trợ cả ApiResponse {message} và ValidationProblemDetails {errors}
    let message = data?.message;
    if (!message && data?.errors) {
      const firstError = Object.values(data.errors)?.[0];
      message = Array.isArray(firstError) ? firstError[0] : data.title;
    }
    if (!message) {
      message = data?.title || 'Lỗi hệ thống!';
    }

    const normalized = { ...(data || {}), success: false, statusCode: status, message };

    if (status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject({ ...normalized, message: normalized.message || 'Phiên đăng nhập đã hết hạn!' });
    }

    return Promise.reject(normalized);
  }
);
export default apiClient;

