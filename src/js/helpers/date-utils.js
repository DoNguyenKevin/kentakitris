// js/helpers/date-utils.js
// ======================================================
// Hàm giúp làm việc với ngày tháng
// Dễ hiểu cho học sinh lớp 7
// ======================================================

// ✅ Mục tiêu: Trả về ngày hôm nay dạng "YYYY-MM-DD"
// Ví dụ: "2025-10-10"
// Giải thích: Đây là định dạng chuẩn để so sánh ngày tháng
// Try it: console.log(getTodayString());
export function getTodayString() {
    const now = new Date(); // Lấy thời gian hiện tại
    // toISOString() cho ra: "2025-10-10T16:09:49.527Z"
    // split('T')[0] cắt bỏ phần giờ, chỉ giữ phần ngày
    return now.toISOString().split('T')[0];
}

// ✅ Mục tiêu: Định dạng ngày theo kiểu Việt Nam
// Ví dụ: "10/10/2025" hoặc "10 tháng 10, 2025"
// Try it: console.log(formatDateVN(new Date()));
export function formatDateVN(date, style = 'short') {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    
    if (style === 'short') {
        // Kiểu ngắn: 10/10/2025
        return `${day}/${month}/${year}`;
    } else {
        // Kiểu dài: 10 tháng 10, 2025
        return `${day} tháng ${month}, ${year}`;
    }
}

// ✅ Mục tiêu: Kiểm tra 2 ngày có giống nhau không
// Dùng để so sánh "ngày đổi tên" với "ngày hôm nay"
// Try it: 
// console.log(isSameDay('2025-10-10', '2025-10-10')); // true
// console.log(isSameDay('2025-10-10', '2025-10-11')); // false
export function isSameDay(dateStr1, dateStr2) {
    return dateStr1 === dateStr2;
}

// ❓ Câu hỏi: Tại sao chúng ta lưu ngày dạng "YYYY-MM-DD"?
// 💡 Trả lời: Vì định dạng này dễ so sánh (2025-10-10 < 2025-10-11)
//            và không bị rối khi đổi múi giờ!
