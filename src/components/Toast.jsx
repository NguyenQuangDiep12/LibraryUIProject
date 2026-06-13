import { useEffect } from "react";
import { ColorStatus } from "../constants/constants";

export default function Toast({ show, message, color, duration = 3000, onClose}){
    useEffect(() => {
        if(!show){
            return;
        }

        const timer = setTimeout(() => {
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [show, duration, onClose]);

    if(!show){
        return null;
    }

    let colorClass;

    switch(color){
        case "SUCCESS":
            colorClass = ColorStatus.SUCCESS;
        break;
        case "WARNING":
            colorClass = ColorStatus.WARNING;
        break;
        case "INFO":
            colorClass = ColorStatus.INFO;
        break;
        case "DANGER":
            colorClass = ColorStatus.DANGER;
        break;
        case "MUTED":
            colorClass = ColorStatus.MUTED;
        break;
        case "DISABLED":
            colorClass = ColorStatus.DISABLED;
        break;
        default:
            colorClass = ColorStatus.MUTED;
    }

    return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <div className={`toast show shadow-sm ${colorClass}`}>
            <div className="d-flex">
                <div className="toast-body"> {message} </div>
                <button type="button" className="btn-close me-2 m-auto" onClick={onClose}/>
            </div>
        </div>
    </div>
    );
}