// CONFIG REQUEST AXIOS
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:7067/api",
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
    if(error.response?.status === 401){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        if(!window.location.pathname.startsWith('/login')){
            window.location.href = '/login';
        }
         const payload = error.response?.data;
        return Promise.reject(payload || { message: error.message || 'Loi he thong!' });
        }

        const errorPayload = error.response?.data || {
            message: error.message || 'Loi ket noi den he thong!'
        };
        return Promise.reject(errorPayload);
    }
);

export default apiClient;

