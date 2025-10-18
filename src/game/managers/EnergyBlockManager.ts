// src/game/managers/EnergyBlockManager.ts
// ======================================================
// ✅ Energy Block Manager - Quản lý Energy Blocks
// 
// Class này chịu trách nhiệm:
// - Spawn energy blocks (Hard/Impossible mode)
// - Cập nhật vị trí energy blocks (tự động rơi)
// - Kiểm tra va chạm (chạm đáy, chạm mảnh đã khóa)
// - Xử lý nổ và đóng băng chuột (Impossible mode)
// ======================================================

import { Scene } from 'phaser';
import { 
    EnergyBlock, 
    BOARD_WIDTH, 
    BOARD_HEIGHT, 
    BLOCK_SIZE,
    FROZEN_TEXT_BLINK_CYCLE 
} from '../constants/GameConstants';
import { 
    DIFFICULTY_LEVELS, 
    getDifficultyConfig 
} from '../constants/DifficultyConstants';

/**
 * ✅ EnergyBlockManager - Quản lý tất cả logic về Energy Blocks
 * 
 * Cách hoạt động:
 * 1. Spawn energy blocks theo tỷ lệ của difficulty
 * 2. Cập nhật vị trí (rơi xuống theo thời gian)
 * 3. Kiểm tra va chạm và game over
 * 4. (Impossible mode) Theo dõi chuột và tạo hiệu ứng nổ
 * 
 * Try it: Chạy game ở Hard hoặc Impossible để thấy energy blocks!
 */
export class EnergyBlockManager {
    private scene: Scene;
    private difficulty: DIFFICULTY_LEVELS;
    private energyBlocks: EnergyBlock[];
    private isMouseFrozen: boolean;
    private frozenText: Phaser.GameObjects.Text | null;
    private boardX: number;
    private boardY: number;
    private graphics: Phaser.GameObjects.Graphics;
    private board: number[][];
    private onGameOver: () => void;
    private isGameOver: () => boolean;
    
    /**
     * ✅ Constructor - Khởi tạo EnergyBlockManager
     * 
     * @param scene - Phaser Scene (để vẽ và tạo hiệu ứng)
     * @param difficulty - Độ khó game
     * @param boardX - Vị trí X của board
     * @param boardY - Vị trí Y của board
     * @param board - Tham chiếu đến board game (để kiểm tra va chạm)
     * @param onGameOver - Callback khi game over
     * @param isGameOver - Callback để kiểm tra game đã over chưa
     */
    constructor(
        scene: Scene,
        difficulty: DIFFICULTY_LEVELS,
        boardX: number,
        boardY: number,
        board: number[][],
        onGameOver: () => void,
        isGameOver: () => boolean
    ) {
        this.scene = scene;
        this.difficulty = difficulty;
        this.energyBlocks = [];
        this.isMouseFrozen = false;
        this.frozenText = null;
        this.boardX = boardX;
        this.boardY = boardY;
        this.graphics = scene.add.graphics();
        this.board = board;
        this.onGameOver = onGameOver;
        this.isGameOver = isGameOver;
    }
    
    /**
     * ✅ init() - Khởi tạo mouse tracking (nếu cần)
     * 
     * Gọi hàm này trong create() của Game scene
     */
    init() {
        this.initMouseTracking();
    }
    
    /**
     * ✅ shouldSpawnEnergyBlock() - Kiểm tra có spawn energy block không
     * 
     * Mục tiêu: Quyết định có tạo energy block mới không
     * 
     * Cách hoạt động:
     * 1. Kiểm tra difficulty có hỗ trợ energy blocks không
     * 2. Random theo tỷ lệ spawnChance (VD: 0.1 = 10%)
     * 3. Trả về true/false
     * 
     * Ví dụ:
     * - Hard mode: 10% cơ hội → Math.random() < 0.1
     * - Impossible: 20% cơ hội → Math.random() < 0.2
     * 
     * ❓ Câu hỏi: Tại sao dùng Math.random()?
     * 💡 Trả lời: Để tạo sự ngẫu nhiên! Không biết trước khi nào xuất hiện
     *            → Game thú vị hơn!
     */
    shouldSpawnEnergyBlock(): boolean {
        const config = getDifficultyConfig(this.difficulty);
        
        // ❌ Độ khó này không có energy blocks
        if (!config.hasEnergyBlocks || !config.energyBlockConfig) {
            return false;
        }
        
        // 🎲 Random theo tỷ lệ spawnChance
        return Math.random() < config.energyBlockConfig.spawnChance;
    }
    
