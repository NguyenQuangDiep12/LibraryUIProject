import { useEffect, useState } from "react";

// 1. custom hook bat buoc phai dinh nghia ham bat dau = use
export function useDebounce(value, delay = 500){
    // 2. Tao mot state noi bo de luu tru gia tri da duoc tri hoan
    const [debouncedValue, setDebouncedValue] = useState(value);

    //3. su dung useEffect de theo doi khi moi value thay doi hoac delay thay doi
    useEffect(() => {
        // 4. thiet lap thoi gian reload
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // ham tao khi value tiep tuc thay doi se chay
        return () => {
            clearTimeout(timer); // xoa thoi gian cu de tao thoi gian moi
        };
    }, [value, delay]);

    // 5. Tra ve gia tri duoc tri hoan de component ben ngoai dung
    return debouncedValue;
}