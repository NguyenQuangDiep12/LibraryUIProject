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

apiClient.interceptors.response.use((response) => response.data, (error) => {
    if(!error.response){
        // khong co response => time out hoac mat ket noi
        return Promise.reject({
            success: false,
            statusCode: 0,
            message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!',
        });
    }

    const { status, data } = error.response;

    // 401 => het phien dang nhap
    if(status === 401){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        if(!window.location.pathname.startsWith("/login"))
            window.location.href = "/login";
    return Promise.reject(data || { statusCode: 401, message: "Phiên đăng nhập đã hết hạn!"});
    }
    
    return Promise.reject(data || { success: false, statusCode: status, message: "Lỗi hệ thống!"})
});

export default apiClient;

