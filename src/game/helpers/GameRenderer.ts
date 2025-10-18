// src/game/helpers/GameRenderer.ts
// ======================================================
// ✅ Game Renderer - Quản lý việc vẽ game lên màn hình
// 
// Helper này chịu trách nhiệm:
// - Vẽ board (khung và lưới)
// - Vẽ mảnh hiện tại (current piece)
// - Vẽ mảnh tiếp theo (next piece preview)
// ======================================================

import { Scene } from 'phaser';
import { Piece, BOARD_WIDTH, BOARD_HEIGHT, BLOCK_SIZE, COLORS } from '../constants/GameConstants';

/**
 * ✅ GameRenderer - Class quản lý việc render game
 * 
 * Cách hoạt động:
 * 1. Nhận graphics objects từ scene
 * 2. Cung cấp các phương thức vẽ riêng biệt
 * 3. Clear và vẽ lại mỗi frame
 * 
 * ❓ Câu hỏi: Tại sao tách rendering ra?
 * 💡 Trả lời: Để code Game.ts gọn hơn và dễ maintain!
 *            Tất cả logic vẽ tập trung ở 1 chỗ.
 */
export class GameRenderer {
    private scene: Scene;
    private boardGraphics: Phaser.GameObjects.Graphics;
    private pieceGraphics: Phaser.GameObjects.Graphics;
    private nextPieceGraphics: Phaser.GameObjects.Graphics;
    private boardX: number;
    private boardY: number;
    
    /**
     * ✅ Constructor - Khởi tạo GameRenderer
     * 
     * @param scene - Phaser Scene
     * @param boardX - Vị trí X của board
     * @param boardY - Vị trí Y của board
     */
    constructor(scene: Scene, boardX: number, boardY: number) {
        this.scene = scene;
        this.boardX = boardX;
        this.boardY = boardY;
        
        // Tạo graphics objects
        this.boardGraphics = scene.add.graphics();
        this.pieceGraphics = scene.add.graphics();
        this.nextPieceGraphics = scene.add.graphics();
    }
    
    /**
     * ✅ render() - Vẽ toàn bộ game
     * 
     * Mục tiêu: Vẽ board, current piece, và next piece
     * 
     * Cách hoạt động:
     * 1. Clear tất cả graphics cũ
     * 2. Vẽ board (viền + lưới + mảnh đã khóa)
     * 3. Vẽ mảnh hiện tại
     * 4. Vẽ mảnh tiếp theo
     * 
     * Try it: Hàm này được gọi 60 lần/giây trong update()
     */
    render(board: number[][], currentPiece: Piece | null, nextPiece: Piece | null) {
        // Clear graphics cũ
        this.clear();
        
        // Vẽ theo thứ tự: Board → Current piece → Next piece
        this.renderBoard(board);
        if (currentPiece) {
            this.renderCurrentPiece(currentPiece);
        }
        if (nextPiece) {
            this.renderNextPiece(nextPiece);
        }
    }
    
    /**
     * ✅ clear() - Xóa tất cả graphics
     * 
     * Gọi trước khi vẽ frame mới
     */
    clear() {
        this.boardGraphics.clear();
        this.pieceGraphics.clear();
        this.nextPieceGraphics.clear();
    }
    
    /**
     * ✅ renderBoard() - Vẽ board game
     * 
     * Mục tiêu: Vẽ khung board, lưới, và các mảnh đã khóa
     * 
     * Cách hoạt động:
     * 1. Vẽ viền board (border)
     * 2. Vẽ lưới (grid)
     * 3. Vẽ các ô đã có mảnh (board[y][x] !== 0)
     * 
     * ❓ Câu hỏi: Tại sao vẽ viền trước?
     * 💡 Trả lời: Để viền ở dưới cùng, không che lưới và mảnh!
     */
    renderBoard(board: number[][]) {
        // 🔲 Vẽ viền board (border)
        this.boardGraphics.lineStyle(4, 0x888888);
        this.boardGraphics.strokeRect(
            this.boardX - 2,
            this.boardY - 2,
            BOARD_WIDTH * BLOCK_SIZE + 4,
            BOARD_HEIGHT * BLOCK_SIZE + 4
        );
        
        // 📏 Vẽ lưới (grid)
        this.boardGraphics.lineStyle(1, 0x333333);
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const px = this.boardX + x * BLOCK_SIZE;
                const py = this.boardY + y * BLOCK_SIZE;
                this.boardGraphics.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
                
                // 🎨 Vẽ ô đã có mảnh
                if (board[y][x] !== 0) {
                    this.boardGraphics.fillStyle(COLORS[board[y][x]], 1);
                    this.boardGraphics.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
                }
            }
        }
    }
    
    /**
     * ✅ renderCurrentPiece() - Vẽ mảnh đang rơi
     * 
     * Mục tiêu: Vẽ mảnh hiện tại với màu sắc và hiệu ứng
     * 
     * Cách hoạt động:
     * 1. Duyệt qua shape của piece
     * 2. Tính vị trí pixel (x, y)
     * 3. Vẽ ô màu + viền sáng (highlight)
     * 
     * ❓ Câu hỏi: Tại sao có viền sáng?
     * 💡 Trả lời: Để mảnh nổi bật hơn, dễ nhìn!
     */
    renderCurrentPiece(piece: Piece) {
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c] !== 0) {
                    const px = this.boardX + (piece.x + c) * BLOCK_SIZE;
                    const py = this.boardY + (piece.y + r) * BLOCK_SIZE;
                    
                    // 🎨 Vẽ ô màu
                    this.pieceGraphics.fillStyle(COLORS[piece.color], 1);
                    this.pieceGraphics.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
                    
                    // ✨ Vẽ viền sáng (highlight)
                    this.pieceGraphics.lineStyle(2, 0xFFFFFF, 0.3);
                    this.pieceGraphics.strokeRect(px + 2, py + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
                }
            }
        }
    }
    
    /**
     * ✅ renderNextPiece() - Vẽ mảnh tiếp theo (preview)
     * 
     * Mục tiêu: Hiển thị mảnh sẽ xuất hiện sau mảnh hiện tại
     * 
     * Cách hoạt động:
     * 1. Vẽ ở vị trí cố định (bên phải board)
     * 2. Kích thước nhỏ hơn (nextSize = 20px thay vì 30px)
     * 3. Chỉ vẽ màu, không có viền
     * 
     * ❓ Câu hỏi: Tại sao mảnh nhỏ hơn?
     * 💡 Trả lời: Để phân biệt với mảnh đang chơi!
     *            Preview chỉ để xem trước thôi.
     */
    renderNextPiece(piece: Piece) {
        const nextX = this.boardX + BOARD_WIDTH * BLOCK_SIZE + 50;
        const nextY = 400;
        const nextSize = 20; // Nhỏ hơn BLOCK_SIZE
        
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c] !== 0) {
                    const px = nextX + c * nextSize;
                    const py = nextY + r * nextSize;
                    
                    this.nextPieceGraphics.fillStyle(COLORS[piece.color], 1);
                    this.nextPieceGraphics.fillRect(px, py, nextSize - 2, nextSize - 2);
                }
            }
        }
    }
    
    /**
     * ✅ destroy() - Dọn dẹp khi scene kết thúc
     */
    destroy() {
        this.boardGraphics.destroy();
        this.pieceGraphics.destroy();
        this.nextPieceGraphics.destroy();
    }
}
