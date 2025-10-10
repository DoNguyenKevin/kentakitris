// Main entry point for the game
import { initializeFirebase } from './firebase-config.js';
import { initLeaderboard, loadLeaderboard, saveScore } from './leaderboard.js';
import { 
    createBoard, 
    resetGameState,
    setCurrentPiece,
    setNextPiece,
    setIsPlaying,
    score,
    level
} from './game-state.js';
import { getRandomPiece } from './game-pieces.js';
import { drawBoard, drawNextPiece, updateStats } from './game-board.js';
import { 
    gameTick, 
    startDropInterval, 
    handleKeyDown, 
    handleTouchControls,
    togglePause,
    setGameCallbacks
} from './game-controls.js';

// --- DOM ELEMENTS ---
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const touchControls = document.getElementById('touch-controls');
const statusEl = document.getElementById('status-message');
const boardEl = document.getElementById('game-board');

// Make currentPiece available globally for game-controls
import * as gameState from './game-state.js';
window.currentPiece = gameState.currentPiece;

// Set up game callbacks
setGameCallbacks(gameTick, endGame);

/**
 * Initializes and starts a new game.
 */
function startGame() {
    if (gameState.isPlaying) return;

    // Reset state
    resetGameState();
    updateStats(0, 1);

    // Setup initial pieces
    const firstPiece = getRandomPiece();
    const nextPieceValue = getRandomPiece();
    setCurrentPiece(firstPiece);
    setNextPiece(nextPieceValue);
    
    // Update window reference
    window.currentPiece = firstPiece;
    
    drawNextPiece();

    setIsPlaying(true);
    statusEl.textContent = 'GAME ON!';
    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');

    drawBoard();
    startDropInterval();
    attachInputHandlers();
}

/**
 * Ends the game.
 */
function endGame() {
    resetGameState();
    
    statusEl.textContent = `GAME OVER! Score: ${score}`;
    startButton.textContent = 'RESTART';
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');

    // Flash the board (optional)
    boardEl.style.opacity = '0.5';
    setTimeout(() => { boardEl.style.opacity = '1'; }, 100);
    
    // Save the final score
    saveScore(score);

    // Remove input handlers until restart
    detachInputHandlers();
}

/**
 * Attach input event listeners
 */
function attachInputHandlers() {
    document.addEventListener('keydown', handleKeyDown);
    touchControls.addEventListener('click', handleTouchControls);
}

/**
 * Detach input event listeners
 */
function detachInputHandlers() {
    document.removeEventListener('keydown', handleKeyDown);
    touchControls.removeEventListener('click', handleTouchControls);
}

// --- INITIALIZATION ---
async function init() {
    // Initialize Firebase
    const { db, auth, userId, appId } = await initializeFirebase();
    
    // Initialize leaderboard if Firebase is available
    if (db && userId) {
        initLeaderboard(appId, db, userId);
        loadLeaderboard();
    }

    // Set up button event listeners
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);

    // Initial setup for the board display (empty)
    createBoard();
    drawBoard(); 
    drawNextPiece();
    updateStats(0, 1);

    // Attach initial keydown listener for Start/Pause functionality
    document.addEventListener('keydown', handleKeyDown);
}

// Start the application
init();
