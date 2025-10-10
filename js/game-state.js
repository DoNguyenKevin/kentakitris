import { BOARD_WIDTH, BOARD_HEIGHT } from './game-constants.js';

// --- GAME STATE ---
export let board = [];
export let currentPiece = null;
export let nextPiece = null;
export let score = 0;
export let lines = 0;
export let level = 1;
export let isPlaying = false;
export let isPaused = false;
export let dropIntervalId = null;

/**
 * Creates an empty game board (20 rows x 10 columns).
 */
export function createBoard() {
    board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
}

/**
 * Reset all game state
 */
export function resetGameState() {
    createBoard();
    score = 0;
    lines = 0;
    level = 1;
    currentPiece = null;
    nextPiece = null;
    isPlaying = false;
    isPaused = false;
    if (dropIntervalId) {
        clearInterval(dropIntervalId);
    }
    dropIntervalId = null;
}

/**
 * Update game state values
 */
export function setCurrentPiece(piece) {
    currentPiece = piece;
}

export function setNextPiece(piece) {
    nextPiece = piece;
}

export function setScore(newScore) {
    score = newScore;
}

export function setLines(newLines) {
    lines = newLines;
}

export function setLevel(newLevel) {
    level = newLevel;
}

export function setIsPlaying(value) {
    isPlaying = value;
}

export function setIsPaused(value) {
    isPaused = value;
}

export function setDropIntervalId(id) {
    dropIntervalId = id;
}
