import { INITIAL_DROP_DELAY, DIFFICULTY_CONFIG } from './game-constants.js';
import { 
    isPlaying, 
    isPaused, 
    level,
    difficulty,
    dropIntervalId,
    setIsPaused,
    setDropIntervalId
} from './game-state.js';
import { movePiece, rotatePiece, hardDrop } from './game-logic.js';
import { lockPiece } from './game-pieces.js';
import { clearLines, spawnNextPiece } from './game-logic.js';
import { drawBoard, drawNextPiece } from './game-board.js';
import { updateEnergyBlocks, drawEnergyBlocks, trySpawnEnergyBlock } from './energy-blocks.js';

let gameTickCallback = null;
let endGameCallback = null;

/**
 * Set callbacks for game control
 */
export function setGameCallbacks(onGameTick, onEndGame) {
    gameTickCallback = onGameTick;
    endGameCallback = onEndGame;
}

/**
 * The main game loop tick (gravity).
 * @param {boolean} forceLock - Whether to force a lock if movement fails (used for hard drop).
 */
export function gameTick(forceLock = false) {
    if (!isPlaying || isPaused) return;

    // Update energy blocks
    const energyBlockStatus = updateEnergyBlocks();
    if (energyBlockStatus === 'GAME_OVER') {
        if (endGameCallback) endGameCallback();
        return;
    }

    // 1. Try to move down
    const moved = movePiece(0, 1);

    // 2. If movement failed (collision), lock the piece
    if (!moved || forceLock) {
        lockPiece(window.currentPiece);
        clearLines();
        
        // Try to spawn energy block (Hard/Impossible mode)
        trySpawnEnergyBlock();
        
        // Spawn next piece
        const canContinue = spawnNextPiece();
        
        if (!canContinue) {
            // Game over
            if (endGameCallback) endGameCallback();
            return;
        }
        
        drawBoard();
        drawEnergyBlocks(); // Draw energy blocks after board
        drawNextPiece();
    } else {
        // Redraw board to show energy blocks even during piece movement
        drawBoard();
        drawEnergyBlocks();
    }
}

/**
 * Starts the piece dropping interval.
 */
export function startDropInterval() {
    // Get difficulty multiplier (default to 1.0 if no difficulty selected)
    const difficultyMultiplier = (difficulty && DIFFICULTY_CONFIG[difficulty]) 
        ? DIFFICULTY_CONFIG[difficulty].dropSpeedMultiplier 
        : 1.0;
    const dropDelay = (INITIAL_DROP_DELAY * difficultyMultiplier) / level;
    
    if (dropIntervalId) clearInterval(dropIntervalId);
    const intervalId = setInterval(() => gameTickCallback && gameTickCallback(), dropDelay);
    setDropIntervalId(intervalId);
}

/**
 * Restarts the drop interval after a level change.
 */
export function restartDropInterval() {
    if (isPlaying && !isPaused) {
        startDropInterval();
    }
}

/**
 * Handle keyboard input
 */
export function handleKeyDown(event) {
    if (!isPlaying || isPaused) {
        // Allow Space or Enter to start/unpause
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            const startButton = document.getElementById('start-button');
            const pauseButton = document.getElementById('pause-button');
            if (!startButton.classList.contains('hidden')) {
                startButton.click();
            } else if (!pauseButton.classList.contains('hidden')) {
                pauseButton.click();
            }
        }
        return;
    }

    switch (event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            event.preventDefault();
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            event.preventDefault();
            movePiece(0, 1);
            break;
        case 'ArrowUp':
        case 'r':
        case 'R':
            event.preventDefault();
            rotatePiece();
            break;
        case ' ':
            event.preventDefault();
            if (hardDrop()) {
                gameTickCallback && gameTickCallback(true); // Force lock after hard drop
            }
            break;
        case 'p':
        case 'P':
        case 'Escape':
            event.preventDefault();
            document.getElementById('pause-button').click();
            break;
    }
}

/**
 * Handle touch controls
 */
export function handleTouchControls(event) {
    const action = event.target.closest('button')?.dataset.action;
    if (!action || !isPlaying || isPaused) return;

    switch (action) {
        case 'left':
            movePiece(-1, 0);
            break;
        case 'right':
            movePiece(1, 0);
            break;
        case 'down':
            movePiece(0, 1);
            break;
        case 'rotate':
            rotatePiece();
            break;
        case 'hard-drop':
            if (hardDrop()) {
                gameTickCallback && gameTickCallback(true); // Force lock after hard drop
            }
            break;
    }
}

/**
 * Pause/unpause the game
 */
export function togglePause() {
    if (!isPlaying) return;

    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    const statusEl = document.getElementById('status-message');
    const pauseButton = document.getElementById('pause-button');
    
    if (newPausedState) {
        if (dropIntervalId) clearInterval(dropIntervalId);
        statusEl.textContent = 'PAUSED';
        pauseButton.textContent = 'RESUME';
    } else {
        startDropInterval();
        statusEl.textContent = 'GAME ON!';
        pauseButton.textContent = 'PAUSE';
    }
}
