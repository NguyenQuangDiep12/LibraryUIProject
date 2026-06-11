export function getPasswordStrength(password){
    // Tieu chi danh gia 
    /**
     * 1. Co ky tu viet hoa
     * 2. co ky tu dac biet
     * 3. toi thieu 6 ky tu
     */
    if (!password) return { score: 0, label: '' }
    
    let score = 0
    
    if (password.length >= 6) score++
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    const labels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh', 'Rất mạnh']
    
    return { score, label: labels[score] }

}