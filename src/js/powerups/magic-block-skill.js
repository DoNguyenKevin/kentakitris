/**
 * MAGIC BLOCK SKILL - Kỹ năng Khối Ma Thuật ✨
 * 
 * Mô tả: Mảnh ghép tiếp theo sẽ tự động lấp đầy các khoảng trống trên bảng
 * 
 * Cách hoạt động:
 * 1. Khi người chơi chọn skill Magic Block, mảnh tiếp theo sẽ có hiệu ứng này
 * 2. Khi mảnh được đặt xuống, nó sẽ tìm các khoảng trống (gaps) ở các hàng bên dưới
 * 3. Tự động lấp đầy các khoảng trống bằng màu của mảnh
 */

/**
 * Kích hoạt hiệu ứng Magic Block - lấp đầy các khoảng trống
 * 
 * @param {Array} board - Bảng game (mảng 2 chiều)
 * @param {Object} piece - Mảnh ghép vừa được đặt
 * @param {number} BOARD_WIDTH - Chiều rộng của bảng
 * @param {number} BOARD_HEIGHT - Chiều cao của bảng
 */
export function activateMagicBlockEffect(board, piece, BOARD_WIDTH, BOARD_HEIGHT) {
    // Tìm hàng thấp nhất mà mảnh ghép chạm vào
    let lowestRow = 0;
    piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                const boardY = piece.y + r;
                if (boardY > lowestRow) {
                    lowestRow = boardY;
                }
            }
        });
    });
    
    // Tìm các khoảng trống (gaps) trong vùng dưới mảnh ghép
    const gaps = findGaps(board, lowestRow, BOARD_WIDTH, BOARD_HEIGHT);
    
    // Lấp đầy tối đa 5 khoảng trống bằng màu của mảnh
    const maxFills = 5;
    let filled = 0;
    
    for (const gap of gaps) {
        if (filled >= maxFills) break;
        
        // Lấp đầy khoảng trống bằng màu của mảnh
        board[gap.y][gap.x] = piece.color;
        filled++;
    }
    
    return filled > 0; // Trả về true nếu đã lấp đầy ít nhất 1 ô
}

/**
 * Tìm các khoảng trống (gaps) trên bảng
 * Gap là các ô trống (0) có ít nhất một ô không trống bên dưới
 * 
 * @param {Array} board - Bảng game
 * @param {number} startRow - Hàng bắt đầu tìm kiếm
 * @param {number} BOARD_WIDTH - Chiều rộng bảng
 * @param {number} BOARD_HEIGHT - Chiều cao bảng
 * @returns {Array} Mảng các gap {x, y, priority}
 */
function findGaps(board, startRow, BOARD_WIDTH, BOARD_HEIGHT) {
    const gaps = [];
    
    // Duyệt từ hàng startRow đến đáy bảng
    for (let y = startRow; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            // Nếu ô này trống
            if (board[y][x] === 0) {
                // Kiểm tra xem có ô không trống bên dưới không
                let hasBlockBelow = false;
                for (let checkY = y + 1; checkY < BOARD_HEIGHT; checkY++) {
                    if (board[checkY][x] !== 0) {
                        hasBlockBelow = true;
                        break;
                    }
                }
                
                // Nếu có ô bên dưới, đây là một gap
                if (hasBlockBelow) {
                    // Tính độ ưu tiên: gap càng sâu càng ưu tiên cao
                    const priority = BOARD_HEIGHT - y;
                    gaps.push({ x, y, priority });
                }
            }
        }
    }
    
    // Sắp xếp theo độ ưu tiên (gap sâu nhất trước)
    gaps.sort((a, b) => b.priority - a.priority);
    
    return gaps;
}

/**
 * Kiểm tra xem có đang có hiệu ứng Magic Block chờ kích hoạt không
 * 
 * @param {Array} activePowerups - Danh sách các skill đang hoạt động
 * @returns {boolean} true nếu có Magic Block chờ kích hoạt
 */
export function hasMagicBlockPending(activePowerups) {
    return activePowerups.some(p => p.id === 'MAGIC_BLOCK' && p.uses > 0);
}

/**
 * Giảm số lần sử dụng của Magic Block sau khi đã kích hoạt
 * 
 * @param {Array} activePowerups - Danh sách các skill đang hoạt động
 * @returns {Array} Danh sách đã được cập nhật
 */
export function consumeMagicBlockUse(activePowerups) {
    return activePowerups.map(p => {
        if (p.id === 'MAGIC_BLOCK' && p.uses > 0) {
            return { ...p, uses: p.uses - 1 };
        }
        return p;
    }).filter(p => p.id !== 'MAGIC_BLOCK' || p.uses > 0);
}
