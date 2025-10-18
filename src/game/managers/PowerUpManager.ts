// src/game/managers/PowerUpManager.ts
// ======================================================
// ✅ Power-Up Manager - Quản lý các kỹ năng đặc biệt
// 
// Class này chịu trách nhiệm:
// - Quản lý trạng thái của tất cả power-ups
// - Kích hoạt/tắt power-ups
// - Xử lý logic cho từng loại power-up
// - Render hiệu ứng visual
// ======================================================

import { Scene } from 'phaser';
import { 
    PowerUpType, 
    PowerUpState, 
    PowerUpConfig,
    BOMB_CONFIG,
    MAGIC_BLOCK_CONFIG,
    REVERSE_GRAVITY_CONFIG,
    TELEPORT_CONFIG,
    WIDE_MODE_CONFIG
} from '../constants/PowerUpConstants';
import { 
    BOARD_WIDTH, 
    BOARD_HEIGHT, 
    BLOCK_SIZE,
    Piece 
} from '../constants/GameConstants';

/**
 * ✅ PowerUpManager - Quản lý tất cả logic về Power-Ups
 * 
 * Cách hoạt động:
 * 1. Lưu trữ trạng thái của các power-ups đang active
 * 2. Xử lý kích hoạt power-ups khi mảnh được đặt
 * 3. Cập nhật timers cho power-ups có thời gian
 * 4. Vẽ hiệu ứng visual
 * 
 * Try it: Kích hoạt power-up và xem magic xảy ra!
 */
export class PowerUpManager {
    private scene: Scene;
    private boardX: number;
    private boardY: number;
    private board: number[][];
    private activePowerUps: Map<PowerUpType, PowerUpState>;
    
    // 📊 State cho từng power-up
    private isReverseGravityActive: boolean = false;
    private isWideModeActive: boolean = false;
    private isTeleportActive: boolean = false;
    private originalBoardWidth: number = BOARD_WIDTH;
    private currentBoardWidth: number = BOARD_WIDTH;
    
    // 🎨 Graphics và UI
    private graphics: Phaser.GameObjects.Graphics;
    private teleportHintGraphics: Phaser.GameObjects.Graphics;
    
    /**
     * ✅ Constructor - Khởi tạo PowerUpManager
     * 
     * @param scene - Phaser Scene
     * @param boardX - Vị trí X của board
     * @param boardY - Vị trí Y của board
     * @param board - Tham chiếu đến board game
     */
    constructor(
        scene: Scene,
        boardX: number,
        boardY: number,
        board: number[][]
    ) {
        this.scene = scene;
        this.boardX = boardX;
        this.boardY = boardY;
        this.board = board;
        this.activePowerUps = new Map();
        this.graphics = scene.add.graphics();
        this.teleportHintGraphics = scene.add.graphics();
    }
    
    /**
     * ✅ activatePowerUp() - Kích hoạt một power-up
     * 
     * Mục tiêu: Bật power-up và thiết lập state ban đầu
     * 
     * Cách hoạt động:
     * 1. Lấy config của power-up
     * 2. Tạo PowerUpState mới
     * 3. Thêm vào activePowerUps map
     * 4. Xử lý logic đặc biệt cho từng loại
     * 
     * @param type - Loại power-up cần kích hoạt
     * @param uses - Số lần dùng (optional, dùng default nếu không truyền)
     * @param duration - Thời gian hoạt động (optional, dùng default nếu không truyền)
     */
    activatePowerUp(type: PowerUpType, uses?: number, duration?: number): void {
        let config: PowerUpConfig;
        
        // Lấy config tương ứng
        switch (type) {
            case PowerUpType.BOMB:
                config = BOMB_CONFIG;
                break;
            case PowerUpType.MAGIC_BLOCK:
                config = MAGIC_BLOCK_CONFIG;
                break;
            case PowerUpType.REVERSE_GRAVITY:
                config = REVERSE_GRAVITY_CONFIG;
                break;
            case PowerUpType.TELEPORT:
                config = TELEPORT_CONFIG;
                break;
            case PowerUpType.WIDE_MODE:
                config = WIDE_MODE_CONFIG;
                break;
        }
        
        // Tạo state mới
        const state: PowerUpState = {
            type: type,
            uses: uses ?? config.defaultUses ?? 1,
            duration: duration ?? config.defaultDuration,
            active: true
        };
        
        this.activePowerUps.set(type, state);
        
        // Xử lý logic đặc biệt cho từng loại
        switch (type) {
            case PowerUpType.REVERSE_GRAVITY:
                this.activateReverseGravity();
                break;
            case PowerUpType.WIDE_MODE:
                this.activateWideMode();
                break;
            case PowerUpType.TELEPORT:
                this.activateTeleport();
                break;
        }
        
        console.log(`${config.emoji} ${config.name} activated!`);
    }
    
