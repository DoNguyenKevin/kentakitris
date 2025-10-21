/**
 * WIDE MODE SKILL - Kỹ năng Mở Rộng Bảng 📏
 * 
 * Mô tả: Mở rộng bảng từ 10 cột thành 12 cột trong thời gian giới hạn
 * 
 * Cách hoạt động:
 * 1. Khi skill được kích hoạt, bảng mở rộng từ 10 → 12 cột
 * 2. Các ô hiện có được dịch sang giữa (thêm 1 cột trống mỗi bên)
 * 3. Khi hết thời gian, bảng thu hẹp về 10 cột
 * 4. Các ô ngoài giới hạn sẽ bị xóa khi thu hẹp
 */

/**
 * Trạng thái của Wide Mode
 */
let wideModeActive = false;
let originalBoardWidth = 10;
let currentBoardWidth = 10;
let originalBoard = null;

/**
 * Kích hoạt Wide Mode - mở rộng bảng
 * 
 * @param {Array} board - Bảng game hiện tại
 * @param {number} BOARD_HEIGHT - Chiều cao bảng
 * @param {number} newWidth - Chiều rộng mới (mặc định 12)
 * @returns {Array} Bảng mới đã được mở rộng
 */
export function activateWideMode(board, BOARD_HEIGHT, newWidth = 12) {
    if (wideModeActive) return board; // Đã active rồi
    
    wideModeActive = true;
    originalBoardWidth = board[0].length;
    currentBoardWidth = newWidth;
    
    // Lưu bảng gốc để có thể hoàn nguyên
    originalBoard = board.map(row => [...row]);
    
    // Tạo bảng mới rộng hơn
    const expandedBoard = [];
    const addColumns = newWidth - originalBoardWidth; // Số cột cần thêm
    const leftPadding = Math.floor(addColumns / 2); // Thêm vào bên trái
    const rightPadding = addColumns - leftPadding; // Thêm vào bên phải
    
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        const newRow = [
            ...Array(leftPadding).fill(0),  // Cột trống bên trái
            ...board[y],                     // Các ô gốc
            ...Array(rightPadding).fill(0)   // Cột trống bên phải
        ];
        expandedBoard.push(newRow);
    }
    
    console.log('📏 Wide Mode activated! Board width:', newWidth);
    return expandedBoard;
}

/**
 * Tắt Wide Mode - thu hẹp bảng về kích thước gốc
 * 
 * @param {Array} board - Bảng đang mở rộng
 * @param {number} BOARD_HEIGHT - Chiều cao bảng
 * @returns {Array} Bảng đã thu hẹp về kích thước gốc
 */
export function deactivateWideMode(board, BOARD_HEIGHT) {
    if (!wideModeActive) return board;
    
    wideModeActive = false;
    
    // Tạo bảng mới với kích thước gốc
    const shrunkBoard = [];
    const addColumns = currentBoardWidth - originalBoardWidth;
    const leftCut = Math.floor(addColumns / 2); // Cắt bên trái
    const rightBound = leftCut + originalBoardWidth; // Giới hạn bên phải
    
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        // Cắt bỏ các cột ngoài giới hạn gốc
        const newRow = board[y].slice(leftCut, rightBound);
        shrunkBoard.push(newRow);
    }
    
    currentBoardWidth = originalBoardWidth;
    originalBoard = null;
    
    console.log('📏 Wide Mode deactivated! Board width:', originalBoardWidth);
    return shrunkBoard;
}

/**
 * Kiểm tra xem Wide Mode có đang hoạt động không
 * 
 * @returns {boolean} true nếu đang hoạt động
 */
export function isWideModeActive() {
    return wideModeActive;
}

/**
 * Lấy chiều rộng bảng hiện tại
 * 
 * @returns {number} Chiều rộng hiện tại
 */
export function getCurrentBoardWidth() {
    return currentBoardWidth;
}

/**
 * Điều chỉnh vị trí spawn của mảnh mới cho Wide Mode
 * 
 * @param {Object} piece - Mảnh ghép mới
 * @param {number} originalWidth - Chiều rộng bảng gốc
 * @returns {Object} Mảnh với vị trí đã điều chỉnh
 */
export function adjustPieceForWideMode(piece, originalWidth = 10) {
    if (!wideModeActive) return piece;
    
    // Tính toán vị trí trung tâm cho bảng rộng hơn
    const centerX = Math.floor((currentBoardWidth - piece.shape[0].length) / 2);
    
    return {
        ...piece,
        x: centerX
    };
}

/**
 * Kiểm tra va chạm với chiều rộng bảng động
 * 
 * @param {Object} piece - Mảnh cần kiểm tra
 * @param {Array} board - Bảng game
 * @param {number} BOARD_HEIGHT - Chiều cao bảng
 * @returns {boolean} true nếu có va chạm
 */
export function checkCollisionWideMode(piece, board, BOARD_HEIGHT) {
    const boardWidth = board[0].length; // Chiều rộng động
    
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c]) {
                const boardX = piece.x + c;
                const boardY = piece.y + r;

                // Kiểm tra biên với chiều rộng động
                if (boardX < 0 || boardX >= boardWidth || boardY >= BOARD_HEIGHT) {
                    return true;
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

/**
 * Cập nhật CSS để hiển thị bảng rộng hơn
 * 
 * @param {HTMLElement} boardElement - Phần tử HTML của bảng
 * @param {number} width - Chiều rộng mới
 */
export function updateBoardDisplay(boardElement, width) {
    if (!boardElement) return;
    
    // Cập nhật grid columns
    boardElement.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    
    // Thêm class để styling đặc biệt nếu cần
    if (width > 10) {
        boardElement.classList.add('wide-mode');
    } else {
        boardElement.classList.remove('wide-mode');
    }
}
