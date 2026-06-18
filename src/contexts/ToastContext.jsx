import { createContext, useCallback, useContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        show: false,
        message: '',
        color: 'SUCCESS',
        duration: 3000,
    });

    // Ham dung de kich hoat toast 
    const showToast = useCallback((message, color = "SUCCESS", duration = 3000) => {
        setToast({ show: true, message, color: color.toUpperCase(), duration});
    }, []);

    // Ham an toast
    const hideToast = useCallback(() => {
        setToast((prev) =>({
            ...prev, show: false,
        }));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/**component toast dung chung cho toan bo app*/}
            <Toast
                show={toast.show}
                message={toast.message}
                color={toast.color}
                duration={toast.duration}
                onClose={hideToast}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if(!context){
        throw new Error("useToast phải được đặt trong ToastProvider");
    }
    return context;
};