    /**
     * ✅ createEnergyBlock() - Tạo energy block mới
     * 
     * Mục tiêu: Tạo 1 energy block với cấu hình từ difficulty
     * 
     * Cách hoạt động:
     * 1. Lấy config từ difficulty
     * 2. Random vị trí X (0 đến BOARD_WIDTH-1)
     * 3. Vị trí Y = 0 (spawn ở trên cùng)
     * 4. Copy các thuộc tính từ energyBlockConfig
     * 
     * Trả về: EnergyBlock object hoặc null
     * 
     * ❓ Câu hỏi: Tại sao spawn ở y = 0?
     * 💡 Trả lời: Giống mảnh Tetris, energy block cũng rơi từ trên xuống!
     */
    createEnergyBlock(): EnergyBlock | null {
        const config = getDifficultyConfig(this.difficulty);
        
        if (!config.hasEnergyBlocks || !config.energyBlockConfig) {
            return null;
        }
        
        const energyConfig = config.energyBlockConfig;
        
        return {
            x: Math.floor(Math.random() * BOARD_WIDTH), // Random cột
            y: 0,                                       // Trên cùng
            color: energyConfig.color,                  // Màu theo config
            dropSpeed: energyConfig.dropSpeed,          // Tốc độ rơi
            lastDropTime: Date.now(),                   // Timestamp hiện tại
            canExplode: energyConfig.canExplode,        // Có nổ không
            explosionDistance: energyConfig.explosionDistance,
            freezeDuration: energyConfig.freezeDuration
        };
    }
    
    /**
     * ✅ trySpawnEnergyBlock() - Thử spawn energy block
     * 
     * Mục tiêu: Gọi khi spawn mảnh mới, có thể tạo energy block
     * 
     * Cách hoạt động:
     * 1. Gọi shouldSpawnEnergyBlock() để kiểm tra
     * 2. Nếu true → tạo và thêm vào danh sách
     * 
     * Try it: Được gọi trong spawnPiece()
     */
    trySpawnEnergyBlock() {
        if (this.shouldSpawnEnergyBlock()) {
            const newBlock = this.createEnergyBlock();
            if (newBlock) {
                this.energyBlocks.push(newBlock);
            }
        }
    }
    
    /**
     * ✅ update() - Cập nhật tất cả energy blocks
     * 
     * Mục tiêu: Làm energy blocks tự động rơi xuống
     * 
     * Cách hoạt động:
     * 1. Duyệt qua tất cả energy blocks (từ cuối lên đầu)
     * 2. Kiểm tra đã đến lúc rơi chưa (so sánh timestamp)
     * 3. Nếu đến lúc → y++, cập nhật lastDropTime
     * 4. Kiểm tra chạm đáy hoặc va chạm → Game Over!
     * 
     * ❓ Câu hỏi: Tại sao duyệt từ cuối lên?
     * 💡 Trả lời: Để có thể xóa phần tử trong mảng một cách an toàn!
     *            Nếu duyệt từ đầu, xóa 1 phần tử → index bị lệch!
     */
    update() {
        const currentTime = Date.now();
        
        // Duyệt ngược để có thể xóa an toàn
        for (let i = this.energyBlocks.length - 1; i >= 0; i--) {
            const block = this.energyBlocks[i];
            
            // ⏰ Kiểm tra đã đến lúc rơi chưa
            if (currentTime - block.lastDropTime >= block.dropSpeed) {
                block.y++; // Rơi xuống 1 ô
                block.lastDropTime = currentTime;
                
                // ❌ Chạm đáy → Game Over!
                if (block.y >= BOARD_HEIGHT) {
                    this.energyBlocks.splice(i, 1);
                    this.onGameOver();
                    return;
                }
                
                // ❌ Va chạm với mảnh đã khóa → Game Over!
                if (this.board[block.y] && this.board[block.y][block.x] !== 0) {
                    this.energyBlocks.splice(i, 1);
                    this.onGameOver();
                    return;
                }
            }
        }
    }
    
