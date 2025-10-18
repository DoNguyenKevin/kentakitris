// src/game/constants/GameConstants.ts
// ======================================================
// ✅ Hằng số game (Game Constants)
// Những con số này định nghĩa kích thước và quy tắc của game
// ======================================================

// 📏 Kích thước board
export const BOARD_WIDTH = 10;  // 10 cột (chuẩn Tetris gốc từ 1984)
export const BOARD_HEIGHT = 20; // 20 hàng
export const BLOCK_SIZE = 30;   // Mỗi ô vuông = 30x30 pixels

// 📍 Board position - Vị trí board trên màn hình
export const BOARD_X = 200;  // Vị trí X của board (pixels)
export const BOARD_Y = 50;   // Vị trí Y của board (pixels)

// ⚡ Energy Block constants
export const FROZEN_TEXT_BLINK_CYCLE = 600; // ms - Chu kỳ nhấp nháy của text frozen (300ms * 2)

// ❓ Thử nghiệm: Thay BOARD_WIDTH = 15 → Board rộng hơn!
// ❓ Thử nghiệm: Thay BLOCK_SIZE = 40 → Ô to hơn!

// 🎨 Màu sắc cho các mảnh Tetris
// ======================================================
// Mỗi loại mảnh có 1 màu riêng (theo chuẩn Tetris hiện đại)
// ✅ Đã cập nhật để khớp với theme của game JS cũ
export const COLORS = [
    0x000000, // 0 = Trống (Empty) - Màu đen
    0xFF0D72, // 1 = T - Màu hồng sáng (Bright Pink)
    0x0DC2FF, // 2 = I - Màu xanh nước biển (Cyan)
    0x0DFF72, // 3 = J - Màu xanh lá chanh (Lime Green)
    0xFF8E0D, // 4 = L - Màu cam (Orange)
    0xFFE100, // 5 = O - Màu vàng (Yellow)
    0xFF1A0D, // 6 = S - Màu đỏ sáng (Bright Red)
    0x5833FF, // 7 = Z - Màu tím xanh (Blue Violet)
];

// 💡 Lưu ý: Màu trong Phaser dùng hệ 16 (hex)
//          Ví dụ: 0xFF0D72 = màu hồng sáng
//          Các màu này khớp với game JS cũ trong src/index.css
//          (CSS classes: .color-1 đến .color-7, dòng 94-100)

// 🧩 Hình dạng các mảnh Tetris (Shapes)
// ======================================================
// 7 loại mảnh trong Tetris, mỗi loại có hình dạng riêng
// Dùng mảng 2 chiều để biểu diễn: 1 = có ô, 0 = trống

export const SHAPES = [
    // T - Hình chữ T
    [[0, 1, 0], 
     [1, 1, 1], 
     [0, 0, 0]],
    
    // I - Hình thanh dài
    [[0, 0, 0, 0], 
     [1, 1, 1, 1], 
     [0, 0, 0, 0], 
     [0, 0, 0, 0]],
    
    // J - Hình chữ J
    [[1, 0, 0], 
     [1, 1, 1], 
     [0, 0, 0]],
    
    // L - Hình chữ L
    [[0, 0, 1], 
     [1, 1, 1], 
     [0, 0, 0]],
    
    // O - Hình vuông
    [[1, 1], 
     [1, 1]],
    
    // S - Hình chữ S
    [[0, 1, 1], 
     [1, 1, 0], 
     [0, 0, 0]],
    
    // Z - Hình chữ Z
    [[1, 1, 0], 
     [0, 1, 1], 
     [0, 0, 0]],
];

// ❓ Câu hỏi: Tại sao dùng mảng 2 chiều?
// 💡 Trả lời: Vì mảnh Tetris có hàng và cột, giống bàn cờ!
//            [[1,0], [1,1]] = ô (0,0) có 1, ô (0,1) có 0...

// 🎮 Cấu trúc dữ liệu của 1 mảnh Tetris (Piece)
// ======================================================
export interface Piece {
    shape: number[][];  // Hình dạng (mảng 2D: 1=có ô, 0=trống)
    color: number;      // Màu sắc (1-7, tương ứng COLORS)
    x: number;          // Vị trí cột trên board (0 = cột trái)
    y: number;          // Vị trí hàng trên board (0 = hàng trên)
}

// Ví dụ: { shape: [[1,1],[1,1]], color: 5, x: 4, y: 0 }
// → Mảnh O (vuông), màu vàng, ở giữa board, hàng trên cùng

// ⚡ Cấu trúc dữ liệu của Energy Block (Khối năng lượng)
// ======================================================
/**
 * ✅ EnergyBlock - Khối năng lượng nguy hiểm!
 * 
 * Khối này xuất hiện ở độ khó Hard và Impossible
 * Nếu chạm vào hoặc để rơi xuống đáy = GAME OVER!
 * 
 * Ở Impossible mode:
 * - Chuột đến gần → Khối NỔ!
 * - Nổ xong → Chuột bị ĐÓNG BĂNG 3 giây!
 */
export interface EnergyBlock {
    x: number;              // Vị trí cột (0-9)
    y: number;              // Vị trí hàng (0-19)
    color: number;          // Màu sắc (hex)
    dropSpeed: number;      // Tốc độ rơi (ms/ô)
    lastDropTime: number;   // Lần rơi cuối (timestamp)
    canExplode: boolean;    // Có thể nổ không?
    explosionDistance?: number;  // Khoảng cách nổ (pixels)
    freezeDuration?: number;     // Thời gian đóng băng (ms)
}
