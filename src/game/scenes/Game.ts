// src/game/scenes/Game.ts
// ======================================================
// ✅ Scene chính của game Tetris - Nơi diễn ra gameplay
// 
// Scene này chứa:
// - Logic game Tetris (di chuyển, xoay, xóa hàng)
// - Vẽ board và các mảnh lên màn hình
// - Xử lý input từ bàn phím
// - Tính điểm, level, và game over
// 
// Đây là "trái tim" của game!
// ======================================================

import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Leaderboard } from './Leaderboard';

// 🎮 Hằng số game (Game Constants)
// ======================================================
// Những con số này định nghĩa kích thước và quy tắc của game

// 📏 Kích thước board
const BOARD_WIDTH = 10;  // 10 cột (chuẩn Tetris gốc từ 1984)
const BOARD_HEIGHT = 20; // 20 hàng
const BLOCK_SIZE = 30;   // Mỗi ô vuông = 30x30 pixels

// ❓ Thử nghiệm: Thay BOARD_WIDTH = 15 → Board rộng hơn!
// ❓ Thử nghiệm: Thay BLOCK_SIZE = 40 → Ô to hơn!
// 🎨 Màu sắc cho các mảnh Tetris
// ======================================================
// Mỗi loại mảnh có 1 màu riêng (theo chuẩn Tetris hiện đại)
// ✅ Đã cập nhật để khớp với theme của game JS cũ
const COLORS = [
    0x000000, // 0 = Trống (Empty) - Màu đen
    0xFF0D72, // 1 = T - Màu hồng sáng (Bright Pink)
    0x0DC2FF, // 2 = I - Màu xanh nước biển (Cyan)
    0x0DFF72, // 3 = J - Màu xanh lá chanh (Lime Green)
    0xFF8E0D, // 4 = L - Màu cam (Orange)
    0xFFE100, // 5 = O - Màu vàng (Yellow)
    0xFF1A0D, // 6 = S - Màu đỏ sáng (Bright Red)
    0x5833FF, // 7 = Z - Màu tím xanh (Blue Violet)
];

// 💡 Lưu ý: Màu trong Phaser dùng hệ 16 (hex)
//          Ví dụ: 0xFF0D72 = màu hồng sáng
//          Các màu này khớp với game JS cũ trong src/index.css

// 🧩 Hình dạng các mảnh Tetris (Shapes)
// ======================================================
// 7 loại mảnh trong Tetris, mỗi loại có hình dạng riêng
// Dùng mảng 2 chiều để biểu diễn: 1 = có ô, 0 = trống

const SHAPES = [
    // T - Hình chữ T
    [[0, 1, 0], 
     [1, 1, 1], 
     [0, 0, 0]],
    
    // I - Hình thanh dài
    [[0, 0, 0, 0], 
     [1, 1, 1, 1], 
     [0, 0, 0, 0], 
     [0, 0, 0, 0]],
    
    // J - Hình chữ J
    [[1, 0, 0], 
     [1, 1, 1], 
     [0, 0, 0]],
    
    // L - Hình chữ L
    [[0, 0, 1], 
     [1, 1, 1], 
     [0, 0, 0]],
    
    // O - Hình vuông
    [[1, 1], 
     [1, 1]],
    
    // S - Hình chữ S
    [[0, 1, 1], 
     [1, 1, 0], 
     [0, 0, 0]],
    
    // Z - Hình chữ Z
    [[1, 1, 0], 
     [0, 1, 1], 
     [0, 0, 0]],
];

// ❓ Câu hỏi: Tại sao dùng mảng 2 chiều?
// 💡 Trả lời: Vì mảnh Tetris có hàng và cột, giống bàn cờ!
//            [[1,0], [1,1]] = ô (0,0) có 1, ô (0,1) có 0...