    /**
     * ✅ deactivatePowerUp() - Tắt một power-up
     * 
     * @param type - Loại power-up cần tắt
     */
    deactivatePowerUp(type: PowerUpType): void {
        const state = this.activePowerUps.get(type);
        if (!state) return;
        
        state.active = false;
        this.activePowerUps.delete(type);
        
        // Xử lý logic tắt đặc biệt
        switch (type) {
            case PowerUpType.REVERSE_GRAVITY:
                this.deactivateReverseGravity();
                break;
            case PowerUpType.WIDE_MODE:
                this.deactivateWideMode();
                break;
            case PowerUpType.TELEPORT:
                this.deactivateTeleport();
                break;
        }
        
        console.log(`Power-up ${type} deactivated!`);
    }
    
    /**
     * ✅ update() - Cập nhật power-ups mỗi frame
     * 
     * Gọi hàm này trong update() của Game scene
     * Nhiệm vụ: Cập nhật timers và tự động tắt khi hết thời gian
     * 
     * @param delta - Thời gian trôi qua từ frame trước (ms)
     */
    update(delta: number): void {
        // Duyệt qua tất cả power-ups đang active
        for (const [type, state] of this.activePowerUps) {
            // Nếu có duration (power-up theo thời gian)
            if (state.duration !== undefined && state.duration > 0) {
                state.duration -= delta;
                
                // Hết thời gian → tắt
                if (state.duration <= 0) {
                    this.deactivatePowerUp(type);
                }
            }
        }
    }
    
    // ==========================================
    // 💣 BOMB SKILL LOGIC
    // ==========================================
    
