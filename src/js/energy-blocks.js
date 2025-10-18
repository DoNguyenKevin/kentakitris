// js/energy-blocks.js
// ======================================================
// ✅ Quản lý hệ thống khối năng lượng (Energy Blocks)
// Khối năng lượng xuất hiện ở độ khó Hard và Impossible
// ======================================================

import { DIFFICULTY_CONFIG, DIFFICULTY_LEVELS } from './game-constants.js';
import { 
    board, 
    difficulty, 
    energyBlocks, 
    addEnergyBlock, 
    removeEnergyBlock,
    setIsMouseFrozen,
    isMouseFrozen
} from './game-state.js';

/**
 * Kiểm tra xem có nên spawn khối năng lượng không
 */
export function shouldSpawnEnergyBlock() {
    const config = DIFFICULTY_CONFIG[difficulty];
    if (!config || !config.hasEnergyBlocks) {
        return false;
    }
    
    return Math.random() < config.energyBlockConfig.spawnChance;
}

/**
 * Tạo khối năng lượng mới
 */
export function createEnergyBlock() {
    const config = DIFFICULTY_CONFIG[difficulty];
    if (!config || !config.hasEnergyBlocks) {
        return null;
    }
    
    const energyConfig = config.energyBlockConfig;
    const boardWidth = board[0].length;
    
    return {
        x: Math.floor(Math.random() * boardWidth), // Vị trí X ngẫu nhiên
        y: 0, // Bắt đầu từ trên cùng
        color: energyConfig.color,
        dropSpeed: energyConfig.dropSpeed,
        lastDropTime: Date.now(),
        canExplode: energyConfig.canExplode || false,
        explosionDistance: energyConfig.explosionDistance || 0,
        freezeDuration: energyConfig.freezeDuration || 0
    };
}

/**
 * Cập nhật tất cả khối năng lượng
 */
export function updateEnergyBlocks() {
    const currentTime = Date.now();
    const config = DIFFICULTY_CONFIG[difficulty];
    
    if (!config || !config.hasEnergyBlocks) {
        return;
    }
    
    // Duyệt qua tất cả khối năng lượng (ngược lại để có thể xóa an toàn)
    for (let i = energyBlocks.length - 1; i >= 0; i--) {
        const block = energyBlocks[i];
        
        // Kiểm tra xem đã đến lúc rơi chưa
        if (currentTime - block.lastDropTime >= block.dropSpeed) {
            block.y++; // Rơi xuống 1 ô
            block.lastDropTime = currentTime;
            
            // Kiểm tra xem đã chạm đáy chưa
            if (block.y >= board.length - 1) {
                // Game over nếu khối năng lượng chạm đáy
                removeEnergyBlock(i);
                return 'GAME_OVER';
            }
            
            // Kiểm tra va chạm với khối đã có trên board
            if (board[block.y] && board[block.y][block.x] !== 0) {
                // Game over nếu khối năng lượng va chạm với khối khác
                removeEnergyBlock(i);
                return 'GAME_OVER';
            }
        }
    }
    
    return null;
}

/**
 * Vẽ tất cả khối năng lượng lên board
 */
export function drawEnergyBlocks() {
    const boardEl = document.getElementById('game-board');
    if (!boardEl) return;
    
    energyBlocks.forEach(block => {
        const index = block.y * board[0].length + block.x;
        const cell = boardEl.children[index];
        
        if (cell) {
            cell.classList.add('block', block.color);
        }
    });
}

/**
 * Kiểm tra chuột có gần khối năng lượng không (cho Impossible mode)
 */
export function checkMouseProximity(mouseX, mouseY) {
    if (difficulty !== DIFFICULTY_LEVELS.IMPOSSIBLE) {
        return;
    }
    
    const config = DIFFICULTY_CONFIG[difficulty];
    if (!config || !config.hasEnergyBlocks || !config.energyBlockConfig.canExplode) {
        return;
    }
    
    const boardEl = document.getElementById('game-board');
    if (!boardEl) return;
    
    const boardRect = boardEl.getBoundingClientRect();
    const cellWidth = boardRect.width / board[0].length;
    const cellHeight = boardRect.height / board.length;
    
    // Duyệt qua tất cả khối năng lượng
    for (let i = energyBlocks.length - 1; i >= 0; i--) {
        const block = energyBlocks[i];
        
        // Tính vị trí pixel của khối năng lượng
        const blockX = boardRect.left + block.x * cellWidth + cellWidth / 2;
        const blockY = boardRect.top + block.y * cellHeight + cellHeight / 2;
        
        // Tính khoảng cách từ chuột đến khối năng lượng
        const distance = Math.sqrt(
            Math.pow(mouseX - blockX, 2) + 
            Math.pow(mouseY - blockY, 2)
        );
        
        // Nếu chuột đến gần, khối năng lượng nổ
        if (distance < config.energyBlockConfig.explosionDistance) {
            explodeEnergyBlock(i);
            return true;
        }
    }
    
    return false;
}

/**
 * Làm nổ khối năng lượng
 */
function explodeEnergyBlock(index) {
    const block = energyBlocks[index];
    if (!block) return;
    
    // Hiệu ứng nổ (có thể thêm animation)
    const boardEl = document.getElementById('game-board');
    if (boardEl) {
        const cellIndex = block.y * board[0].length + block.x;
        const cell = boardEl.children[cellIndex];
        
        if (cell) {
            cell.style.animation = 'energy-explode 0.5s ease-out';
            setTimeout(() => {
                if (cell) {
                    cell.style.animation = '';
                }
            }, 500);
        }
    }
    
    // Xóa khối năng lượng
    removeEnergyBlock(index);
    
    // Đóng băng chuột
    freezeMouse(block.freezeDuration);
}

/**
 * Đóng băng chuột trong một khoảng thời gian
 */
function freezeMouse(duration) {
    if (isMouseFrozen) return;
    
    setIsMouseFrozen(true);
    document.body.classList.add('mouse-frozen');
    
    // Hiển thị thông báo
    const statusEl = document.getElementById('status-message');
    if (statusEl) {
        const originalText = statusEl.textContent;
        statusEl.textContent = '🧊 MOUSE FROZEN! 🧊';
        statusEl.style.color = '#00ffff';
        
        setTimeout(() => {
            statusEl.textContent = originalText;
            statusEl.style.color = '';
        }, duration);
    }
    
    // Bỏ đóng băng sau khi hết thời gian
    setTimeout(() => {
        setIsMouseFrozen(false);
        document.body.classList.remove('mouse-frozen');
    }, duration);
}

/**
 * Spawn khối năng lượng mới nếu cần
 */
export function trySpawnEnergyBlock() {
    if (shouldSpawnEnergyBlock()) {
        const newBlock = createEnergyBlock();
        if (newBlock) {
            addEnergyBlock(newBlock);
        }
    }
}

/**
 * Khởi tạo mouse tracking cho Impossible mode
 */
export function initMouseTracking() {
    if (difficulty !== DIFFICULTY_LEVELS.IMPOSSIBLE) {
        return;
    }
    
    const boardEl = document.getElementById('game-board');
    if (!boardEl) return;
    
    boardEl.addEventListener('mousemove', (e) => {
        if (isMouseFrozen) return;
        checkMouseProximity(e.clientX, e.clientY);
    });
}