// 🎮 Cấu trúc dữ liệu của 1 mảnh Tetris (Piece)
// ======================================================
interface Piece {
    shape: number[][];  // Hình dạng (mảng 2D: 1=có ô, 0=trống)
    color: number;      // Màu sắc (1-7, tương ứng COLORS)
    x: number;          // Vị trí cột trên board (0 = cột trái)
    y: number;          // Vị trí hàng trên board (0 = hàng trên)
}

// Ví dụ: { shape: [[1,1],[1,1]], color: 5, x: 4, y: 0 }
// → Mảnh O (vuông), màu vàng, ở giữa board, hàng trên cùng

/**
 * ✅ Game Scene - Scene chính chứa gameplay Tetris
 * 
 * Đây là class chính của game, kế thừa từ Phaser.Scene
 * Phaser sẽ tự động gọi các phương thức: create(), update()
 * 
 * 🎮 Scene = Màn hình trong game
 * Mỗi scene là 1 màn hình khác nhau: Menu, Game, GameOver...
 */
export class Game extends Scene {
    // 📹 Camera - Quản lý khung nhìn của game
    camera: Phaser.Cameras.Scene2D.Camera;
    
    // 📊 Dữ liệu game state
    board: number[][];           // Bảng chơi (mảng 2D: 0=trống, 1-7=màu)
    currentPiece: Piece | null;  // Mảnh đang rơi (null = chưa có)
    nextPiece: Piece | null;     // Mảnh tiếp theo
    score: number;               // Điểm số hiện tại
    lines: number;               // Số hàng đã xóa
    level: number;               // Level hiện tại (1, 2, 3...)
    gameOver: boolean;           // Trạng thái game (true = thua)
    
    // 🎨 Graphics - Công cụ vẽ của Phaser
    boardGraphics: Phaser.GameObjects.Graphics;      // Vẽ board
    pieceGraphics: Phaser.GameObjects.Graphics;      // Vẽ mảnh hiện tại
    nextPieceGraphics: Phaser.GameObjects.Graphics;  // Vẽ mảnh tiếp theo
    
    // 📝 UI Text - Các chữ trên màn hình
    scoreText: Phaser.GameObjects.Text;  // Hiển thị điểm
    levelText: Phaser.GameObjects.Text;  // Hiển thị level
    linesText: Phaser.GameObjects.Text;  // Hiển thị số hàng
    
    // 🔄 Game loop - Vòng lặp game
    dropTimer: Phaser.Time.TimerEvent;   // Bộ đếm thời gian tự động rơi
    dropDelay: number;                   // Thời gian giữa mỗi lần rơi (ms)
    
    // ⌨️ Input - Điều khiển
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;  // Phím mũi tên
    
    /**
     * ✅ Constructor - Khởi tạo scene
     * 
     * Phương thức này chạy khi tạo scene lần đầu
     * Truyền tên 'Game' cho Phaser để nhận diện scene
     */
    constructor() {
        super('Game');
    }

    /**
     * ✅ create() - Khởi tạo game
     * 
     * Phương thức này được Phaser tự động gọi khi scene bắt đầu
     * Nhiệm vụ: Chuẩn bị mọi thứ trước khi chơi
     * 
     * Các bước:
     * 1. Thiết lập camera và màu nền
     * 2. Khởi tạo board trống (mảng 20x10)
     * 3. Đặt điểm/level/lines = 0
     * 4. Tạo các đối tượng Graphics để vẽ
     * 5. Tạo UI (text hiển thị điểm, level...)
     * 6. Thiết lập điều khiển (keyboard)
     * 7. Spawn mảnh đầu tiên
     * 8. Bắt đầu game loop
     * 
     * Try it: Chạy game và xem create() được gọi khi nào!
     */
    create() {
        // 📹 Thiết lập camera
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x0d0d1a); // Màu nền tối (xanh đen)

        // 📊 Khởi tạo board trống
        // Array.from() tạo mảng 20 hàng, mỗi hàng có 10 số 0
        // → Board ban đầu toàn ô trống
        this.board = Array.from({ length: BOARD_HEIGHT }, () => 
            Array(BOARD_WIDTH).fill(0)
        );
        
