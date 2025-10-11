/**
 * REVERSE GRAVITY SKILL - Kỹ năng Đảo Trọng Lực 🔺
 * 
 * Mô tả: Trong thời gian skill hoạt động, các mảnh ghép sẽ bay lên trên thay vì rơi xuống
 * 
 * Cách hoạt động:
 * 1. Khi skill được kích hoạt, hướng di chuyển tự động đổi từ xuống (dy=+1) thành lên (dy=-1)
 * 2. Va chạm được kiểm tra ở trần (top) thay vì sàn (bottom)
 * 3. Mảnh sẽ được "khóa" ở trần khi va chạm
 * 4. Sau khi hết thời gian, trọng lực trở về bình thường
 */

/**
 * Trạng thái của Reverse Gravity
 */
let reverseGravityActive = false;

/**
 * Kích hoạt Reverse Gravity
 */
export function activateReverseGravity() {
    reverseGravityActive = true;
    console.log('🔺 Reverse Gravity activated!');
}

/**
 * Tắt Reverse Gravity
 */
export function deactivateReverseGravity() {
    reverseGravityActive = false;
    console.log('🔺 Reverse Gravity deactivated!');
}

/**
 * Kiểm tra xem Reverse Gravity có đang hoạt động không
 * 
 * @returns {boolean} true nếu đang hoạt động
 */
export function isReverseGravityActive() {
    return reverseGravityActive;
}

/**
 * Lấy hướng di chuyển dựa trên trạng thái Reverse Gravity
 * 
 * @returns {number} -1 nếu đi lên (reverse), +1 nếu đi xuống (bình thường)
 */
export function getGravityDirection() {
    return reverseGravityActive ? -1 : 1;
}

/**
 * Di chuyển mảnh theo hướng trọng lực hiện tại
 * 
 * @param {Object} currentPiece - Mảnh ghép hiện tại
 * @param {Function} movePiece - Hàm di chuyển mảnh gốc
 * @returns {boolean} true nếu di chuyển thành công
 */
export function moveWithGravity(currentPiece, movePiece) {
    if (!currentPiece) return false;
    
    const direction = getGravityDirection();
    return movePiece(0, direction);
}

/**
 * Điều chỉnh vị trí spawn của mảnh mới dựa trên Reverse Gravity
 * 
 * @param {Object} piece - Mảnh ghép mới
 * @param {number} BOARD_WIDTH - Chiều rộng bảng
 * @param {number} BOARD_HEIGHT - Chiều cao bảng
 * @returns {Object} Mảnh với vị trí đã điều chỉnh
 */
export function adjustSpawnPosition(piece, BOARD_WIDTH, BOARD_HEIGHT) {
    if (!reverseGravityActive) {
        // Vị trí spawn bình thường (ở trên)
        return {
            ...piece,
            x: Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2),
            y: 0
        };
    } else {
        // Vị trí spawn khi reverse gravity (ở dưới)
        return {
            ...piece,
            x: Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2),
            y: BOARD_HEIGHT - piece.shape.length
        };
    }
}

/**
 * Hard drop được điều chỉnh cho Reverse Gravity
 * 
 * @param {Object} currentPiece - Mảnh ghép hiện tại
 * @param {Function} movePiece - Hàm di chuyển mảnh
 * @returns {number} Số ô đã di chuyển
 */
export function hardDropWithGravity(currentPiece, movePiece) {
    if (!currentPiece) return 0;
    
    const direction = getGravityDirection();
    let drops = 0;
    
    // Di chuyển theo hướng trọng lực cho đến khi va chạm
    while (movePiece(0, direction)) {
        drops++;
    }
    
    return drops;
}

/**
 * Kiểm tra va chạm đặc biệt cho Reverse Gravity
 * Hàm này mở rộng logic kiểm tra va chạm cho trường hợp đảo trọng lực
 * 
 * @param {Object} piece - Mảnh cần kiểm tra
 * @param {Array} board - Bảng game
 * @param {number} BOARD_WIDTH - Chiều rộng bảng
 * @param {number} BOARD_HEIGHT - Chiều cao bảng
 * @returns {boolean} true nếu có va chạm
 */
export function checkReverseGravityCollision(piece, board, BOARD_WIDTH, BOARD_HEIGHT) {
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c]) {
                const boardX = piece.x + c;
                const boardY = piece.y + r;

                // Kiểm tra biên
                if (boardX < 0 || boardX >= BOARD_WIDTH) {
                    return true;
                }
                
                if (reverseGravityActive) {
                    // Khi reverse, kiểm tra trần (y < 0) thay vì sàn
                    if (boardY < 0 || boardY >= BOARD_HEIGHT) {
                        return true;
                    }
                } else {
                    // Bình thường, kiểm tra sàn
                    if (boardY >= BOARD_HEIGHT) {
                        return true;
                    }
                }
                
                // Kiểm tra va chạm với các ô đã có
                if (boardY >= 0 && boardY < BOARD_HEIGHT && board[boardY][boardX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}
