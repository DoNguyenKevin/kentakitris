/**
 * TELEPORT SKILL - Kỹ năng Dịch Chuyển 🌀
 * 
 * Mô tả: Cho phép người chơi click vào bất kỳ đâu trên bảng để đặt mảnh ghép hiện tại
 * 
 * Cách hoạt động:
 * 1. Khi người chơi chọn skill Teleport, chế độ dịch chuyển được kích hoạt
 * 2. Người chơi click vào vị trí trên bảng
 * 3. Nếu vị trí đó hợp lệ (không va chạm), mảnh sẽ được di chuyển đến đó
 * 4. Skill sẽ tự động tắt sau khi sử dụng hoặc hết thời gian
 */

/**
 * Trạng thái của Teleport skill
 */
let teleportActive = false;
let teleportClickHandler = null;

/**
 * Kích hoạt chế độ Teleport
 * 
 * @param {HTMLElement} boardElement - Phần tử HTML của bảng game
 * @param {Function} onTeleport - Callback được gọi khi teleport thành công
 * @returns {Function} Hàm để tắt teleport mode
 */
export function activateTeleportMode(boardElement, onTeleport) {
    teleportActive = true;
    
    // Thêm class để hiển thị giao diện đặc biệt
    boardElement.classList.add('teleport-mode');
    
    // Tạo handler cho sự kiện click
    teleportClickHandler = (event) => {
        // Tính toán vị trí click trên bảng
        const rect = boardElement.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        // Chuyển đổi từ pixel sang tọa độ ô (cell)
        const blockWidth = rect.width / 10; // 10 là BOARD_WIDTH
        const blockHeight = rect.height / 20; // 20 là BOARD_HEIGHT (nhưng chỉ hiển thị 18)
        
        const cellX = Math.floor(clickX / blockWidth);
        const cellY = Math.floor(clickY / blockHeight);
        
        // Gọi callback với tọa độ đã tính
        onTeleport(cellX, cellY);
    };
    
    // Đăng ký event listener
    boardElement.addEventListener('click', teleportClickHandler);
    
    // Trả về hàm để tắt teleport mode
    return () => deactivateTeleportMode(boardElement);
}

/**
 * Tắt chế độ Teleport
 * 
 * @param {HTMLElement} boardElement - Phần tử HTML của bảng game
 */
export function deactivateTeleportMode(boardElement) {
    if (!teleportActive) return;
    
    teleportActive = false;
    boardElement.classList.remove('teleport-mode');
    
    // Xóa event listener
    if (teleportClickHandler) {
        boardElement.removeEventListener('click', teleportClickHandler);
        teleportClickHandler = null;
    }
}

/**
 * Thử dịch chuyển mảnh đến vị trí mới
 * 
 * @param {Object} currentPiece - Mảnh ghép hiện tại
 * @param {number} targetX - Vị trí X mục tiêu
 * @param {number} targetY - Vị trí Y mục tiêu
 * @param {Function} checkCollision - Hàm kiểm tra va chạm
 * @returns {Object|null} Mảnh mới nếu thành công, null nếu không hợp lệ
 */
export function tryTeleport(currentPiece, targetX, targetY, checkCollision) {
    if (!currentPiece) return null;
    
    // Tạo mảnh mới với vị trí mục tiêu
    const newPiece = {
        ...currentPiece,
        x: targetX,
        y: targetY
    };
    
    // Kiểm tra va chạm
    if (checkCollision(newPiece)) {
        return null; // Vị trí không hợp lệ
    }
    
    return newPiece; // Vị trí hợp lệ, trả về mảnh mới
}

/**
 * Kiểm tra xem Teleport mode có đang hoạt động không
 * 
 * @returns {boolean} true nếu đang ở chế độ teleport
 */
export function isTeleportActive() {
    return teleportActive;
}

/**
 * Vẽ các ô hợp lệ cho teleport (helper function)
 * 
 * @param {Array} board - Bảng game
 * @param {Object} piece - Mảnh ghép hiện tại
 * @param {Function} checkCollision - Hàm kiểm tra va chạm
 * @param {number} BOARD_WIDTH - Chiều rộng bảng
 * @param {number} BOARD_HEIGHT - Chiều cao bảng
 * @returns {Array} Mảng các vị trí hợp lệ [{x, y}]
 */
export function getValidTeleportPositions(board, piece, checkCollision, BOARD_WIDTH, BOARD_HEIGHT) {
    const validPositions = [];
    
    // Duyệt qua tất cả các vị trí có thể
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            const testPiece = { ...piece, x, y };
            
            // Kiểm tra xem vị trí này có hợp lệ không
            if (!checkCollision(testPiece)) {
                validPositions.push({ x, y });
            }
        }
    }
    
    return validPositions;
}
