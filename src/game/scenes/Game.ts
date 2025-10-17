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
import { 
    DIFFICULTY_LEVELS, 
    calculateDropDelay,
    calculateScore,
    getDifficultyConfig,
    DEFAULT_DIFFICULTY
} from '../constants/DifficultyConstants';

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
//          (CSS classes: .color-1 đến .color-7, dòng 94-100)

// 🧩 Hình dạng các mảnh Tetris (Shapes)
// ======================================================
// 7 loại mảnh trong Tetris, mỗi loại có hình dạng riêng
// Dùng mảng 2 chiều để biểu diễn: 1 = có ô, 0 = trống

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

// ⚡ Cấu trúc dữ liệu của Energy Block (Khối năng lượng)
// ======================================================
/**
 * ✅ EnergyBlock - Khối năng lượng nguy hiểm!
 * 
 * Khối này xuất hiện ở độ khó Hard và Impossible
 * Nếu chạm vào hoặc để rơi xuống đáy = GAME OVER!
 * 
 * Ở Impossible mode:
 * - Chuột đến gần → Khối NỔ!
 * - Nổ xong → Chuột bị ĐÓNG BĂNG 3 giây!
 */
interface EnergyBlock {
    x: number;              // Vị trí cột (0-9)
    y: number;              // Vị trí hàng (0-19)
    color: number;          // Màu sắc (hex)
    dropSpeed: number;      // Tốc độ rơi (ms/ô)
    lastDropTime: number;   // Lần rơi cuối (timestamp)
    canExplode: boolean;    // Có thể nổ không?
    explosionDistance?: number;  // Khoảng cách nổ (pixels)
    freezeDuration?: number;     // Thời gian đóng băng (ms)
}

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
    difficulty: DIFFICULTY_LEVELS; // Độ khó đã chọn
    
    // 🎨 Graphics - Công cụ vẽ của Phaser
    boardGraphics: Phaser.GameObjects.Graphics;      // Vẽ board
    pieceGraphics: Phaser.GameObjects.Graphics;      // Vẽ mảnh hiện tại
    nextPieceGraphics: Phaser.GameObjects.Graphics;  // Vẽ mảnh tiếp theo
    energyBlockGraphics: Phaser.GameObjects.Graphics; // Vẽ energy blocks
    
    // 📝 UI Text - Các chữ trên màn hình
    scoreText: Phaser.GameObjects.Text;  // Hiển thị điểm
    levelText: Phaser.GameObjects.Text;  // Hiển thị level
    linesText: Phaser.GameObjects.Text;  // Hiển thị số hàng
    difficultyText: Phaser.GameObjects.Text; // Hiển thị độ khó
    
    // 🔄 Game loop - Vòng lặp game
    dropTimer: Phaser.Time.TimerEvent;   // Bộ đếm thời gian tự động rơi
    dropDelay: number;                   // Thời gian giữa mỗi lần rơi (ms)
    
    // ⌨️ Input - Điều khiển
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;  // Phím mũi tên
    
    // ⚡ Energy Blocks - Khối năng lượng (Hard/Impossible)
    energyBlocks: EnergyBlock[];         // Danh sách energy blocks
    isMouseFrozen: boolean;              // Chuột có bị đóng băng không?
    frozenText: Phaser.GameObjects.Text | null; // Chữ "MOUSE FROZEN"
    boardX: number;                      // Vị trí X của board (để tính khoảng cách)
    boardY: number;                      // Vị trí Y của board
    
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
     * 1. Nhận difficulty từ MainMenu scene
     * 2. Thiết lập camera và màu nền
     * 3. Khởi tạo board trống (mảng 20x10)
     * 4. Đặt điểm/level/lines = 0
     * 5. Tạo các đối tượng Graphics để vẽ
     * 6. Tạo UI (text hiển thị điểm, level, difficulty...)
     * 7. Thiết lập điều khiển (keyboard)
     * 8. Spawn mảnh đầu tiên
     * 9. Bắt đầu game loop với tốc độ theo difficulty
     * 
     * Try it: Chạy game và xem create() được gọi khi nào!
     */
    create(data?: any) {
        // 🎯 Nhận difficulty từ MainMenu (hoặc dùng mặc định)
        this.difficulty = (data && data.difficulty) || DEFAULT_DIFFICULTY;
        console.log('Game started with difficulty:', this.difficulty);
        
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
        
        // ⚡ Khởi tạo energy blocks system
        this.energyBlocks = [];       // Chưa có energy blocks
        this.isMouseFrozen = false;   // Chuột chưa bị đóng băng
        this.frozenText = null;       // Chưa có text frozen
        this.boardX = 200;            // Vị trí board X
        this.boardY = 50;             // Vị trí board Y
        
        // 🎯 Tính dropDelay theo difficulty và level
        // calculateDropDelay() tự động áp dụng công thức:
        // dropDelay = (1000ms * dropSpeedMultiplier) / level
        this.dropDelay = calculateDropDelay(this.difficulty, this.level);

        // 🎨 Tạo đối tượng Graphics (dùng để vẽ)
        this.boardGraphics = this.add.graphics();
        this.pieceGraphics = this.add.graphics();
        this.nextPieceGraphics = this.add.graphics();
        this.energyBlockGraphics = this.add.graphics(); // Graphics cho energy blocks

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
        
        // 🖱️ Thiết lập mouse tracking cho Impossible mode
        this.initMouseTracking();

        // 📡 Thông báo cho React: Scene sẵn sàng!
        EventBus.emit('current-scene-ready', this);
    }

    /**
     * ✅ createUI() - Tạo giao diện người dùng
     * 
     * Tạo các chữ hiển thị trên màn hình:
     * - Tiêu đề game
     * - Độ khó đã chọn
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
        const scoreY = boardY + 20;

        // 🎯 Hiển thị Độ khó
        const difficultyConfig = getDifficultyConfig(this.difficulty);
        this.add.text(scoreX, scoreY, 'DIFFICULTY', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFD700',
        });
        this.difficultyText = this.add.text(scoreX, scoreY + 25, difficultyConfig.displayName, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: difficultyConfig.color, // Màu theo độ khó
        });

        // Chữ "SCORE"
        this.add.text(scoreX, scoreY + 70, 'SCORE', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });
        // Điểm số (text động, sẽ cập nhật khi xóa hàng)
        this.scoreText = this.add.text(scoreX, scoreY + 100, '0', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#FFFFFF',
        });

        // Chữ "LEVEL"
        this.add.text(scoreX, scoreY + 150, 'LEVEL', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });
        // Level hiện tại (text động)
        this.levelText = this.add.text(scoreX, scoreY + 180, '1', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#FFFFFF',
        });

        // Chữ "LINES"
        this.add.text(scoreX, scoreY + 230, 'LINES', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });
        // Số hàng đã xóa (text động)
        this.linesText = this.add.text(scoreX, scoreY + 260, '0', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#FFFFFF',
        });

        // Chữ "NEXT" (mảnh tiếp theo)
        this.add.text(scoreX, scoreY + 320, 'NEXT', {
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

        // ⚡ Cập nhật energy blocks
        this.updateEnergyBlocks();

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
     * 4. ⚡ Thử spawn energy block (nếu độ khó cho phép)
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
        
        // ⚡ Thử spawn energy block (Hard/Impossible)
        this.trySpawnEnergyBlock();
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
            
            // 🎯 Tính điểm theo difficulty
            // Base points: [0, 10, 30, 50, 80] cho 0-4 hàng
            // Nhân với level và difficulty multiplier
            const basePoints = [0, 10, 30, 50, 80][linesCleared] * this.level;
            const points = calculateScore(basePoints, this.difficulty);
            this.score += points;
            
            // Level up
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                
                // 🎯 Cập nhật dropDelay theo difficulty và level mới
                this.dropDelay = calculateDropDelay(this.difficulty, this.level);
                
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
        this.energyBlockGraphics.clear(); // ⚡ Clear energy blocks graphics

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

        // ⚡ Draw energy blocks
        // Vẽ energy blocks TRƯỚC mảnh hiện tại để mảnh luôn ở trên
        for (const block of this.energyBlocks) {
            const px = boardX + block.x * BLOCK_SIZE;
            const py = boardY + block.y * BLOCK_SIZE;
            
            // 🎨 Vẽ energy block với hiệu ứng đặc biệt
            this.energyBlockGraphics.fillStyle(block.color, 0.8);
            this.energyBlockGraphics.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            
            // ✨ Viền sáng (glow effect)
            this.energyBlockGraphics.lineStyle(2, 0xFFFFFF, 0.6);
            this.energyBlockGraphics.strokeRect(px + 2, py + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
            
            // 💥 Nếu có thể nổ, thêm dấu cảnh báo
            if (block.canExplode) {
                // Vẽ dấu X nhỏ ở giữa
                const centerX = px + BLOCK_SIZE / 2;
                const centerY = py + BLOCK_SIZE / 2;
                const size = 4;
                
                this.energyBlockGraphics.lineStyle(2, 0xFF0000, 1);
                this.energyBlockGraphics.beginPath();
                this.energyBlockGraphics.moveTo(centerX - size, centerY - size);
                this.energyBlockGraphics.lineTo(centerX + size, centerY + size);
                this.energyBlockGraphics.moveTo(centerX + size, centerY - size);
                this.energyBlockGraphics.lineTo(centerX - size, centerY + size);
                this.energyBlockGraphics.strokePath();
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

    // ======================================================
    // ⚡ ENERGY BLOCKS SYSTEM
    // ======================================================
    
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
                console.log('⚡ Energy block spawned at x =', newBlock.x);
            }
        }
    }
    
    /**
     * ✅ updateEnergyBlocks() - Cập nhật tất cả energy blocks
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
    updateEnergyBlocks() {
        const currentTime = Date.now();
        
        // Duyệt ngược để có thể xóa an toàn
        for (let i = this.energyBlocks.length - 1; i >= 0; i--) {
            const block = this.energyBlocks[i];
            
            // ⏰ Kiểm tra đã đến lúc rơi chưa
            if (currentTime - block.lastDropTime >= block.dropSpeed) {
                block.y++; // Rơi xuống 1 ô
                block.lastDropTime = currentTime;
                
                // ❌ Chạm đáy → Game Over!
                if (block.y >= BOARD_HEIGHT - 1) {
                    console.log('💥 Energy block hit bottom! Game Over!');
                    this.energyBlocks.splice(i, 1);
                    this.endGame();
                    return;
                }
                
                // ❌ Va chạm với mảnh đã khóa → Game Over!
                if (this.board[block.y] && this.board[block.y][block.x] !== 0) {
                    console.log('💥 Energy block hit locked piece! Game Over!');
                    this.energyBlocks.splice(i, 1);
                    this.endGame();
                    return;
                }
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
    initMouseTracking() {
        const config = getDifficultyConfig(this.difficulty);
        
        // ❌ Không phải Impossible hoặc không có energy blocks
        if (this.difficulty !== DIFFICULTY_LEVELS.IMPOSSIBLE || 
            !config.hasEnergyBlocks || 
            !config.energyBlockConfig?.canExplode) {
            return;
        }
        
        // 🖱️ Lắng nghe sự kiện di chuyển chuột
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isMouseFrozen || this.gameOver) return;
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
    checkMouseProximity(mouseX: number, mouseY: number) {
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
                console.log('💥 Energy block exploded! Distance:', distance);
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
    explodeEnergyBlock(index: number) {
        const block = this.energyBlocks[index];
        if (!block) return;
        
        // 💥 Tạo hiệu ứng nổ (vẽ vòng tròn mở rộng)
        const explosionX = this.boardX + block.x * BLOCK_SIZE + BLOCK_SIZE / 2;
        const explosionY = this.boardY + block.y * BLOCK_SIZE + BLOCK_SIZE / 2;
        
        // Vẽ hiệu ứng nổ với graphics
        const explosionGraphics = this.add.graphics();
        
        // 🎨 Animation: Vòng tròn mở rộng dần
        const animTarget = { radius: 5 };
        this.tweens.add({
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
        // this.sound.play('explosion');
        
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
    freezeMouse(duration: number) {
        if (this.isMouseFrozen) return; // Đã bị đóng băng rồi
        
        this.isMouseFrozen = true;
        
        // 📝 Hiển thị text "MOUSE FROZEN"
        this.frozenText = this.add.text(512, 300, '🧊 MOUSE FROZEN! 🧊', {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#00FFFF',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);
        
        // ✨ Hiệu ứng nhấp nháy
        this.tweens.add({
            targets: this.frozenText,
            alpha: 0.3,
            duration: 300,
            yoyo: true,
            repeat: Math.floor(duration / 600) // Nhấp nháy cho đến hết thời gian
        });
        
        // ⏰ Bỏ đóng băng sau duration
        this.time.delayedCall(duration, () => {
            this.isMouseFrozen = false;
            if (this.frozenText) {
                this.frozenText.destroy();
                this.frozenText = null;
            }
            console.log('✅ Mouse unfrozen!');
        });
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}
