export const Role = {
    ADMIN: "ADMIN",
    STAFF: "STAFF",
    READER: "READER"
}

/**Status color*/

export const ColorStatus = Object.freeze({
    SUCCESS: 'badge bg-success-subtle text-success-emphasis',     // Xanh lá (Available, Active, Paid)
    WARNING: 'badge bg-warning-subtle text-warning-emphasis',     // Vàng/Cam (Pending, Borrowed)
    INFO: 'badge bg-info-subtle text-info-emphasis',              // Xanh dương (Reserved, Borrowing)
    DANGER: 'badge bg-danger-subtle text-danger-emphasis',        // Đỏ (Lost, Overdue, Locked)
    MUTED: 'badge bg-secondary-subtle text-secondary-emphasis',   // Xám đậm (Waiting, Cancelled)
    DISABLED: 'badge bg-light text-muted border',                 // Xám nhạt (Cancelled/Disabled hẳn)
}); // Object.freeze ngan chan hanh vi thay doi voi gia tri cua bien