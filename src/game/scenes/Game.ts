import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

// Tetris constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    0x000000, // Empty
    0xFF6B9D, // T - Pink
    0x00D9FF, // I - Cyan
    0x00FF88, // J - Green
    0xFF9500, // L - Orange
    0xFFDD00, // O - Yellow
    0xFF3E3E, // S - Red
    0x9D6BFF, // Z - Purple
];

const SHAPES = [
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]], // T
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]], // J
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]], // L
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]], // S
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]], // Z
];

interface Piece {
    shape: number[][];
    color: number;
    x: number;
    y: number;
}

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    board: number[][];
    currentPiece: Piece | null;
    nextPiece: Piece | null;
    score: number;
    lines: number;
    level: number;
    gameOver: boolean;
    
    // Graphics
    boardGraphics: Phaser.GameObjects.Graphics;
    pieceGraphics: Phaser.GameObjects.Graphics;
    nextPieceGraphics: Phaser.GameObjects.Graphics;
    
    // UI Text
    scoreText: Phaser.GameObjects.Text;
    levelText: Phaser.GameObjects.Text;
    linesText: Phaser.GameObjects.Text;
    
    // Game loop
    dropTimer: Phaser.Time.TimerEvent;
    dropDelay: number;
    
    // Input
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    
    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x0d0d1a);

        // Initialize game state
        this.board = Array.from({ length: BOARD_HEIGHT }, () => 
            Array(BOARD_WIDTH).fill(0)
        );
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.dropDelay = 1000;

        // Create graphics objects
        this.boardGraphics = this.add.graphics();
        this.pieceGraphics = this.add.graphics();
        this.nextPieceGraphics = this.add.graphics();

        // Create UI
        this.createUI();

        // Setup input
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.input.keyboard!.on('keydown-SPACE', () => this.hardDrop());
        this.input.keyboard!.on('keydown-UP', () => this.rotatePiece());
        this.input.keyboard!.on('keydown-X', () => this.rotatePiece());

        // Start game
        this.spawnPiece();
        this.startGameLoop();

        EventBus.emit('current-scene-ready', this);
    }

    createUI() {
        const boardX = 200;
        const boardY = 50;

        // Title
        this.add.text(boardX + BOARD_WIDTH * BLOCK_SIZE / 2, 20, 'KENTAKITRIS', {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#FFD700',
        }).setOrigin(0.5);

        // Score panel
        const scoreX = boardX + BOARD_WIDTH * BLOCK_SIZE + 50;
        const scoreY = boardY + 50;

        this.add.text(scoreX, scoreY, 'SCORE', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });
        this.scoreText = this.add.text(scoreX, scoreY + 30, '0', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#FFFFFF',
        });

        this.add.text(scoreX, scoreY + 80, 'LEVEL', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });
        this.levelText = this.add.text(scoreX, scoreY + 110, '1', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#FFFFFF',
        });

        this.add.text(scoreX, scoreY + 160, 'LINES', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });
        this.linesText = this.add.text(scoreX, scoreY + 190, '0', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#FFFFFF',
        });

        // Next piece panel
        this.add.text(scoreX, scoreY + 250, 'NEXT', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
        });

        // Controls help
        const helpY = boardY + BOARD_HEIGHT * BLOCK_SIZE + 30;
        this.add.text(boardX, helpY, '← → : Move  |  ↑ : Rotate  |  SPACE : Drop', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#888888',
        });
    }

    startGameLoop() {
        this.dropTimer = this.time.addEvent({
            delay: this.dropDelay,
            callback: () => this.gameTick(),
            loop: true
        });
    }

    update() {
        if (this.gameOver) return;

        // Handle input
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left!)) {
            this.movePiece(-1, 0);
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right!)) {
            this.movePiece(1, 0);
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
            this.movePiece(0, 1);
        }

        this.render();
    }

    gameTick() {
        if (this.gameOver) return;
        
        if (!this.movePiece(0, 1)) {
            this.lockPiece();
            this.clearLines();
            this.spawnPiece();
            
            if (this.checkCollision(this.currentPiece!)) {
                this.endGame();
            }
        }
    }

    spawnPiece() {
        if (!this.nextPiece) {
            this.nextPiece = this.getRandomPiece();
        }
        
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.getRandomPiece();
    }

    getRandomPiece(): Piece {
        const index = Math.floor(Math.random() * SHAPES.length);
        const shape = SHAPES[index];
        const color = index + 1;
        const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);
        
        return {
            shape: shape.map(row => [...row]),
            color: color,
            x: startX,
            y: 0
        };
    }

    movePiece(dx: number, dy: number): boolean {
        if (!this.currentPiece) return false;
        
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        
        if (this.checkCollision(this.currentPiece)) {
            this.currentPiece.x -= dx;
            this.currentPiece.y -= dy;
            return false;
        }
        
        return true;
    }

    rotatePiece() {
        if (!this.currentPiece) return;
        
        const oldShape = this.currentPiece.shape;
        this.currentPiece.shape = this.rotateMatrix(oldShape);
        
        if (this.checkCollision(this.currentPiece)) {
            this.currentPiece.shape = oldShape;
        }
    }

    rotateMatrix(matrix: number[][]): number[][] {
        const n = matrix.length;
        const rotated = Array.from({ length: n }, () => Array(n).fill(0));
        
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
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

    checkCollision(piece: Piece): boolean {
        for (let r = 0; r < piece.shape.length; r++) {
            for (let c = 0; c < piece.shape[r].length; c++) {
                if (piece.shape[r][c] !== 0) {
                    const newY = piece.y + r;
                    const newX = piece.x + c;
                    
                    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                        return true;
                    }
                    
                    if (newY >= 0 && this.board[newY][newX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
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
