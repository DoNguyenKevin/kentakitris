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
 * Clears full lines and updates score/level.
 */
export function clearLines() {
    let linesCleared = 0;
    const clearedRows = [];
    
    // Find all full lines first
    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            clearedRows.push(r);
            linesCleared++;
        }
    }

    if (linesCleared > 0) {
        // Flash the lines before removing them
        flashClearedLines(clearedRows);
        
        // Wait for flash animation to complete before removing lines
        setTimeout(() => {
            // Remove the cleared lines and add empty lines at the top
            clearedRows.sort((a, b) => a - b); // Sort in ascending order
            clearedRows.forEach(() => {
                // Find and remove the first full line
                for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
                    if (board[r].every(cell => cell !== 0)) {
                        board.splice(r, 1);
                        board.unshift(Array(BOARD_WIDTH).fill(0));
                        break;
                    }
                }
            });

            // Update score with multiplier
            const pointsEarned = SCORE_PER_LINE * linesCleared * linesCleared;
            const newScore = score + pointsEarned;
            setScore(newScore);
            
            // Create score particles at the middle cleared row
            const middleRow = clearedRows[Math.floor(clearedRows.length / 2)];
            createScoreParticles(pointsEarned, middleRow, linesCleared);

            // Update lines and check for level up
            const newLines = lines + linesCleared;
            setLines(newLines);
            
            const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;
            if (newLevel > level) {
                setLevel(newLevel);
                restartDropInterval(); // Speed up the game
            }

            drawBoard();
        }, 600); // Wait for flash animation (0.3s * 2 iterations)
    }
}

/**
 * Spawns the next piece and checks for game over.
 * @returns {boolean} True if game continues, false if game over.
 */
export function spawnNextPiece() {
    setCurrentPiece(nextPiece);
    setNextPiece(getRandomPiece());
    
    // Check if the new piece immediately collides (game over condition)
    if (checkCollision(currentPiece)) {
        return false; // Game over
    }
    
    return true; // Game continues
}
