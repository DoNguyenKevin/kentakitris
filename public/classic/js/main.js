// Main entry point for the game
import { initializeFirebase } from './firebase-config.js';
import { initLeaderboard, loadLeaderboard, saveScore } from './leaderboard.js';
import { 
    createBoard, 
    resetGameState,
    setCurrentPiece,
    setNextPiece,
    setIsPlaying,
    setDifficulty,
    score,
    level,
    difficulty
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
import { initMouseTracking } from './energy-blocks.js';

// --- DOM ELEMENTS ---
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const touchControls = document.getElementById('touch-controls');
const statusEl = document.getElementById('status-message');
const boardEl = document.getElementById('game-board');
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const showSpeedToggle = document.getElementById('show-speed-toggle');
const difficultyModal = document.getElementById('difficulty-modal');

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

    console.log('startGame called, difficulty:', difficulty);
    
    // Show difficulty modal if not selected yet
    if (!difficulty) {
        console.log('Showing difficulty modal');
        showDifficultyModal();
        return;
    }

    console.log('Starting game with difficulty:', difficulty);
    
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

// --- SETTINGS FUNCTIONS ---

/**
 * Shows the settings modal
 */
function showSettingsModal() {
    // Load current settings
    const showSpeed = localStorage.getItem('showSpeed') === 'true';
    showSpeedToggle.checked = showSpeed;
    
    settingsModal.classList.remove('hidden');
}

/**
 * Hides the settings modal
 */
function hideSettingsModal() {
    settingsModal.classList.add('hidden');
}

/**
 * Saves settings to localStorage
 */
function saveSettings() {
    const showSpeed = showSpeedToggle.checked;
    localStorage.setItem('showSpeed', showSpeed.toString());
    
    // Update display immediately
    updateStats(score, level);
}

// --- DIFFICULTY MODAL FUNCTIONS ---

/**
 * Shows the difficulty selection modal
 */
function showDifficultyModal() {
    difficultyModal.classList.remove('hidden');
}

/**
 * Hides the difficulty selection modal
 */
function hideDifficultyModal() {
    difficultyModal.classList.add('hidden');
}

/**
 * Handles difficulty selection
 */
function selectDifficulty(selectedDifficulty) {
    setDifficulty(selectedDifficulty);
    localStorage.setItem('gameDifficulty', selectedDifficulty);
    hideDifficultyModal();
    
    // Start the game after selecting difficulty
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
    statusEl.textContent = `GAME ON! (${selectedDifficulty.toUpperCase()})`;
    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');

    drawBoard();
    startDropInterval();
    attachInputHandlers();
    initMouseTracking(); // Initialize mouse tracking for Impossible mode
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

    // Settings button handler
    settingsButton.addEventListener('click', () => {
        showSettingsModal();
    });

    // Settings modal handlers
    settingsCloseBtn.addEventListener('click', () => {
        saveSettings();
        hideSettingsModal();
    });

    showSpeedToggle.addEventListener('change', () => {
        saveSettings();
    });

    // Close settings modal when clicking outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            saveSettings();
            hideSettingsModal();
        }
    });

    // Difficulty selection handlers
    const difficultyButtons = document.querySelectorAll('.difficulty-button');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedDifficulty = button.dataset.difficulty;
            selectDifficulty(selectedDifficulty);
        });
    });

    // Load saved difficulty if available
    const savedDifficulty = localStorage.getItem('gameDifficulty');
    if (savedDifficulty) {
        setDifficulty(savedDifficulty);
    }

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
