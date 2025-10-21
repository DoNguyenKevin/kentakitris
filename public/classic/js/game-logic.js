// js/game-logic.js
// ======================================================
// ✅ File này chứa LOGIC chính của game
// Logic = các quy tắc, cách game hoạt động
// Ví dụ: Di chuyển mảnh, xoay, xóa hàng, tính điểm
// ======================================================

import { BOARD_HEIGHT, BOARD_WIDTH, SCORE_PER_LINE, LINES_PER_LEVEL } from './game-constants.js';
import { 
    board, 
    currentPiece, 
    nextPiece,
    score, 
    lines, 
    level,
    setCurrentPiece,
    setNextPiece,
    setScore,
    setLines,
    setLevel
} from './game-state.js';
import { getRandomPiece, checkCollision, lockPiece, rotatePieceShape } from './game-pieces.js';
import { drawBoard, createScoreParticles, flashClearedLines } from './game-board.js';
import { restartDropInterval } from './game-controls.js';

/**
 * ✅ Di chuyển mảnh theo hướng cho trước
 * 
 * Mục tiêu: Thay đổi vị trí của mảnh (trái/phải/xuống)
 * 
 * Cách hoạt động:
 * 1. Tạo bản sao mảnh với vị trí mới (x + dx, y + dy)
 * 2. Kiểm tra va chạm
 * 3. Nếu không va chạm → cập nhật vị trí và vẽ lại board
 * 4. Nếu va chạm → không di chuyển, trả về false
 * 
 * Ví dụ:
 * - movePiece(-1, 0) → di chuyển TRÁI
 * - movePiece(1, 0)  → di chuyển PHẢI
 * - movePiece(0, 1)  → di chuyển XUỐNG
 * 
 * Try it: Thêm console.log('Di chuyển:', dx, dy) để theo dõi
 * 
 * @param {number} dx - Thay đổi cột (ngang): -1=trái, 1=phải, 0=không đổi
 * @param {number} dy - Thay đổi hàng (dọc): 1=xuống, 0=không đổi
 * @returns {boolean} true nếu di chuyển thành công, false nếu bị chặn
 */
export function movePiece(dx, dy) {
    if (!currentPiece) return false; // Chưa có mảnh thì không làm gì
    
    // Tạo mảnh mới với vị trí dịch chuyển
    const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };

    // Kiểm tra xem có va chạm không
    if (!checkCollision(newPiece)) {
        setCurrentPiece(newPiece);  // Cập nhật vị trí
        drawBoard();                 // Vẽ lại màn hình
        return true;                 // Thành công!
    }
    return false; // Va chạm, không di chuyển được
}

/**
 * ✅ Thả mảnh xuống đáy ngay lập tức (Hard Drop)
 * 
 * Mục tiêu: Thay vì chờ mảnh rơi từ từ, thả luôn xuống đáy
 * 
 * Cách hoạt động:
 * 1. Di chuyển mảnh xuống (0, 1) liên tục
 * 2. Đếm số lần di chuyển thành công
 * 3. Dừng khi không di chuyển được nữa (chạm đáy hoặc mảnh khác)
 * 
 * Try it: Trong game, nhấn phím Space để hard drop!
 * 
 * @returns {boolean} true nếu đã thả xuống, false nếu chưa có mảnh
 */
export function hardDrop() {
    if (!currentPiece) return;
    let drops = 0; // Đếm số bước rơi
    
    // Rơi liên tục cho đến khi không rơi được nữa
    while (movePiece(0, 1)) {
        drops++;
    }
    
    // Báo hiệu cần khóa mảnh ngay
    if (drops > 0) {
        return true; // Đã thả xuống, cần khóa mảnh
    }
    return false;
}

/**
 * ✅ Xoay mảnh 90 độ theo chiều kim đồng hồ
 * 
 * Mục tiêu: Thay đổi hướng của mảnh (ngang sang dọc hoặc ngược lại)
 * 
 * Cách hoạt động:
 * 1. Tạo mảnh đã xoay bằng rotatePieceShape()
 * 2. Kiểm tra va chạm
 * 3. Nếu va chạm, thử "đẩy" mảnh sang trái/phải/lên/xuống (kick-testing)
 * 4. Nếu tìm được vị trí an toàn → xoay thành công
 * 
 * Kick-testing: Kỹ thuật trong Tetris chính thức
 * - Thử 5 vị trí: [0,0], [-1,0], [1,0], [0,-1], [0,1]
 * - Giúp xoay mảnh khi sát tường hoặc gần mảnh khác
 * 
 * Try it: Trong game, nhấn phím Up hoặc W để xoay!
 */
export function rotatePiece() {
    if (!currentPiece) return;
    
    const rotatedPiece = rotatePieceShape(currentPiece);

    // Kick-testing: Thử dịch chuyển nhẹ nếu xoay bị va chạm
    const kicks = [
        [0, 0],   // Giữ nguyên vị trí
        [-1, 0],  // Đẩy sang trái 1 ô
        [1, 0],   // Đẩy sang phải 1 ô
        [0, -1],  // Đẩy lên 1 ô
        [0, 1]    // Đẩy xuống 1 ô
    ];
    
    for (const [kx, ky] of kicks) {
        const kickedPiece = { ...rotatedPiece, x: rotatedPiece.x + kx, y: rotatedPiece.y + ky };
        if (!checkCollision(kickedPiece)) {
            setCurrentPiece(kickedPiece);
            drawBoard();
            return;
        }
    }
}