        // 📈 Khởi tạo game state
        this.score = 0;        // Bắt đầu 0 điểm
        this.lines = 0;        // Chưa xóa hàng nào
        this.level = 1;        // Level 1
        this.gameOver = false; // Chưa thua
        this.dropDelay = 1000; // Mảnh rơi 1 lần/giây (1000ms)

        // 🎨 Tạo đối tượng Graphics (dùng để vẽ)
        this.boardGraphics = this.add.graphics();
        this.pieceGraphics = this.add.graphics();
        this.nextPieceGraphics = this.add.graphics();

        // 📝 Tạo UI (chữ và bảng điểm)
        this.createUI();

        // ⌨️ Thiết lập điều khiển keyboard
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.input.keyboard!.on('keydown-SPACE', () => this.hardDrop());  // Phím Space = thả nhanh
        this.input.keyboard!.on('keydown-UP', () => this.rotatePiece()); // Phím ↑ = xoay
        this.input.keyboard!.on('keydown-X', () => this.rotatePiece());  // Phím X = xoay

        // 🎮 Bắt đầu game
        this.spawnPiece();      // Tạo mảnh đầu tiên
        this.startGameLoop();   // Bắt đầu vòng lặp tự động rơi

        // 📡 Thông báo cho React: Scene sẵn sàng!
        EventBus.emit('current-scene-ready', this);
    }

    /**
     * ✅ createUI() - Tạo giao diện người dùng
     * 
     * Tạo các chữ hiển thị trên màn hình:
     * - Tiêu đề game
     * - Điểm số, Level, Lines
     * - Preview mảnh tiếp theo
     * - Hướng dẫn phím
     * 
     * 📍 Vị trí: Bên phải board
     */
    createUI() {
        const boardX = 200;  // Board ở x = 200
        const boardY = 50;   // Board ở y = 50

        // 🏆 Tiêu đề game
        this.add.text(boardX + BOARD_WIDTH * BLOCK_SIZE / 2, 20, 'KENTAKITRIS', {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#FFD700',  // Màu vàng
        }).setOrigin(0.5);  // Căn giữa

        // 📊 Bảng điểm bên phải
        const scoreX = boardX + BOARD_WIDTH * BLOCK_SIZE + 50;
        const scoreY = boardY + 50;

        // Chữ "SCORE"
        this.add.text(scoreX, scoreY, 'SCORE', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });
        // Điểm số (text động, sẽ cập nhật khi xóa hàng)
        this.scoreText = this.add.text(scoreX, scoreY + 30, '0', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#FFFFFF',
        });

        // Chữ "LEVEL"
        this.add.text(scoreX, scoreY + 80, 'LEVEL', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });
        // Level hiện tại (text động)
        this.levelText = this.add.text(scoreX, scoreY + 110, '1', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#FFFFFF',
        });

        // Chữ "LINES"
        this.add.text(scoreX, scoreY + 160, 'LINES', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });
        // Số hàng đã xóa (text động)
        this.linesText = this.add.text(scoreX, scoreY + 190, '0', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#FFFFFF',
        });

        // Chữ "NEXT" (mảnh tiếp theo)
        this.add.text(scoreX, scoreY + 250, 'NEXT', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });

        // 📖 Hướng dẫn phím (ở dưới board)
        const helpY = boardY + BOARD_HEIGHT * BLOCK_SIZE + 30;
        this.add.text(boardX, helpY, '← → : Move  |  ↑ : Rotate  |  SPACE : Drop', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#888888',
        });
    }

    /**
     * ✅ startGameLoop() - Bắt đầu vòng lặp game
     * 
     * Tạo bộ đếm thời gian (Timer) để mảnh tự động rơi
     * Timer này gọi gameTick() mỗi dropDelay milliseconds
     * 
     * Ví dụ: dropDelay = 1000 → gameTick() chạy mỗi 1 giây
     * 
     * 🔄 Loop = Lặp lại mãi mãi cho đến khi game over
     */
    startGameLoop() {
        this.dropTimer = this.time.addEvent({
            delay: this.dropDelay,           // Thời gian chờ (ms)
            callback: () => this.gameTick(), // Hàm gọi
            loop: true                       // Lặp mãi
        });
    }

    /**
     * ✅ update() - Vòng lặp chính của Phaser
     * 
     * Phaser tự động gọi hàm này 60 lần/giây (60 FPS)
     * Dùng để xử lý input (phím bấm) và cập nhật hiển thị
     * 
     * 🔄 60 FPS = 60 Frames Per Second = 60 khung hình/giây
     *    → Tạo chuyển động mượt mà!
     * 
     * ❓ Câu hỏi: Tại sao 60 lần/giây?
     * 💡 Trả lời: Vì mắt người nhìn thấy mượt ở 60 FPS!
     */
    update() {
        if (this.gameOver) return; // Nếu thua rồi → không làm gì

        // ⌨️ Xử lý input từ bàn phím
        // JustDown = Kiểm tra phím vừa được bấm (không giữ)
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left!)) {
            this.movePiece(-1, 0); // ← = Di chuyển trái
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right!)) {
            this.movePiece(1, 0);  // → = Di chuyển phải
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
            this.movePiece(0, 1);  // ↓ = Di chuyển xuống (soft drop)
        }

        // 🎨 Vẽ lại màn hình
        this.render();
    }

    /**
     * ✅ gameTick() - Nhịp đập của game (mảnh tự động rơi)
     * 
     * Hàm này được gọi mỗi dropDelay milliseconds (VD: 1 giây)
     * Nhiệm vụ: Làm mảnh rơi xuống 1 ô
     * 
     * Các bước:
     * 1. Thử di chuyển mảnh xuống 1 ô (0, 1)
     * 2. Nếu không di chuyển được → mảnh chạm đáy!
     * 3. Khóa mảnh vào board
     * 4. Xóa các hàng đầy (nếu có)
     * 5. Spawn mảnh mới
     * 6. Kiểm tra game over (nếu mảnh mới bị chặn)
     * 
     * ❓ Câu hỏi: Tại sao gọi là "Tick"?
     * 💡 Trả lời: Tick = Tiếng đồng hồ "tích tắc"
     *            Giống đồng hồ, game "tích" mỗi giây!
     */
    gameTick() {
        if (this.gameOver) return; // Đã thua → không làm gì
        
        // Thử di chuyển xuống
        if (!this.movePiece(0, 1)) {
            // Không di chuyển được → chạm đáy!
            this.lockPiece();    // Khóa mảnh vào board
            this.clearLines();   // Xóa hàng đầy
            this.spawnPiece();   // Tạo mảnh mới
            
            // Kiểm tra: Mảnh mới có bị chặn không?
            if (this.checkCollision(this.currentPiece!)) {
                this.endGame(); // Bị chặn → Game Over!
            }
        }
    }

    /**
     * ✅ spawnPiece() - Tạo mảnh mới
     * 
     * Lấy mảnh từ nextPiece làm mảnh hiện tại
     * Tạo nextPiece mới (random)
     * 
     * Cách hoạt động:
     * 1. Nếu chưa có nextPiece → tạo ngay (lần đầu)
     * 2. Chuyển nextPiece → currentPiece
     * 3. Tạo nextPiece mới
     * 
     * 🎲 Random = Ngẫu nhiên (không biết trước sẽ ra mảnh gì)
     */
    spawnPiece() {
        // Lần đầu tiên: nextPiece chưa có
        if (!this.nextPiece) {
            this.nextPiece = this.getRandomPiece();
        }
        
        // Chuyển nextPiece thành currentPiece
        this.currentPiece = this.nextPiece;
        
        // Tạo nextPiece mới
        this.nextPiece = this.getRandomPiece();
    }

    /**
     * ✅ getRandomPiece() - Tạo mảnh ngẫu nhiên
     * 
     * Chọn 1 trong 7 loại mảnh Tetris một cách ngẫu nhiên
     * 
     * Các bước:
     * 1. Random số từ 0-6 (7 loại mảnh)
     * 2. Lấy shape từ SHAPES[index]
     * 3. Tính vị trí spawn (giữa board, trên cùng)
     * 4. Trả về Piece object
     * 
     * Ví dụ: 
     * - Random được 4 → Mảnh O (vuông)
     * - Random được 1 → Mảnh I (thanh dài)
     * 
     * Try it: console.log(Math.floor(Math.random() * 7))
     *         → In ra số 0-6 ngẫu nhiên!
     * 
     * ❓ Câu hỏi: Tại sao startX = BOARD_WIDTH / 2?
     * 💡 Trả lời: Để mảnh spawn ở giữa board (không lệch trái/phải)
     */
    getRandomPiece(): Piece {
        // 🎲 Random số từ 0-6
        const index = Math.floor(Math.random() * SHAPES.length);
        
        // Lấy shape và màu tương ứng
        const shape = SHAPES[index];
        const color = index + 1; // Màu 1-7 (0 = trống)
        
        // 📍 Tính vị trí spawn (giữa board, trên cùng)
        const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);
        
        return {
            shape: shape.map(row => [...row]), // Copy shape (tránh sửa SHAPES gốc)
            color: color,
            x: startX, // Giữa board
            y: 0       // Trên cùng
        };
    }

    /**
     * ✅ movePiece() - Di chuyển mảnh theo hướng
     * 
     * Thử di chuyển mảnh sang trái/phải/xuống
     * Nếu va chạm → quay lại vị trí cũ
     * 
     * Tham số:
     * - dx: độ dịch chuyển cột (trái = -1, phải = 1, không = 0)
     * - dy: độ dịch chuyển hàng (xuống = 1, không = 0)
     * 
     * Ví dụ:
     * - movePiece(1, 0) → Di chuyển sang phải 1 ô
     * - movePiece(-1, 0) → Di chuyển sang trái 1 ô
     * - movePiece(0, 1) → Di chuyển xuống 1 ô
     * 
     * Try it: Nhấn phím ← → ↓ trong game!
     * 
     * ❓ Câu hỏi: Tại sao cần kiểm tra va chạm?
     * 💡 Trả lời: Để mảnh không đi xuyên tường hoặc mảnh khác!
     *            Giống đời thực, vật thể không xuyên nhau.
     */
    movePiece(dx: number, dy: number): boolean {
        if (!this.currentPiece) return false; // Chưa có mảnh
        
        // 📍 Di chuyển đến vị trí mới
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        
        // 🔍 Kiểm tra va chạm
        if (this.checkCollision(this.currentPiece)) {
            // ❌ Va chạm! Quay lại vị trí cũ
            this.currentPiece.x -= dx;
            this.currentPiece.y -= dy;
            return false; // Thất bại
        }
        
        return true; // ✅ Thành công!
    }

    /**
     * ✅ rotatePiece() - Xoay mảnh 90 độ
     * 
     * Xoay mảnh theo chiều kim đồng hồ (clockwise)
     * Nếu va chạm sau khi xoay → giữ nguyên hướng cũ
     * 
     * Cách hoạt động:
     * 1. Lưu shape cũ
     * 2. Xoay shape 90 độ (dùng rotateMatrix)
     * 3. Kiểm tra va chạm
     * 4. Nếu va chạm → khôi phục shape cũ
     * 
     * Try it: Nhấn phím ↑ hoặc X trong game!
     * 
     * ❓ Câu hỏi: Tại sao cần lưu oldShape?
     * 💡 Trả lời: Để khôi phục nếu xoay bị chặn!
     *            Giống như Ctrl+Z (Undo)
     */
    rotatePiece() {
        if (!this.currentPiece) return; // Chưa có mảnh
        
        // 💾 Lưu shape cũ (để khôi phục nếu cần)
        const oldShape = this.currentPiece.shape;
        
        // 🔄 Xoay 90 độ
        this.currentPiece.shape = this.rotateMatrix(oldShape);
        
        // 🔍 Kiểm tra va chạm
        if (this.checkCollision(this.currentPiece)) {
            // ❌ Xoay bị chặn → Khôi phục shape cũ
            this.currentPiece.shape = oldShape;
        }
    }

    /**
     * ✅ rotateMatrix() - Xoay ma trận 90 độ
     * 
     * Xoay mảng 2D theo chiều kim đồng hồ
     * Thuật toán: Chuyển hàng thành cột (từ dưới lên trên)
     * 
     * Ví dụ:
     * Input:  [[1,0],      Output: [[0,1],
     *          [1,1]]               [1,1]]
     * 
     * Công thức: rotated[c][n-1-r] = matrix[r][c]
     * - r = hàng cũ, c = cột cũ
     * - n = kích thước ma trận
     * 
     * ❓ Câu hỏi: Tại sao công thức phức tạp thế?
     * 💡 Trả lời: Vì phải "lật" ma trận theo đường chéo!
     *            Giống như xoay tờ giấy 90 độ.
     */
    rotateMatrix(matrix: number[][]): number[][] {
        const n = matrix.length; // Kích thước ma trận (3x3, 4x4...)
        
        // Tạo ma trận mới (toàn số 0)
        const rotated = Array.from({ length: n }, () => Array(n).fill(0));
        
        // 🔄 Xoay từng ô
        for (let r = 0; r < n; r++) {        // r = hàng
            for (let c = 0; c < n; c++) {    // c = cột
                rotated[c][n - 1 - r] = matrix[r][c];
            }
        }
        
        return rotated;
    }

    hardDrop() {
        if (!this.currentPiece) return;
        
        while (this.movePiece(0, 1)) {
            // Keep moving down
        }
        
        this.lockPiece();
        this.clearLines();
        this.spawnPiece();
        
        if (this.checkCollision(this.currentPiece!)) {
            this.endGame();
        }
    }

    /**
     * ✅ checkCollision() - Kiểm tra va chạm
     * 
     * Kiểm tra xem mảnh có va chạm với tường hoặc mảnh khác không
     * 
     * Các trường hợp va chạm:
     * 1. Vượt ra ngoài trái/phải board (x < 0 hoặc x >= BOARD_WIDTH)
     * 2. Vượt ra ngoài dưới board (y >= BOARD_HEIGHT)
     * 3. Chạm mảnh đã khóa (board[y][x] !== 0)
     * 
     * ❓ Câu hỏi: Tại sao không kiểm tra y < 0?
     * 💡 Trả lời: Vì mảnh có thể spawn ở trên board (y âm)!
     *            Chỉ phần dưới mới nhìn thấy.
     */
    checkCollision(piece: Piece): boolean {
        // Duyệt từng ô của mảnh
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c] !== 0) { // Chỉ kiểm tra ô có mảnh
                    const newY = piece.y + r;
                    const newX = piece.x + c;
                    
                    // ❌ Kiểm tra vượt trái/phải/dưới
                    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                        return true; // Va chạm!
                    }
                    
                    // ❌ Kiểm tra chạm mảnh đã khóa
                    if (newY >= 0 && this.board[newY][newX] !== 0) {
                        return true; // Va chạm!
                    }
                }
            }
        }
        return false; // ✅ Không va chạm
    }

    lockPiece() {
        if (!this.currentPiece) return;
        
        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (this.currentPiece.shape[r][c] !== 0) {
                    const y = this.currentPiece.y + r;
                    const x = this.currentPiece.x + c;
                    if (y >= 0 && y < BOARD_HEIGHT) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(BOARD_WIDTH).fill(0));
                linesCleared++;
                y++; // Check same row again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            const points = [0, 10, 30, 50, 80][linesCleared] * this.level;
            this.score += points;
            
            // Level up
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.dropDelay = Math.max(100, 1000 - (this.level - 1) * 100);
                // Restart the timer with new delay
                this.dropTimer.remove();
                this.startGameLoop();
            }
            
            this.updateUI();
        }
    }

    updateUI() {
        this.scoreText.setText(this.score.toString());
        this.levelText.setText(this.level.toString());
        this.linesText.setText(this.lines.toString());
    }

    render() {
        const boardX = 200;
        const boardY = 50;

        // Clear graphics
        this.boardGraphics.clear();
        this.pieceGraphics.clear();
        this.nextPieceGraphics.clear();

        // Draw board border
        this.boardGraphics.lineStyle(4, 0x888888);
        this.boardGraphics.strokeRect(
            boardX - 2,
            boardY - 2,
            BOARD_WIDTH * BLOCK_SIZE + 4,
            BOARD_HEIGHT * BLOCK_SIZE + 4
        );

        // Draw board grid
        this.boardGraphics.lineStyle(1, 0x333333);
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                const px = boardX + x * BLOCK_SIZE;
                const py = boardY + y * BLOCK_SIZE;
                this.boardGraphics.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
                
                if (this.board[y][x] !== 0) {
                    this.boardGraphics.fillStyle(COLORS[this.board[y][x]], 1);
                    this.boardGraphics.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
                }
            }
        }

        // Draw current piece
        if (this.currentPiece) {
            for (let r = 0; r < this.currentPiece.shape.length; r++) {
                for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                    if (this.currentPiece.shape[r][c] !== 0) {
                        const px = boardX + (this.currentPiece.x + c) * BLOCK_SIZE;
                        const py = boardY + (this.currentPiece.y + r) * BLOCK_SIZE;
                        
                        this.pieceGraphics.fillStyle(COLORS[this.currentPiece.color], 1);
                        this.pieceGraphics.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
                        
                        this.pieceGraphics.lineStyle(2, 0xFFFFFF, 0.3);
                        this.pieceGraphics.strokeRect(px + 2, py + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
                    }
                }
            }
        }

        // Draw next piece
        if (this.nextPiece) {
            const nextX = boardX + BOARD_WIDTH * BLOCK_SIZE + 50;
            const nextY = 400;
            const nextSize = 20;
            
            for (let r = 0; r < this.nextPiece.shape.length; r++) {
                for (let c = 0; c < this.nextPiece.shape[r].length; c++) {
                    if (this.nextPiece.shape[r][c] !== 0) {
                        const px = nextX + c * nextSize;
                        const py = nextY + r * nextSize;
                        
                        this.nextPieceGraphics.fillStyle(COLORS[this.nextPiece.color], 1);
                        this.nextPieceGraphics.fillRect(px, py, nextSize - 2, nextSize - 2);
                    }
                }
            }
        }
    }

    endGame() {
        this.gameOver = true;
        this.dropTimer.remove();
        
        // 💾 Lưu điểm vào Firebase leaderboard
        // Gọi hàm static saveScore() của Leaderboard scene
        // Firebase tự động lưu điểm lên cloud và chia sẻ với mọi người!
        
        // 👤 Lấy tên người chơi từ localStorage (nếu có)
        const playerName = localStorage.getItem('playerName') || 'Anonymous';
        
        Leaderboard.saveScore(this.score, playerName);
        
        this.add.text(512, 384, 'GAME OVER', {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: '#FF0000',
            stroke: '#000000',
            strokeThickness: 8,
        }).setOrigin(0.5);
        
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOver', { score: this.score });
        });
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
