// js/game-pieces.js
// ======================================================
// ✅ File này quản lý các MẢNH (PIECES) trong game
// Những việc như: tạo mảnh ngẫu nhiên, xoay mảnh, kiểm tra va chạm
// ======================================================

import { SHAPES, BOARD_WIDTH } from './game-constants.js';
import { board } from './game-state.js';

/**
 * ✅ Tạo một mảnh ngẫu nhiên
 * 
 * Mục tiêu: Chọn 1 trong 7 hình (T, I, J, L, O, S, Z) một cách ngẫu nhiên
 * 
 * Cách hoạt động:
 * 1. Math.random() tạo số thập phân từ 0 đến 1 (ví dụ: 0.73)
 * 2. Nhân với SHAPES.length (7) → 0 đến 7 (ví dụ: 5.11)
 * 3. Math.floor() làm tròn xuống → 0 đến 6 (ví dụ: 5)
 * 4. Lấy hình tương ứng từ mảng SHAPES
 * 
 * Trả về: Object chứa {shape, color, x, y}
 * 
 * Try it: console.log(getRandomPiece());
 * 
 * @returns {object} Mảnh mới với vị trí ở giữa phía trên
 */
export function getRandomPiece() {
    const index = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[index];
    const color = index + 1; // Màu bắt đầu từ 1 (index 0 = trống)
    
    // Tính vị trí X để mảnh xuất hiện ở giữa bàn chơi
    // Math.floor(10 / 2) - Math.floor(chiều_rộng_mảnh / 2)
    const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);

    return {
        shape: shape,   // Hình dạng (mảng 2 chiều)
        color: color,   // Màu (1-7)
        x: startX,      // Vị trí cột (ngang)
        y: 0,           // Vị trí hàng (dọc, bắt đầu từ trên cùng)
    };
}

/**
 * ✅ Kiểm tra xem mảnh có va chạm (đụng) không
 * 
 * Mục tiêu: Kiểm tra mảnh có đụng vào tường, đáy, hoặc ô đã có màu không
 * 
 * Cách hoạt động:
 * - Duyệt qua từng ô của mảnh (2 vòng lặp: hàng và cột)
 * - Nếu ô có giá trị (không phải 0), kiểm tra:
 *   1. Có ra ngoài biên trái/phải không? (x < 0 hoặc x >= 10)
 *   2. Có chạm đáy không? (y >= 20)
 *   3. Có đụng ô đã tô màu không? (board[y][x] !== 0)
 * 
 * Trả về:
 * - true = có va chạm (không được di chuyển đến đây!)
 * - false = không va chạm (an toàn!)
 * 
 * Try it: Thử console.log trong hàm này để xem khi nào va chạm
 * 
 * @param {object} piece - Mảnh cần kiểm tra
 * @returns {boolean} true nếu va chạm, false nếu an toàn
 */
export function checkCollision(piece) {
    // Duyệt qua từng hàng (r = row)
    for (let r = 0; r < piece.shape.length; r++) {
        // Duyệt qua từng cột (c = column)
        for (let c = 0; c < piece.shape[r].length; c++) {
            // Chỉ kiểm tra ô có giá trị (ô có màu)
            if (piece.shape[r][c] !== 0) {
                const newY = piece.y + r;  // Vị trí thực trên board
                const newX = piece.x + c;

                // Kiểm tra biên trái, phải, đáy
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= board.length) {
                    return true; // Va chạm!
                }

                // Kiểm tra đụng ô đã có màu (nhưng không kiểm tra phía trên board)
                if (newY >= 0 && board[newY][newX] !== 0) {
                    return true; // Va chạm!
                }
            }
        }
    }
    return false; // An toàn!
}

/**
 * ✅ Khóa mảnh vào board (không di chuyển được nữa)
 * 
 * Mục tiêu: Khi mảnh chạm đáy hoặc đụng mảnh khác, 
 *           chúng ta "vẽ" màu của nó lên board
 * 
 * Cách hoạt động:
 * - Duyệt qua từng ô của mảnh
 * - Nếu ô có màu (cell !== 0), tô màu đó lên board
 * - Board lưu giá trị màu (1-7) tại vị trí tương ứng
 * 
 * Lưu ý: Sau khi lock, mảnh trở thành phần của board,
 *        không thể di chuyển hay xoay nữa!
 * 
 * Try it: Sau khi lock, console.log(board) để thấy màu trên board
 */
export function lockPiece(piece) {
    piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell !== 0) {
                const boardY = piece.y + r;
                const boardX = piece.x + c;
                // Chỉ tô màu nếu vị trí hợp lệ (trong phạm vi board)
                if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < BOARD_WIDTH) {
                    board[boardY][boardX] = piece.color;
                }
            }
        });
    });
}

/**
 * ✅ Xoay mảnh 90 độ theo chiều kim đồng hồ
 * 
 * Mục tiêu: Biến đổi hình dạng của mảnh (ví dụ: từ ngang sang dọc)
 * 
 * Cách hoạt động (toán học):
 * - Tạo mảng mới cùng kích thước
 * - Áp dụng công thức xoay: newShape[c][size-1-r] = oldShape[r][c]
 * - Đây gọi là "transpose và đảo ngược hàng"
 * 
 * Ví dụ: Hình I ngang (----) xoay thành hình I dọc:
 *   |
 *   |
 *   |
 *   |
 * 
 * Try it: Vẽ hình T trên giấy rồi xoay 90 độ để hiểu rõ hơn!
 * 
 * @param {object} piece - Mảnh cần xoay
 * @returns {object} Mảnh mới đã xoay
 */
export function rotatePieceShape(piece) {
    const shape = piece.shape;
    const size = shape.length;
    const newShape = Array.from({ length: size }, () => Array(size).fill(0));

    // Thực hiện xoay (công thức toán học)
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            newShape[c][size - 1 - r] = shape[r][c];
        }
    }

    return { ...piece, shape: newShape };
}

// ❓ Câu hỏi: Tại sao mảnh O (hình vuông) xoay vẫn giống cũ?
// 💡 Trả lời: Vì hình vuông đối xứng! Xoay 90 độ vẫn là hình vuông.