    /**
     * ✅ render() - Vẽ tất cả energy blocks
     * 
     * Mục tiêu: Hiển thị energy blocks lên màn hình
     * 
     * Cách hoạt động:
     * 1. Clear graphics cũ
     * 2. Duyệt qua tất cả energy blocks
     * 3. Vẽ mỗi block với hiệu ứng đặc biệt
     * 4. Nếu canExplode → thêm dấu cảnh báo
     */
    render() {
        // Clear graphics cũ
        this.graphics.clear();
        
        // ⚡ Draw energy blocks
        for (const block of this.energyBlocks) {
            const px = this.boardX + block.x * BLOCK_SIZE;
            const py = this.boardY + block.y * BLOCK_SIZE;
            
            // 🎨 Vẽ energy block với hiệu ứng đặc biệt
            this.graphics.fillStyle(block.color, 0.8);
            this.graphics.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            
            // ✨ Viền sáng (glow effect)
            this.graphics.lineStyle(2, 0xFFFFFF, 0.6);
            this.graphics.strokeRect(px + 2, py + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
            
            // 💥 Nếu có thể nổ, thêm dấu cảnh báo
            if (block.canExplode) {
                // Vẽ dấu X nhỏ ở giữa
                const centerX = px + BLOCK_SIZE / 2;
                const centerY = py + BLOCK_SIZE / 2;
                const size = 4;
                
                this.graphics.lineStyle(2, 0xFF0000, 1);
                this.graphics.beginPath();
                this.graphics.moveTo(centerX - size, centerY - size);
                this.graphics.lineTo(centerX + size, centerY + size);
                this.graphics.moveTo(centerX + size, centerY - size);
                this.graphics.lineTo(centerX - size, centerY + size);
                this.graphics.strokePath();
            }
        }
    }
    
    /**
     * ✅ initMouseTracking() - Khởi tạo theo dõi chuột
     * 
     * Mục tiêu: Theo dõi vị trí chuột để kiểm tra khoảng cách với energy blocks
     *           (Chỉ hoạt động ở Impossible mode)
     * 
     * Cách hoạt động:
     * 1. Kiểm tra difficulty có phải Impossible không
     * 2. Lắng nghe sự kiện pointermove (di chuyển chuột)
     * 3. Gọi checkMouseProximity() mỗi khi chuột di chuyển
     * 
     * ❓ Câu hỏi: Tại sao chỉ Impossible mode?
     * 💡 Trả lời: Đây là tính năng cực khó! Hard mode chưa có nổ.
     */
    private initMouseTracking() {
        const config = getDifficultyConfig(this.difficulty);
        
        // ❌ Không phải Impossible hoặc không có energy blocks
        if (this.difficulty !== DIFFICULTY_LEVELS.IMPOSSIBLE || 
            !config.hasEnergyBlocks || 
            !config.energyBlockConfig?.canExplode) {
            return;
        }
        
        // 🖱️ Lắng nghe sự kiện di chuyển chuột
        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            // ❌ Nếu chuột frozen hoặc game over → không làm gì
            if (this.isMouseFrozen || this.isGameOver()) return;
            this.checkMouseProximity(pointer.x, pointer.y);
        });
    }
    
    /**
     * ✅ checkMouseProximity() - Kiểm tra chuột có gần energy block không
     * 
     * Mục tiêu: Tính khoảng cách giữa chuột và các energy blocks
     *           Nếu quá gần → NỔ!
     * 
     * Cách hoạt động:
     * 1. Duyệt qua tất cả energy blocks
     * 2. Tính vị trí pixel của energy block
     * 3. Tính khoảng cách từ chuột đến block (công thức Pythagoras)
     * 4. Nếu khoảng cách < explosionDistance → Gọi explodeEnergyBlock()
     * 
     * Công thức khoảng cách:
     * distance = √((x2-x1)² + (y2-y1)²)
     * 
     * ❓ Câu hỏi: Tại sao dùng công thức Pythagoras?
     * 💡 Trả lời: Để tính khoảng cách thẳng (đường chéo) giữa 2 điểm!
     *            Giống định lý Pythagoras: a² + b² = c²
     */
    private checkMouseProximity(mouseX: number, mouseY: number) {
        const config = getDifficultyConfig(this.difficulty);
        
        if (!config.energyBlockConfig?.canExplode) return;
        
        // Duyệt ngược để có thể xóa an toàn
        for (let i = this.energyBlocks.length - 1; i >= 0; i--) {
            const block = this.energyBlocks[i];
            
            // 📍 Tính vị trí pixel của energy block (giữa ô)
            const blockPixelX = this.boardX + block.x * BLOCK_SIZE + BLOCK_SIZE / 2;
            const blockPixelY = this.boardY + block.y * BLOCK_SIZE + BLOCK_SIZE / 2;
            
            // 📏 Tính khoảng cách (Pythagoras: √(Δx² + Δy²))
            const distance = Math.sqrt(
                Math.pow(mouseX - blockPixelX, 2) + 
                Math.pow(mouseY - blockPixelY, 2)
            );
            
            // 💥 Chuột quá gần → NỔ!
            if (distance < (block.explosionDistance || 0)) {
                this.explodeEnergyBlock(i);
                return;
            }
        }
    }
    
    /**
     * ✅ explodeEnergyBlock() - Làm nổ energy block
     * 
     * Mục tiêu: Hiệu ứng nổ + đóng băng chuột
     * 
     * Cách hoạt động:
     * 1. Lấy thông tin block
     * 2. Tạo hiệu ứng nổ (animation)
     * 3. Xóa block khỏi danh sách
     * 4. Đóng băng chuột theo freezeDuration
     * 
     * Try it: Chạy Impossible mode, di chuyển chuột gần energy block!
     * 
     * ❓ Câu hỏi: Tại sao phải đóng băng chuột?
     * 💡 Trả lời: Để tăng độ khó! Khi chuột đóng băng, không thể tránh
     *            các energy block khác → Rất nguy hiểm!
     */
    private explodeEnergyBlock(index: number) {
        const block = this.energyBlocks[index];
        if (!block) return;
        
        // 💥 Tạo hiệu ứng nổ (vẽ vòng tròn mở rộng)
        const explosionX = this.boardX + block.x * BLOCK_SIZE + BLOCK_SIZE / 2;
        const explosionY = this.boardY + block.y * BLOCK_SIZE + BLOCK_SIZE / 2;
        
        // Vẽ hiệu ứng nổ với graphics
        const explosionGraphics = this.scene.add.graphics();
        
        // 🎨 Animation: Vòng tròn mở rộng dần
        const animTarget = { radius: 5 };
        this.scene.tweens.add({
            targets: animTarget,
            radius: 50,
            duration: 500,
            ease: 'Power2',
            onUpdate: (tween) => {
                explosionGraphics.clear();
                const currentRadius = animTarget.radius;
                const alpha = 1 - tween.progress; // Mờ dần
                
                // Vẽ 3 vòng tròn (hiệu ứng sóng)
                explosionGraphics.lineStyle(3, block.color, alpha);
                explosionGraphics.strokeCircle(explosionX, explosionY, currentRadius);
                explosionGraphics.lineStyle(2, 0xFFFFFF, alpha * 0.5);
                explosionGraphics.strokeCircle(explosionX, explosionY, currentRadius * 0.7);
            },
            onComplete: () => {
                explosionGraphics.destroy(); // Xóa graphics sau khi xong
            }
        });
        
        // 🔊 Có thể thêm sound effect (nếu có)
        // this.scene.sound.play('explosion');
        
        // ❌ Xóa energy block
        this.energyBlocks.splice(index, 1);
        
        // 🧊 Đóng băng chuột
        if (block.freezeDuration) {
            this.freezeMouse(block.freezeDuration);
        }
    }
    
    /**
     * ✅ freezeMouse() - Đóng băng chuột
     * 
     * Mục tiêu: Ngăn người chơi di chuyển chuột trong 1 khoảng thời gian
     * 
     * Cách hoạt động:
     * 1. Đặt isMouseFrozen = true
     * 2. Hiển thị text "🧊 MOUSE FROZEN! 🧊"
     * 3. Sau duration → Bỏ đóng băng, xóa text
     * 
     * ❓ Câu hỏi: Người chơi có thể tránh bị freeze không?
     * 💡 Trả lời: CÓ! Giữ chuột xa energy blocks là được!
     *            Đó là kỹ năng của Impossible mode!
     */
    private freezeMouse(duration: number) {
        if (this.isMouseFrozen) return; // Đã bị đóng băng rồi
        
        this.isMouseFrozen = true;
        
        // 📝 Hiển thị text "MOUSE FROZEN"
        this.frozenText = this.scene.add.text(512, 300, '🧊 MOUSE FROZEN! 🧊', {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#00FFFF',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);
        
        // ✨ Hiệu ứng nhấp nháy
        this.scene.tweens.add({
            targets: this.frozenText,
            alpha: 0.3,
            duration: 300,
            yoyo: true,
            repeat: Math.floor(duration / FROZEN_TEXT_BLINK_CYCLE) // Nhấp nháy cho đến hết thời gian
        });
        
        // ⏰ Bỏ đóng băng sau duration
        this.scene.time.delayedCall(duration, () => {
            this.isMouseFrozen = false;
            if (this.frozenText) {
                this.frozenText.destroy();
                this.frozenText = null;
            }
        });
    }
    
    /**
     * ✅ getMouseFrozenState() - Lấy trạng thái đóng băng chuột
     * 
     * @returns true nếu chuột đang bị đóng băng
     */
    getMouseFrozenState(): boolean {
        return this.isMouseFrozen;
    }
    
    /**
     * ✅ destroy() - Dọn dẹp khi scene kết thúc
     */
    destroy() {
        this.graphics.destroy();
        if (this.frozenText) {
            this.frozenText.destroy();
        }
    }
}
