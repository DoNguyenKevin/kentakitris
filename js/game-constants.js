// js/game-constants.js
// ======================================================
// ✅ File này chứa các CON SỐ KHÔNG THAY ĐỔI của game
// Con số không đổi = CONSTANT (tiếng Anh)
// Tại sao tách riêng? Để dễ điều chỉnh và tìm kiếm!
// ======================================================

// --- KẾT CẤU GAME BOARD (BÀN CHƠI) ---

// ✅ Chiều rộng của bàn chơi = 10 ô
// Try it: Thử đổi thành 15 để có bàn chơi rộng hơn!
export const BOARD_WIDTH = 10;

// ✅ Chiều cao của bàn chơi = 20 ô
// Try it: Thử đổi thành 25 để có bàn chơi cao hơn!
export const BOARD_HEIGHT = 20;

// ✅ Kích thước khung hiển thị "mảnh tiếp theo" = 4x4 ô
export const NEXT_GRID_SIZE = 4;

// --- ĐIỂM SỐ VÀ CẤP ĐỘ ---

// ✅ Điểm được cộng khi xóa 1 hàng = 10 điểm
// Try it: Đổi thành 100 để được nhiều điểm hơn!
export const SCORE_PER_LINE = 10;

// ✅ Số hàng cần xóa để lên cấp = 10 hàng
// Mỗi khi lên cấp, mảnh rơi nhanh hơn!
export const LINES_PER_LEVEL = 10;

// ✅ Thời gian rơi ban đầu = 1000ms (1 giây)
// Mảnh sẽ tự động rơi xuống mỗi 1 giây
// Try it: Đổi thành 2000 để chơi chậm hơn, hoặc 500 để chơi nhanh hơn!
export const INITIAL_DROP_DELAY = 1000; // ms (milliseconds = phần ngàn giây)

// --- HÌNH DẠNG CÁC MẢNH (TETROMINO SHAPES) ---

// ✅ Mỗi mảnh là một mảng 2 chiều (như bàn cờ mini)
// Số 1 = có ô, số 0 = không có ô
// Có 7 hình dạng khác nhau trong Tetris!

// ❓ Thử nghiệm: Hãy vẽ từng hình trên giấy để hiểu rõ hơn!
// Ví dụ hình T: 
//   0 1 0
//   1 1 1
//   0 0 0

// Tetromino shapes and their colors (color index 1-7)
export const SHAPES = [
    // 0: T-shape (Hình chữ T)
    [[0, 1, 0], [1, 1, 1], [0, 0, 0],], 
    // 1: I-shape (Hình que dài)
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0],], 
    // 2: J-shape (Hình chữ J ngược)
    [[1, 0, 0], [1, 1, 1], [0, 0, 0],], 
    // 3: L-shape (Hình chữ L)
    [[0, 0, 1], [1, 1, 1], [0, 0, 0],], 
    // 4: O-shape (Hình vuông)
    [[1, 1], [1, 1],], 
    // 5: S-shape (Hình chữ S)
    [[0, 1, 1], [1, 1, 0], [0, 0, 0],], 
    // 6: Z-shape (Hình chữ Z)
    [[1, 1, 0], [0, 1, 1], [0, 0, 0],], 
];

// --- MÀU SẮC ---

// ✅ Mỗi hình có 1 màu riêng
// Index (số thứ tự) tương ứng với class CSS
// Index 0 = trống (không có màu)

// The index in COLORS corresponds to the color-N class in CSS
export const COLORS = [
    null,       // Index 0 = ô trống (không có màu)
    'color-1',  // T: Màu hồng
    'color-2',  // I: Màu xanh lơ (cyan)
    'color-3',  // J: Màu xanh lá
    'color-4',  // L: Màu cam
    'color-5',  // O: Màu vàng
    'color-6',  // S: Màu đỏ
    'color-7',  // Z: Màu tím xanh
];

// ❓ Câu hỏi: Tại sao có 7 hình nhưng lại có index từ 0-7 (8 số)?
// 💡 Trả lời: Index 0 dành cho "ô trống" trên bàn chơi!
//            7 hình khác dùng index 1-7 để đối chiếu với màu.

