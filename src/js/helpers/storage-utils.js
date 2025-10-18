// js/helpers/storage-utils.js
// ======================================================
// Hàm giúp làm việc với localStorage
// localStorage = kho lưu trữ trên trình duyệt của bạn
// Dữ liệu sẽ còn ngay cả khi tắt trình duyệt!
// ======================================================

// ✅ Mục tiêu: Lưu dữ liệu vào localStorage
// Ví dụ: saveToStorage('playerName', 'KHOI')
// Try it: 
// saveToStorage('myScore', 1000);
// console.log(localStorage.getItem('myScore')); // "1000"
export function saveToStorage(key, value) {
    try {
        // localStorage chỉ lưu được text (string)
        // Nên chúng ta chuyển số thành text trước
        localStorage.setItem(key, String(value));
        return true;
    } catch (error) {
        console.error('Lỗi khi lưu vào localStorage:', error);
        return false;
    }
}

// ✅ Mục tiêu: Lấy dữ liệu từ localStorage
// Trả về giá trị đã lưu, hoặc giá trị mặc định nếu chưa có
// Ví dụ: getFromStorage('playerName', 'Guest')
// Try it: console.log(getFromStorage('playerName', 'NoName'));
export function getFromStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        // Nếu chưa có giá trị, trả về giá trị mặc định
        return value !== null ? value : defaultValue;
    } catch (error) {
        console.error('Lỗi khi đọc từ localStorage:', error);
        return defaultValue;
    }
}

// ✅ Mục tiêu: Xóa 1 mục khỏi localStorage
// Ví dụ: removeFromStorage('oldScore')
// Try it: 
// removeFromStorage('playerName');
// console.log(getFromStorage('playerName')); // null
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Lỗi khi xóa từ localStorage:', error);
        return false;
    }
}

// ✅ Mục tiêu: Xóa TẤT CẢ dữ liệu trong localStorage
// ❗️ Cẩn thận: Sẽ mất hết tên, điểm, cài đặt!
// Try it: clearAllStorage(); // Mọi thứ bị xóa sạch
export function clearAllStorage() {
    try {
        localStorage.clear();
        console.log('✅ Đã xóa sạch localStorage');
        return true;
    } catch (error) {
        console.error('Lỗi khi xóa localStorage:', error);
        return false;
    }
}

// ✅ Mục tiêu: Kiểm tra localStorage có sẵn không
// Một số trình duyệt cũ hoặc chế độ riêng tư có thể không cho dùng
// Try it: console.log(isStorageAvailable()); // true hoặc false
export function isStorageAvailable() {
    try {
        const test = '__test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        console.warn('localStorage không khả dụng:', error);
        return false;
    }
}

// ❓ Câu hỏi: Tại sao dùng localStorage thay vì biến thường?
// 💡 Trả lời: Biến thường bị mất khi tắt trang web.
//            localStorage giữ dữ liệu mãi mãi (trừ khi xóa)!

// ❓ Câu hỏi: localStorage lưu ở đâu?
// 💡 Trả lời: Trên máy tính của bạn, trong thư mục của trình duyệt.
//            Mỗi trang web có localStorage riêng, không lẫn lộn!
