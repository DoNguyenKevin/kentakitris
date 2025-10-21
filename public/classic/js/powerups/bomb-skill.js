/**
 * BOMB SKILL - Kỹ năng Bom 💣
 * 
 * Mô tả: Khi mảnh ghép được đặt xuống, nó sẽ tạo ra vụ nổ 3x3 xóa tất cả các ô xung quanh
 * 
 * Cách hoạt động:
 * 1. Khi người chơi chọn skill Bomb, mảnh tiếp theo sẽ có hiệu ứng Bomb
 * 2. Khi mảnh đó được đặt xuống (lock), nó sẽ kích hoạt vụ nổ
 * 3. Vụ nổ xóa tất cả các ô trong vùng 3x3 xung quanh vị trí mảnh ghép
 */

/**
 * Kích hoạt hiệu ứng bom tại vị trí mảnh ghép vừa được đặt xuống
 * 
 * @param {Array} board - Bảng game (mảng 2 chiều)
 * @param {Object} piece - Mảnh ghép vừa được đặt
 * @param {number} piece.x - Vị trí X (cột) của mảnh
 * @param {number} piece.y - Vị trí Y (hàng) của mảnh
 * @param {Array} piece.shape - Hình dạng của mảnh (mảng 2 chiều)
 * @param {number} BOARD_WIDTH - Chiều rộng của bảng
 * @param {number} BOARD_HEIGHT - Chiều cao của bảng
 */
export function activateBombEffect(board, piece, BOARD_WIDTH, BOARD_HEIGHT) {
    // Tìm tâm của mảnh ghép (trung tâm của vụ nổ)
    let centerX = 0;
    let centerY = 0;
    let blockCount = 0;
    
    // Tính trung bình vị trí của tất cả các ô trong mảnh để tìm tâm
    piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                centerX += piece.x + c;
                centerY += piece.y + r;
                blockCount++;
            }
        });
    });
    
    // Chia trung bình để có tọa độ tâm
    centerX = Math.floor(centerX / blockCount);
    centerY = Math.floor(centerY / blockCount);
    
    // Tạo vụ nổ 3x3 xung quanh tâm
    // Duyệt qua 9 ô (3x3) xung quanh tâm
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            const explodeX = centerX + dx;
            const explodeY = centerY + dy;
            
            // Kiểm tra xem ô có nằm trong bảng không
            if (explodeX >= 0 && explodeX < BOARD_WIDTH && 
                explodeY >= 0 && explodeY < BOARD_HEIGHT) {
                // Xóa ô (đặt về 0 = ô trống)
                board[explodeY][explodeX] = 0;
            }
        }
    }
    
    return true; // Trả về true để báo hiệu đã kích hoạt thành công
}

/**
 * Kiểm tra xem có đang có hiệu ứng bom chờ kích hoạt không
 * 
 * @param {Array} activePowerups - Danh sách các skill đang hoạt động
 * @returns {boolean} true nếu có bomb chờ kích hoạt
 */
export function hasBombPending(activePowerups) {
    return activePowerups.some(p => p.id === 'BOMB' && p.uses > 0);
}

/**
 * Giảm số lần sử dụng của bomb sau khi đã kích hoạt
 * 
 * @param {Array} activePowerups - Danh sách các skill đang hoạt động
 * @returns {Array} Danh sách đã được cập nhật
 */
export function consumeBombUse(activePowerups) {
    return activePowerups.map(p => {
        if (p.id === 'BOMB' && p.uses > 0) {
            return { ...p, uses: p.uses - 1 };
        }
        return p;
    }).filter(p => p.id !== 'BOMB' || p.uses > 0); // Xóa bomb nếu hết lượt
}