    /**
     * ✅ activateBombEffect() - Kích hoạt hiệu ứng bom
     * 
     * Tạo vụ nổ 3x3 xung quanh vị trí mảnh
     * 
     * @param piece - Mảnh vừa được đặt
     * @returns true nếu đã kích hoạt bomb
     */
    activateBombEffect(piece: Piece): boolean {
        const state = this.activePowerUps.get(PowerUpType.BOMB);
        if (!state || state.uses <= 0) return false;
        
        // Tìm tâm của mảnh ghép
        let centerX = 0;
        let centerY = 0;
        let blockCount = 0;
        
        piece.shape.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell) {
                    centerX += piece.x + c;
                    centerY += piece.y + r;
                    blockCount++;
                }
            });
        });
        
        centerX = Math.floor(centerX / blockCount);
        centerY = Math.floor(centerY / blockCount);
        
        // Tạo vụ nổ 3x3
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const explodeX = centerX + dx;
                const explodeY = centerY + dy;
                
                if (explodeX >= 0 && explodeX < this.currentBoardWidth && 
                    explodeY >= 0 && explodeY < BOARD_HEIGHT) {
                    this.board[explodeY][explodeX] = 0;
                }
            }
        }
        
        // Giảm số lần dùng
        state.uses--;
        if (state.uses <= 0) {
            this.deactivatePowerUp(PowerUpType.BOMB);
        }
        
        return true;
    }
    
    /**
     * ✅ hasBombPending() - Kiểm tra có bomb chờ kích hoạt không
     */
    hasBombPending(): boolean {
        const state = this.activePowerUps.get(PowerUpType.BOMB);
        return state ? state.uses > 0 : false;
    }
    
    // ==========================================
    // ✨ MAGIC BLOCK SKILL LOGIC
    // ==========================================
    
    /**
     * ✅ activateMagicBlockEffect() - Kích hoạt hiệu ứng magic block
     * 
     * Lấp đầy các khoảng trống trong board
     * 
     * @param piece - Mảnh vừa được đặt
     * @returns true nếu đã kích hoạt magic block
     */
    activateMagicBlockEffect(piece: Piece): boolean {
        const state = this.activePowerUps.get(PowerUpType.MAGIC_BLOCK);
        if (!state || state.uses <= 0) return false;
        
        // Tìm hàng thấp nhất mà mảnh chạm vào
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
        
        // Tìm các khoảng trống
        const gaps = this.findGaps(lowestRow);
        
        // Lấp đầy tối đa 5 khoảng trống
        const maxFills = 5;
        let filled = 0;
        
        for (const gap of gaps) {
            if (filled >= maxFills) break;
            this.board[gap.y][gap.x] = piece.color;
            filled++;
        }
        
        // Giảm số lần dùng
        state.uses--;
        if (state.uses <= 0) {
            this.deactivatePowerUp(PowerUpType.MAGIC_BLOCK);
        }
        
        return filled > 0;
    }
    
    /**
     * 🔍 findGaps() - Tìm các khoảng trống trong board
     * 
     * Gap = ô trống có ít nhất 1 ô không trống bên dưới
     */
    private findGaps(startRow: number): Array<{x: number, y: number, priority: number}> {
        const gaps: Array<{x: number, y: number, priority: number}> = [];
        
        for (let y = startRow; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.currentBoardWidth; x++) {
                if (this.board[y][x] === 0) {
                    // Kiểm tra có ô không trống bên dưới không
                    let hasBlockBelow = false;
                    for (let checkY = y + 1; checkY < BOARD_HEIGHT; checkY++) {
                        if (this.board[checkY][x] !== 0) {
                            hasBlockBelow = true;
                            break;
                        }
                    }
                    
                    if (hasBlockBelow) {
                        const priority = BOARD_HEIGHT - y;
                        gaps.push({ x, y, priority });
                    }
                }
            }
        }
        
        gaps.sort((a, b) => b.priority - a.priority);
        return gaps;
    }
    
    /**
     * ✅ hasMagicBlockPending() - Kiểm tra có magic block chờ kích hoạt không
     */
    hasMagicBlockPending(): boolean {
        const state = this.activePowerUps.get(PowerUpType.MAGIC_BLOCK);
        return state ? state.uses > 0 : false;
    }
    
    // ==========================================
    // 🔺 REVERSE GRAVITY SKILL LOGIC
    // ==========================================
    
    /**
     * ✅ activateReverseGravity() - Kích hoạt đảo trọng lực
     */
    private activateReverseGravity(): void {
        this.isReverseGravityActive = true;
        console.log('🔺 Reverse Gravity activated!');
    }
    
    /**
     * ✅ deactivateReverseGravity() - Tắt đảo trọng lực
     */
    private deactivateReverseGravity(): void {
        this.isReverseGravityActive = false;
        console.log('🔺 Reverse Gravity deactivated!');
    }
    
    /**
     * ✅ isReverseGravityActive() - Kiểm tra reverse gravity có đang hoạt động không
     */
    isReverseGravity(): boolean {
        return this.isReverseGravityActive;
    }
    
    /**
     * ✅ getGravityDirection() - Lấy hướng trọng lực
     * 
     * @returns -1 nếu đi lên (reverse), +1 nếu đi xuống (normal)
     */
    getGravityDirection(): number {
        return this.isReverseGravityActive ? -1 : 1;
    }
    
    /**
     * ✅ adjustSpawnPosition() - Điều chỉnh vị trí spawn cho reverse gravity
     * 
     * @param piece - Mảnh cần spawn
     * @returns Mảnh với vị trí đã điều chỉnh
     */
    adjustSpawnPosition(piece: Piece): Piece {
        if (!this.isReverseGravityActive) {
            // Vị trí bình thường (ở trên)
            return {
                ...piece,
                x: Math.floor((this.currentBoardWidth - piece.shape[0].length) / 2),
                y: 0
            };
        } else {
            // Vị trí khi reverse (ở dưới)
            return {
                ...piece,
                x: Math.floor((this.currentBoardWidth - piece.shape[0].length) / 2),
                y: BOARD_HEIGHT - piece.shape.length
            };
        }
    }
    
    // ==========================================
    // 🌀 TELEPORT SKILL LOGIC
    // ==========================================
    
    /**
     * ✅ activateTeleport() - Kích hoạt chế độ teleport
     */
    private activateTeleport(): void {
        this.isTeleportActive = true;
        console.log('🌀 Teleport mode activated!');
    }
    
    /**
     * ✅ deactivateTeleport() - Tắt chế độ teleport
     */
    private deactivateTeleport(): void {
        this.isTeleportActive = false;
        this.teleportHintGraphics.clear();
        console.log('🌀 Teleport mode deactivated!');
    }
    
    /**
     * ✅ isTeleportActive() - Kiểm tra teleport có đang hoạt động không
     */
    isTeleport(): boolean {
        return this.isTeleportActive;
    }
    
    /**
     * ✅ tryTeleport() - Thử dịch chuyển mảnh đến vị trí mới
     * 
     * @param currentPiece - Mảnh hiện tại
     * @param targetX - Vị trí X đích
     * @param targetY - Vị trí Y đích
     * @param checkCollision - Hàm kiểm tra va chạm
     * @returns Mảnh mới nếu thành công, null nếu thất bại
     */
    tryTeleport(
        currentPiece: Piece,
        targetX: number,
        targetY: number,
        checkCollision: (piece: Piece) => boolean
    ): Piece | null {
        if (!this.isTeleportActive) return null;
        
        const newPiece: Piece = {
            ...currentPiece,
            x: targetX,
            y: targetY
        };
        
        if (checkCollision(newPiece)) {
            return null; // Vị trí không hợp lệ
        }
        
        // Consume teleport use
        const state = this.activePowerUps.get(PowerUpType.TELEPORT);
        if (state) {
            state.uses--;
            if (state.uses <= 0) {
                this.deactivatePowerUp(PowerUpType.TELEPORT);
            }
        }
        
        return newPiece;
    }
    
    // ==========================================
    // 📏 WIDE MODE SKILL LOGIC
    // ==========================================
    
    /**
     * ✅ activateWideMode() - Kích hoạt wide mode
     * 
     * Mở rộng board từ 10 → 12 cột
     */
    private activateWideMode(): void {
        if (this.isWideModeActive) return;
        
        this.isWideModeActive = true;
        this.originalBoardWidth = this.currentBoardWidth;
        const newWidth = 12;
        this.currentBoardWidth = newWidth;
        
        // Mở rộng board
        const addColumns = newWidth - this.originalBoardWidth;
        const leftPadding = Math.floor(addColumns / 2);
        const rightPadding = addColumns - leftPadding;
        
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            this.board[y] = [
                ...Array(leftPadding).fill(0),
                ...this.board[y],
                ...Array(rightPadding).fill(0)
            ];
        }
        
        console.log('📏 Wide Mode activated! Board width:', newWidth);
    }
    
    /**
     * ✅ deactivateWideMode() - Tắt wide mode
     * 
     * Thu hẹp board về 10 cột
     */
    private deactivateWideMode(): void {
        if (!this.isWideModeActive) return;
        
        this.isWideModeActive = false;
        
        // Thu hẹp board
        const addColumns = this.currentBoardWidth - this.originalBoardWidth;
        const leftCut = Math.floor(addColumns / 2);
        const rightBound = leftCut + this.originalBoardWidth;
        
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            this.board[y] = this.board[y].slice(leftCut, rightBound);
        }
        
        this.currentBoardWidth = this.originalBoardWidth;
        console.log('📏 Wide Mode deactivated! Board width:', this.originalBoardWidth);
    }
    
    /**
     * ✅ isWideMode() - Kiểm tra wide mode có đang hoạt động không
     */
    isWideMode(): boolean {
        return this.isWideModeActive;
    }
    
    /**
     * ✅ getCurrentBoardWidth() - Lấy chiều rộng board hiện tại
     */
    getCurrentBoardWidth(): number {
        return this.currentBoardWidth;
    }
    
    // ==========================================
    // 🎨 RENDERING
    // ==========================================
    
    /**
     * ✅ render() - Vẽ các hiệu ứng visual của power-ups
     * 
     * Gọi hàm này trong render() của Game scene
     */
    render(): void {
        this.graphics.clear();
        this.teleportHintGraphics.clear();
        
        // Vẽ hint cho teleport mode
        if (this.isTeleportActive) {
            this.renderTeleportHints();
        }
    }
    
    /**
     * 🎨 renderTeleportHints() - Vẽ gợi ý cho teleport mode
     */
    private renderTeleportHints(): void {
        this.teleportHintGraphics.lineStyle(2, 0x00FFFF, 0.5);
        
        // Vẽ grid hints
        for (let x = 0; x <= this.currentBoardWidth; x++) {
            const screenX = this.boardX + x * BLOCK_SIZE;
            this.teleportHintGraphics.lineBetween(
                screenX, this.boardY,
                screenX, this.boardY + BOARD_HEIGHT * BLOCK_SIZE
            );
        }
        
        for (let y = 0; y <= BOARD_HEIGHT; y++) {
            const screenY = this.boardY + y * BLOCK_SIZE;
            this.teleportHintGraphics.lineBetween(
                this.boardX, screenY,
                this.boardX + this.currentBoardWidth * BLOCK_SIZE, screenY
            );
        }
    }
    
    /**
     * ✅ getActivePowerUps() - Lấy danh sách power-ups đang active
     * 
     * @returns Array of PowerUpState
     */
    getActivePowerUps(): PowerUpState[] {
        return Array.from(this.activePowerUps.values());
    }
    
    /**
     * ✅ reset() - Reset tất cả power-ups
     * 
     * Gọi khi game over hoặc restart
     */
    reset(): void {
        for (const type of this.activePowerUps.keys()) {
            this.deactivatePowerUp(type);
        }
        this.activePowerUps.clear();
        this.graphics.clear();
        this.teleportHintGraphics.clear();
    }
}
