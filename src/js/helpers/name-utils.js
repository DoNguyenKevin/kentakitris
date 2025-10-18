// js/helpers/name-utils.js
// ======================================================
// Những hàm nhỏ để quản lý "tên người chơi" và "ngày"
// Viết bằng ngôn ngữ dễ hiểu cho học sinh lớp 7.
// - Mỗi hàm có mô tả ngắn, ví dụ, và "Try it" hướng dẫn.
// ======================================================

// ✅ Mục tiêu: Trả về ngày hôm nay theo chuỗi "YYYY-MM-DD"
// Ví dụ: "2025-10-10"
// Try it: console.log(getTodayString());
export function getTodayString() {
    const now = new Date();
    // toISOString() trả về "2025-10-10T15:00:00.000Z"
    // split('T')[0] lấy phần ngày "2025-10-10"
    return now.toISOString().split('T')[0];
}

// ✅ Mục tiêu: Kiểm tra người chơi có thể đổi tên trong ngày hôm nay không
// Trả về true nếu CHƯA đổi tên hôm nay (có thể đổi), false nếu đã đổi rồi.
// Lưu ý: Dữ liệu lưu trên trình duyệt (localStorage).
// Try it:
// localStorage.setItem('lastNameChangeDate', '2000-01-01');
// console.log(canChangeNameToday()); // true
export function canChangeNameToday() {
    const last = localStorage.getItem('lastNameChangeDate');
    const today = getTodayString();
    return last !== today;
}

// ✅ Mục tiêu: Lưu tên người chơi và đánh dấu ngày đổi tên hôm nay
// Thao tác này lưu vào localStorage (giữ lâu trên trình duyệt).
// Ví dụ: savePlayerName('KHOI')
export function savePlayerName(name) {
    // Chúng ta "trim" để loại bỏ khoảng trắng 2 đầu
    const safeName = (name || '').trim();
    if (!safeName) return false;
    localStorage.setItem('playerName', safeName);
    localStorage.setItem('lastNameChangeDate', getTodayString());
    return true;
}

// ✅ Mục tiêu: Lấy tên người chơi đã lưu
// Nếu chưa có tên, trả về null.
// Try it: console.log(getPlayerName());
export function getPlayerName() {
    return localStorage.getItem('playerName') || null;
}

// ✅ Mục tiêu: Xóa dữ liệu tên (dùng cho mục "Reset để test")
// Try it: resetPlayerName(); console.log(getPlayerName());
export function resetPlayerName() {
    localStorage.removeItem('playerName');
    localStorage.removeItem('lastNameChangeDate');
}
