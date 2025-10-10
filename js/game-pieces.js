import { SHAPES, BOARD_WIDTH } from './game-constants.js';
import { board } from './game-state.js';

/**
 * Generates a random tetromino piece.
 * @returns {object} The new piece object.
 */
export function getRandomPiece() {
    const index = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[index];
    const color = index + 1; // Color index starts at 1
    const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);

    return {
        shape: shape,
        color: color,
        x: startX,
        y: 0,
    };
}

/**
 * Checks if the piece at the given position collides with boundaries or existing blocks.
 * @param {object} piece - The piece to check.
 * @returns {boolean} True if collision occurs, false otherwise.
 */
export function checkCollision(piece) {
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c] !== 0) {
                const newY = piece.y + r;
                const newX = piece.x + c;

                // Check boundaries
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= board.length) {
                    return true;
                }

                // Check collision with existing blocks (but not above the board)
                if (newY >= 0 && board[newY][newX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Locks the current piece into the board state.
 */
export function lockPiece(piece) {
    piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell !== 0) {
                const boardY = piece.y + r;
                const boardX = piece.x + c;
                if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < BOARD_WIDTH) {
                    board[boardY][boardX] = piece.color;
                }
            }
        });
    });
}

/**
 * Rotates a piece 90 degrees clockwise.
 * @param {object} piece - The piece to rotate
 * @returns {object} The rotated piece
 */
export function rotatePieceShape(piece) {
    const shape = piece.shape;
    const size = shape.length;
    const newShape = Array.from({ length: size }, () => Array(size).fill(0));

    // Perform rotation (transpose and reverse rows)
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            newShape[c][size - 1 - r] = shape[r][c];
        }
    }

    return { ...piece, shape: newShape };
}