/**
 * ✅ Xóa các hàng đã đầy và cập nhật điểm/level
 * 
 * Mục tiêu: Tìm hàng đã đầy (10 ô đều có màu), xóa nó, và tính điểm
 * 
 * Cách hoạt động:
 * 1. Duyệt qua tất cả hàng từ dưới lên (hàng 19 → hàng 0)
 * 2. Kiểm tra hàng nào đầy (mọi ô đều khác 0)
 * 3. Đánh dấu các hàng đầy
 * 4. Hiệu ứng flash (nhấp nháy)
 * 5. Xóa hàng và kéo các hàng phía trên xuống
 * 6. Cộng điểm và kiểm tra lên level
 * 
 * Công thức điểm:
 * - Xóa 1 hàng: 10 điểm
 * - Xóa 2 hàng: 30 điểm (bonus!)
 * - Xóa 3 hàng: 60 điểm (bonus lớn!)
 * - Xóa 4 hàng: 100 điểm (Tetris!)
 * 
 * Try it: Xếp đầy 1 hàng để xem hiệu ứng!
 */
export function clearLines() {
    let linesCleared = 0;
    const clearedRows = [];
    
    // 1. Tìm tất cả hàng đã đầy
    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
        // .every() kiểm tra MỌI ô đều thỏa điều kiện
        if (board[r].every(cell => cell !== 0)) {
            clearedRows.push(r);
            linesCleared++;
        }
    }

    if (linesCleared > 0) {
        // 2. Hiệu ứng flash (nhấp nháy) để người chơi thấy
        flashClearedLines(clearedRows);
        
        // 3. Chờ hiệu ứng flash xong rồi mới xóa hàng
        setTimeout(() => {
            // 4. Xóa các hàng đầy và thêm hàng trống lên trên
            clearedRows.sort((a, b) => a - b); // Sắp xếp từ nhỏ đến lớn
            clearedRows.forEach(() => {
                // Tìm và xóa hàng đầy đầu tiên
                for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
                    if (board[r].every(cell => cell !== 0)) {
                        board.splice(r, 1); // Xóa hàng này
                        board.unshift(Array(BOARD_WIDTH).fill(0)); // Thêm hàng trống lên trên
                        break;
                    }
                }
            });

            // 5. Tính điểm (có nhân số hàng xóa để có bonus!)
            // Công thức: SCORE_PER_LINE × linesCleared × linesCleared
            // Ví dụ: Xóa 2 hàng = 10 × 2 × 2 = 40 điểm
            const pointsEarned = SCORE_PER_LINE * linesCleared * linesCleared;
            const newScore = score + pointsEarned;
            setScore(newScore);
            
            // Tạo hiệu ứng số điểm bay lên
            const middleRow = clearedRows[Math.floor(clearedRows.length / 2)];
            createScoreParticles(pointsEarned, middleRow, linesCleared);

            // 6. Cập nhật số hàng đã xóa và kiểm tra lên level
            const newLines = lines + linesCleared;
            setLines(newLines);
            
            // Công thức level: Mỗi 10 hàng lên 1 cấp
            const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;
            if (newLevel > level) {
                setLevel(newLevel);
                restartDropInterval(); // Tăng tốc độ game (mảnh rơi nhanh hơn)
            }

            drawBoard(); // Vẽ lại board
        }, 600); // Chờ 600ms cho hiệu ứng flash (0.3s × 2 lần)
    }
}

/**
 * ✅ Tạo mảnh mới và kiểm tra Game Over
 * 
 * Mục tiêu: Lấy mảnh tiếp theo làm mảnh hiện tại, tạo mảnh mới
 * 
 * Cách hoạt động:
 * 1. Mảnh "tiếp theo" trở thành mảnh "hiện tại"
 * 2. Tạo mảnh "tiếp theo" mới (ngẫu nhiên)
 * 3. Kiểm tra mảnh mới có va chạm ngay không
 * 4. Nếu va chạm ngay = board đã đầy = GAME OVER!
 * 
 * Game Over xảy ra khi:
 * - Mảnh mới xuất hiện nhưng bị chặn bởi các mảnh cũ
 * - Thường là do board gần đầy đến mức không còn chỗ
 * 
 * Try it: Xếp hết đến trên cùng để thấy Game Over!
 * 
 * @returns {boolean} true nếu game tiếp tục, false nếu game over
 */
export function spawnNextPiece() {
    // Mảnh tiếp theo → mảnh hiện tại
    setCurrentPiece(nextPiece);
    // Tạo mảnh tiếp theo mới
    setNextPiece(getRandomPiece());
    
    // Kiểm tra va chạm ngay lập tức = Game Over!
    if (checkCollision(currentPiece)) {
        return false; // Game over 😢
    }
    
    return true; // Game tiếp tục! 🎮
}

// ❓ Câu hỏi: Tại sao có "mảnh tiếp theo"?
// 💡 Trả lời: Để người chơi biết trước và lên chiến thuật!
//            Đây là tính năng quan trọng của Tetris.

// ❓ Câu hỏi: Làm sao tránh Game Over?
// 💡 Trả lời: 
//     - Xóa hàng thường xuyên, đừng để đống cao
//     - Không để khoảng trống giữa các mảnh
//     - Chơi nhanh hơn khi level cao
