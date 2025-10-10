import { BOARD_HEIGHT, BOARD_WIDTH, SCORE_PER_LINE, LINES_PER_LEVEL } from './game-constants.js';
import { 
    board, 
    currentPiece, 
    nextPiece,
    score, 
    lines, 
    level,
    setCurrentPiece,
    setNextPiece,
    setScore,
    setLines,
    setLevel
} from './game-state.js';
import { getRandomPiece, checkCollision, lockPiece, rotatePieceShape } from './game-pieces.js';
import { drawBoard, createScoreParticles, flashClearedLines } from './game-board.js';
import { restartDropInterval } from './game-controls.js';

/**
 * Moves the current piece in a given direction.
 * @param {number} dx - Change in X (column).
 * @param {number} dy - Change in Y (row).
 * @returns {boolean} True if movement succeeded, false otherwise.
 */
export function movePiece(dx, dy) {
    if (!currentPiece) return false;
    const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };

    if (!checkCollision(newPiece)) {
        setCurrentPiece(newPiece);
        drawBoard();
        return true;
    }
    return false;
}

/**
 * Hard drops the current piece to the bottom.
 */
export function hardDrop() {
    if (!currentPiece) return;
    let drops = 0;
    while (movePiece(0, 1)) {
        drops++;
    }
    // Lock the piece immediately after hard drop
    if (drops > 0) {
        return true; // Signal that piece should be locked
    }
    return false;
}

/**
 * Rotates the current piece 90 degrees clockwise.
 */
export function rotatePiece() {
    if (!currentPiece) return;
    
    const rotatedPiece = rotatePieceShape(currentPiece);

    // Kick-testing: Try to move the piece slightly if the rotation causes a collision
    const kicks = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [kx, ky] of kicks) {
        const kickedPiece = { ...rotatedPiece, x: rotatedPiece.x + kx, y: rotatedPiece.y + ky };
        if (!checkCollision(kickedPiece)) {
            setCurrentPiece(kickedPiece);
            drawBoard();
            return;
        }
    }
}

/**
 * Clears full lines and updates score/level.
 */
export function clearLines() {
    let linesCleared = 0;
    const clearedRows = [];
    
    // Find all full lines first
    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            clearedRows.push(r);
            linesCleared++;
        }
    }

    if (linesCleared > 0) {
        // Flash the lines before removing them
        flashClearedLines(clearedRows);
        
        // Wait for flash animation to complete before removing lines
        setTimeout(() => {
            // Remove the cleared lines and add empty lines at the top
            clearedRows.sort((a, b) => a - b); // Sort in ascending order
            clearedRows.forEach(() => {
                // Find and remove the first full line
                for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
                    if (board[r].every(cell => cell !== 0)) {
                        board.splice(r, 1);
                        board.unshift(Array(BOARD_WIDTH).fill(0));
                        break;
                    }
                }
            });

            // Update score with multiplier
            const pointsEarned = SCORE_PER_LINE * linesCleared * linesCleared;
            const newScore = score + pointsEarned;
            setScore(newScore);
            
            // Create score particles at the middle cleared row
            const middleRow = clearedRows[Math.floor(clearedRows.length / 2)];
            createScoreParticles(pointsEarned, middleRow, linesCleared);

            // Update lines and check for level up
            const newLines = lines + linesCleared;
            setLines(newLines);
            
            const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;
            if (newLevel > level) {
                setLevel(newLevel);
                restartDropInterval(); // Speed up the game
            }

            drawBoard();
        }, 600); // Wait for flash animation (0.3s * 2 iterations)
    }
}

/**
 * Spawns the next piece and checks for game over.
 * @returns {boolean} True if game continues, false if game over.
 */
export function spawnNextPiece() {
    setCurrentPiece(nextPiece);
    setNextPiece(getRandomPiece());
    
    // Check if the new piece immediately collides (game over condition)
    if (checkCollision(currentPiece)) {
        return false; // Game over
    }
    
    return true; // Game continues
}
