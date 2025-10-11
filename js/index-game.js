// --- IMPORTS - Nhập các module skill ---
import * as BombSkill from './powerups/bomb-skill.js';
import * as MagicBlockSkill from './powerups/magic-block-skill.js';
import * as TeleportSkill from './powerups/teleport-skill.js';
import * as ReverseGravitySkill from './powerups/reverse-gravity-skill.js';
import * as WideModeSkill from './powerups/wide-mode-skill.js';

// --- HELPER FUNCTIONS FOR NAME MANAGEMENT ---

/**
 * Lấy ngày hiện tại dạng YYYY-MM-DD
 */
function getTodayString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

/**
 * Kiểm tra xem user đã đặt tên hôm nay chưa
 */
function canChangeNameToday() {
    const lastNameChangeDate = localStorage.getItem('lastNameChangeDate');
    const today = getTodayString();
    return lastNameChangeDate !== today;
}

/**
 * Lưu tên người chơi và ghi nhận ngày đổi tên
 */
function savePlayerName(name) {
    localStorage.setItem('playerName', name);
    localStorage.setItem('lastNameChangeDate', getTodayString());
}

/**
 * Lấy tên người chơi hiện tại
 */
function getPlayerName() {
    return localStorage.getItem('playerName') || null;
}

// --- GAME CONSTANTS ---
// Lưu ý: BOARD_WIDTH có thể thay đổi khi Wide Mode active
let BOARD_WIDTH = 10; // Chiều rộng bảng (có thể thay đổi)
const ORIGINAL_BOARD_WIDTH = 10; // Chiều rộng gốc (không đổi)
const BOARD_HEIGHT = 20;
const NEXT_GRID_SIZE = 4;
const SCORE_PER_LINE = 10;
const LINES_PER_LEVEL = 10;
const INITIAL_DROP_DELAY = 1000; // ms

// --- POWER-UPS/SKILLS SYSTEM ---
const POWERUPS = {
    // Offensive Skills
    CLEAR_BOTTOM: {
        id: 'CLEAR_BOTTOM',
        name: '🔥 Clear Bottom',
        description: 'Instantly clear the bottom 2 rows',
        icon: '🔥',
        rarity: 'common',
        color: 'orange',
        type: 'instant'
    },
    BOMB: {
        id: 'BOMB',
        name: '💣 Bomb',
        description: 'Clear a 3x3 area around next placed piece',
        icon: '💣',
        rarity: 'uncommon',
        color: 'red',
        type: 'nextPiece',
        duration: 1
    },
    LASER: {
        id: 'LASER',
        name: '⚡ Laser Beam',
        description: 'Clear an entire column',
        icon: '⚡',
        rarity: 'rare',
        color: 'yellow',
        type: 'instant'
    },
    
    // Defensive Skills
    SLOW_TIME: {
        id: 'SLOW_TIME',
        name: '⏰ Slow Time',
        description: 'Reduce falling speed by 50% for 30 seconds',
        icon: '⏰',
        rarity: 'uncommon',
        color: 'blue',
        type: 'duration',
        duration: 30000 // ms
    },
    GHOST_PIECE: {
        id: 'GHOST_PIECE',
        name: '👻 Ghost Mode',
        description: 'See where piece will land (permanent)',
        icon: '👻',
        rarity: 'rare',
        color: 'cyan',
        type: 'permanent'
    },
    SHIELD: {
        id: 'SHIELD',
        name: '🛡️ Shield',
        description: 'Prevent game over once',
        icon: '🛡️',
        rarity: 'legendary',
        color: 'gold',
        type: 'passive'
    },
    
    // Utility Skills
    SCORE_BOOST: {
        id: 'SCORE_BOOST',
        name: '💰 Score Boost',
        description: '+50% score for 20 seconds',
        icon: '💰',
        rarity: 'common',
        color: 'green',
        type: 'duration',
        duration: 20000
    },
    SWAP_PIECE: {
        id: 'SWAP_PIECE',
        name: '🔄 Swap Hold',
        description: 'Hold and swap current piece (permanent)',
        icon: '🔄',
        rarity: 'rare',
        color: 'purple',
        type: 'permanent'
    },
    PREVIEW_PLUS: {
        id: 'PREVIEW_PLUS',
        name: '🔮 Preview+',
        description: 'See next 3 pieces instead of 1',
        icon: '🔮',
        rarity: 'uncommon',
        color: 'purple',
        type: 'permanent'
    },
    
    // Special Skills
    TELEPORT: {
        id: 'TELEPORT',
        name: '🌀 Teleport',
        description: 'Move current piece anywhere on board',
        icon: '🌀',
        rarity: 'rare',
        color: 'magenta',
        type: 'instant'
    },
    REVERSE_GRAVITY: {
        id: 'REVERSE_GRAVITY',
        name: '🔺 Reverse Gravity',
        description: 'Pieces rise up for 15 seconds',
        icon: '🔺',
        rarity: 'legendary',
        color: 'pink',
        type: 'duration',
        duration: 15000
    },
    RANDOM_CLEAR: {
        id: 'RANDOM_CLEAR',
        name: '🎲 Random Clear',
        description: 'Clear 5-10 random blocks',
        icon: '🎲',
        rarity: 'common',
        color: 'rainbow',
        type: 'instant'
    },
    MAGIC_BLOCK: {
        id: 'MAGIC_BLOCK',
        name: '✨ Magic Block',
        description: 'Next piece fills gaps automatically',
        icon: '✨',
        rarity: 'uncommon',
        color: 'gold',
        type: 'nextPiece',
        duration: 1
    },
    WIDE_PIECE: {
        id: 'WIDE_PIECE',
        name: '📏 Wide Mode',
        description: 'Board becomes 12 blocks wide for 25s',
        icon: '📏',
        rarity: 'legendary',
        color: 'blue',
        type: 'duration',
        duration: 25000
    },
    TIME_FREEZE: {
        id: 'TIME_FREEZE',
        name: '❄️ Time Freeze',
        description: 'Pause piece falling for 10 seconds',
        icon: '❄️',
        rarity: 'rare',
        color: 'cyan',
        type: 'duration',
        duration: 10000
    }
};

// Rarity weights for random selection
const RARITY_WEIGHTS = {
    common: 50,
    uncommon: 30,
    rare: 15,
    legendary: 5
};

// Tetromino shapes and their colors (color index 1-7)
const SHAPES = [
    // 0: T-shape
    [[0, 1, 0], [1, 1, 1], [0, 0, 0],], 
    // 1: I-shape
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0],], 
    // 2: J-shape
    [[1, 0, 0], [1, 1, 1], [0, 0, 0],], 
    // 3: L-shape
    [[0, 0, 1], [1, 1, 1], [0, 0, 0],], 
    // 4: O-shape
    [[1, 1], [1, 1],], 
    // 5: S-shape
    [[0, 1, 1], [1, 1, 0], [0, 0, 0],], 
    // 6: Z-shape
    [[1, 1, 0], [0, 1, 1], [0, 0, 0],], 
];

// The index in COLORS corresponds to the color-N class in CSS
const COLORS = [
    null, // Index 0 is reserved for empty space
    'color-1', // T: Pink
    'color-2', // I: Cyan
    'color-3', // J: Lime Green
    'color-4', // L: Orange
    'color-5', // O: Yellow
    'color-6', // S: Red
    'color-7', // Z: Blue Violet
];

// --- GAME STATE ---
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let level = 1;
let isPlaying = false;
let isPaused = false;
let dropIntervalId = null;

// Power-ups state
let activePowerups = []; // Array of active powerup objects
let permanentPowerups = []; // Array of permanent powerup IDs
let powerupTimers = {}; // Track duration-based powerups
let heldPiece = null; // For SWAP_PIECE powerup
let canSwap = true; // For SWAP_PIECE powerup
let shieldActive = false; // For SHIELD powerup
let nextPieces = []; // For PREVIEW_PLUS powerup (array of 3)
let scoreMultiplier = 1.0; // For SCORE_BOOST powerup

// Trạng thái các skill mới (New skills state)
let teleportDeactivator = null; // Hàm để tắt chế độ teleport
let wideModeOriginalWidth = 10; // Chiều rộng bảng gốc trước khi Wide Mode

// --- DOM ELEMENTS ---
const boardEl = document.getElementById('game-board');
const scoreEl = document.getElementById('score-display');
const levelEl = document.getElementById('level-display');
const nextPieceEl = document.getElementById('next-piece-display');
const statusEl = document.getElementById('status-message');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const touchControls = document.getElementById('touch-controls');
const leaderboardListEl = document.getElementById('leaderboard-list');

// Modal elements (Name modal)
const nameModal = document.getElementById('name-modal');
const modalScore = document.getElementById('modal-score');
const playerNameInput = document.getElementById('player-name-input');
const nameInputSection = document.getElementById('name-input-section');
const nameLockedSection = document.getElementById('name-locked-section');
const currentPlayerNameEl = document.getElementById('current-player-name');
const saveScoreBtn = document.getElementById('save-score-btn');
const skipSaveBtn = document.getElementById('skip-save-btn');
const saveStatus = document.getElementById('save-status');

// Powerup modal elements
const powerupModal = document.getElementById('powerup-modal');
const powerupChoicesEl = document.getElementById('powerup-choices');
const activePowerupsDisplay = document.getElementById('active-powerups-display');

// Settings modal elements
const settingsModal = document.getElementById('settings-modal');
const settingsButton = document.getElementById('settings-button');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const showSpeedToggle = document.getElementById('show-speed-toggle');

// --- FIREBASE/LEADERBOARD FUNCTIONS (REALTIME DATABASE) ---

/**
 * Saves the current score to the Realtime Database leaderboard.
 * Only updates if the new score is higher than the existing one.
 */
window.saveScore = async (finalScore) => {
    if (!window.db || !window.userId) {
        console.log("Cannot save score: Firebase or User ID not initialized.");
        saveStatus.textContent = '❌ Firebase not initialized';
        saveStatus.className = 'text-sm text-center mt-4 text-red-400';
        return false;
    }

    const { ref, set, get } = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js");
    
    // Get player name from localStorage or use short ID
    const playerName = getPlayerName() || window.userId.substring(0, 8);
    const userRef = ref(window.db, `leaderboards/global/${window.userId}`);

    try {
        // Check existing score
        const snapshot = await get(userRef);
        const existingData = snapshot.val();

        // Only save if no existing score OR new score is higher
        if (!existingData || finalScore > existingData.score) {
            await set(userRef, {
                name: playerName,
                score: finalScore,
                updatedAt: Date.now()
            });
            console.log(`Score saved: ${finalScore} (Previous: ${existingData?.score || 0})`);
            
            saveStatus.textContent = existingData 
                ? `🎉 New High Score! ${finalScore} (Previous: ${existingData.score})`
                : `✅ Score saved: ${finalScore}`;
            saveStatus.className = 'text-sm text-center mt-4 text-green-400';
            return true;
        } else {
            console.log(`Score ${finalScore} not saved. Current best: ${existingData.score}`);
            saveStatus.textContent = `⚠️ Your best score is still ${existingData.score}`;
            saveStatus.className = 'text-sm text-center mt-4 text-yellow-400';
            return false;
        }
    } catch (error) {
        console.error("Error saving score to Realtime Database:", error);
        saveStatus.textContent = `❌ Error: ${error.message}`;
        saveStatus.className = 'text-sm text-center mt-4 text-red-400';
        return false;
    }
};

/**
 * Loads and displays the leaderboard in real-time.
 * Shows top 10 scores, sorted by score descending.
 */
window.loadLeaderboard = () => {
    if (!window.db) return;

    const { ref, query, orderByChild, limitToLast, onValue } = 
        window.loadLeaderboard.imports || {};
    
    // Import the functions if not already cached
    if (!window.loadLeaderboard.imports) {
        import("https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js")
            .then(module => {
                window.loadLeaderboard.imports = module;
                window.loadLeaderboard(); // Retry after imports
            });
        return;
    }

    const leaderboardRef = ref(window.db, 'leaderboards/global');
    const topScoresQuery = query(leaderboardRef, orderByChild('score'), limitToLast(10));

    // Listen to real-time updates
    onValue(topScoresQuery, (snapshot) => {
        const scores = [];
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            scores.push({
                uid: childSnapshot.key,
                name: data.name,
                score: data.score,
                updatedAt: data.updatedAt
            });
        });

        // Sort descending (limitToLast gives ascending order)
        scores.sort((a, b) => b.score - a.score);

        // Display leaderboard
        leaderboardListEl.innerHTML = '';
        if (scores.length === 0) {
            leaderboardListEl.innerHTML = '<p class="text-gray-400">No scores yet! Be the first!</p>';
            return;
        }

        scores.forEach((entry, index) => {
            const isCurrentUser = entry.uid === window.userId;
            const listItem = document.createElement('li');
            listItem.className = `flex justify-between ${isCurrentUser ? 'text-yellow-300 font-bold' : 'text-white'}`;
            listItem.innerHTML = `
                <span class="w-1/12">${index + 1}.</span>
                <span class="w-7/12 truncate">${entry.name}</span>
                <span class="w-4/12 text-right">${entry.score}</span>
            `;
            leaderboardListEl.appendChild(listItem);
        });
    }, (error) => {
        console.error("Error listening to leaderboard:", error);
        leaderboardListEl.innerHTML = '<p class="text-red-400 text-sm">Error loading leaderboard.</p>';
    });
};

// --- POWER-UPS SYSTEM FUNCTIONS ---

/**
 * Get random powerups based on rarity weights
 */
function getRandomPowerups(count = 3) {
    const allPowerups = Object.values(POWERUPS);
    const selected = [];
    
    // Create weighted pool
    const weightedPool = [];
    allPowerups.forEach(powerup => {
        const weight = RARITY_WEIGHTS[powerup.rarity];
        for (let i = 0; i < weight; i++) {
            weightedPool.push(powerup);
        }
    });
    
    // Select unique powerups
    while (selected.length < count && weightedPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * weightedPool.length);
        const powerup = weightedPool[randomIndex];
        
        // Check if not already selected
        if (!selected.find(p => p.id === powerup.id)) {
            selected.push(powerup);
        }
        
        // Remove all instances of this powerup from pool
        weightedPool.splice(0, weightedPool.length, 
            ...weightedPool.filter(p => p.id !== powerup.id));
    }
    
    return selected;
}

/**
 * Show powerup selection modal
 */
function showPowerupModal() {
    // Pause game
    if (isPlaying && !isPaused) {
        isPaused = true;
        clearInterval(dropIntervalId);
        dropIntervalId = null;
    }
    
    // Get 3 random powerups
    const powerups = getRandomPowerups(3);
    
    // Render powerup cards
    powerupChoicesEl.innerHTML = '';
    powerups.forEach(powerup => {
        const card = createPowerupCard(powerup);
        powerupChoicesEl.appendChild(card);
    });
    
    // Update active powerups display
    updateActivePowerupsDisplay();
    
    // Show modal
    powerupModal.classList.remove('hidden');
}

/**
 * Create powerup card HTML element
 */
function createPowerupCard(powerup) {
    const card = document.createElement('div');
    const rarityColors = {
        common: 'border-green-500 bg-green-900/20',
        uncommon: 'border-blue-500 bg-blue-900/20',
        rare: 'border-purple-500 bg-purple-900/20',
        legendary: 'border-yellow-500 bg-yellow-900/20 animate-pulse'
    };
    
    card.className = `powerup-card border-4 ${rarityColors[powerup.rarity]} p-4 rounded-lg cursor-pointer hover:scale-105 transition-transform`;
    card.innerHTML = `
        <div class="text-center">
            <div class="text-6xl mb-3">${powerup.icon}</div>
            <h3 class="text-lg font-bold text-white mb-2">${powerup.name.replace(powerup.icon, '').trim()}</h3>
            <p class="text-sm text-gray-300 mb-3 min-h-[3rem]">${powerup.description}</p>
            <div class="text-xs text-${powerup.color}-400 uppercase font-bold mb-3">${powerup.rarity}</div>
            <button class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded">
                SELECT
            </button>
        </div>
    `;
    
    card.querySelector('button').addEventListener('click', () => {
        activatePowerup(powerup);
        hidePowerupModal();
    });
    
    return card;
}

/**
 * Hide powerup modal and resume game
 */
function hidePowerupModal() {
    powerupModal.classList.add('hidden');
    
    // Resume game
    if (isPlaying) {
        isPaused = false;
        startDropInterval();
    }
}

/**
 * Activate selected powerup
 */
function activatePowerup(powerup) {
    console.log(`Activating powerup: ${powerup.name}`);
    
    // Show activation message
    statusEl.textContent = `${powerup.icon} ${powerup.name} Activated!`;
    setTimeout(() => {
        if (isPlaying) statusEl.textContent = 'GAME ON!';
    }, 2000);
    
    // Dispatch based on type
    switch (powerup.type) {
        case 'instant':
            activateInstantPowerup(powerup);
            break;
        case 'duration':
            activateDurationPowerup(powerup);
            break;
        case 'permanent':
            activatePermanentPowerup(powerup);
            break;
        case 'passive':
            activatePassivePowerup(powerup);
            break;
        case 'nextPiece':
            activateNextPiecePowerup(powerup);
            break;
    }
    
    updateActivePowerupsDisplay();
}

/**
 * Activate instant powerups
 * Kích hoạt các kỹ năng tức thì
 */
function activateInstantPowerup(powerup) {
    switch (powerup.id) {
        case 'CLEAR_BOTTOM':
            // Clear bottom 2 rows - Xóa 2 hàng dưới cùng
            board.splice(BOARD_HEIGHT - 2, 2);
            board.unshift(Array(BOARD_WIDTH).fill(0), Array(BOARD_WIDTH).fill(0));
            drawBoard();
            break;
            
        case 'LASER':
            // Find highest column - Tìm cột cao nhất
            let highestCol = 0;
            let minHeight = BOARD_HEIGHT;
            for (let c = 0; c < BOARD_WIDTH; c++) {
                for (let r = 0; r < BOARD_HEIGHT; r++) {
                    if (board[r][c] !== 0 && r < minHeight) {
                        minHeight = r;
                        highestCol = c;
                    }
                }
            }
            // Clear that column - Xóa cột đó
            for (let r = 0; r < BOARD_HEIGHT; r++) {
                board[r][highestCol] = 0;
            }
            drawBoard();
            break;
            
        case 'RANDOM_CLEAR':
            // Clear 5-10 random blocks - Xóa 5-10 ô ngẫu nhiên
            const clearCount = Math.floor(Math.random() * 6) + 5;
            for (let i = 0; i < clearCount; i++) {
                const r = Math.floor(Math.random() * BOARD_HEIGHT);
                const c = Math.floor(Math.random() * BOARD_WIDTH);
                board[r][c] = 0;
            }
            drawBoard();
            break;
            
        case 'TELEPORT':
            // Kích hoạt chế độ Teleport - người chơi click để đặt mảnh
            teleportDeactivator = TeleportSkill.activateTeleportMode(
                boardEl, 
                (cellX, cellY) => {
                    // Callback khi người chơi click vào bảng
                    const newPiece = TeleportSkill.tryTeleport(
                        currentPiece, 
                        cellX, 
                        cellY, 
                        checkCollision
                    );
                    
                    if (newPiece) {
                        // Teleport thành công!
                        currentPiece = newPiece;
                        drawBoard();
                        
                        // Tắt chế độ teleport sau khi dùng
                        if (teleportDeactivator) {
                            teleportDeactivator();
                            teleportDeactivator = null;
                        }
                    } else {
                        // Vị trí không hợp lệ, hiển thị thông báo
                        console.log('❌ Cannot teleport there!');
                    }
                }
            );
            break;
    }
}

/**
 * Activate duration powerups
 * Kích hoạt các kỹ năng có thời gian
 */
function activateDurationPowerup(powerup) {
    const endTime = Date.now() + powerup.duration;
    activePowerups.push({ ...powerup, endTime });
    
    switch (powerup.id) {
        case 'SLOW_TIME':
            restartDropInterval(); // Will apply slow effect
            break;
            
        case 'SCORE_BOOST':
            scoreMultiplier = 1.5;
            break;
            
        case 'TIME_FREEZE':
            clearInterval(dropIntervalId);
            dropIntervalId = null;
            break;
            
        case 'REVERSE_GRAVITY':
            // Kích hoạt đảo trọng lực
            ReverseGravitySkill.activateReverseGravity();
            break;
            
        case 'WIDE_PIECE':
            // Kích hoạt Wide Mode - mở rộng bảng
            board = WideModeSkill.activateWideMode(board, BOARD_HEIGHT, 12);
            BOARD_WIDTH = WideModeSkill.getCurrentBoardWidth();
            
            // Cập nhật hiển thị
            WideModeSkill.updateBoardDisplay(boardEl, BOARD_WIDTH);
            
            // Điều chỉnh vị trí mảnh hiện tại
            if (currentPiece) {
                currentPiece = WideModeSkill.adjustPieceForWideMode(
                    currentPiece, 
                    ORIGINAL_BOARD_WIDTH
                );
            }
            
            drawBoard();
            break;
    }
    
    // Set timer to remove effect
    powerupTimers[powerup.id] = setTimeout(() => {
        removePowerup(powerup.id);
    }, powerup.duration);
}

/**
 * Activate permanent powerups
 */
function activatePermanentPowerup(powerup) {
    if (!permanentPowerups.includes(powerup.id)) {
        permanentPowerups.push(powerup.id);
    }
    
    switch (powerup.id) {
        case 'GHOST_PIECE':
            // Will be handled in drawBoard()
            drawBoard();
            break;
            
        case 'SWAP_PIECE':
            // Enable swap functionality
            canSwap = true;
            break;
            
        case 'PREVIEW_PLUS':
            // Generate 2 more next pieces
            if (nextPieces.length === 0) {
                nextPieces = [nextPiece, getRandomPiece(), getRandomPiece()];
            }
            break;
    }
}

/**
 * Activate passive powerups
 */
function activatePassivePowerup(powerup) {
    switch (powerup.id) {
        case 'SHIELD':
            shieldActive = true;
            break;
    }
}

/**
 * Activate next piece powerups
 */
function activateNextPiecePowerup(powerup) {
    // Store for next piece spawn
    if (!activePowerups.find(p => p.id === powerup.id)) {
        activePowerups.push({ ...powerup, uses: 1 });
    }
}

/**
 * Remove powerup effect
 * Xóa hiệu ứng của kỹ năng
 */
function removePowerup(powerupId) {
    // Remove from active list
    activePowerups = activePowerups.filter(p => p.id !== powerupId);
    
    // Clear timer
    if (powerupTimers[powerupId]) {
        clearTimeout(powerupTimers[powerupId]);
        delete powerupTimers[powerupId];
    }
    
    // Revert effects - Hoàn nguyên hiệu ứng
    switch (powerupId) {
        case 'SLOW_TIME':
            restartDropInterval();
            break;
        case 'SCORE_BOOST':
            scoreMultiplier = 1.0;
            break;
        case 'TIME_FREEZE':
            if (isPlaying && !isPaused) {
                startDropInterval();
            }
            break;
        case 'REVERSE_GRAVITY':
            // Tắt đảo trọng lực
            ReverseGravitySkill.deactivateReverseGravity();
            break;
        case 'WIDE_PIECE':
            // Tắt Wide Mode - thu hẹp bảng về kích thước gốc
            board = WideModeSkill.deactivateWideMode(board, BOARD_HEIGHT);
            BOARD_WIDTH = ORIGINAL_BOARD_WIDTH;
            
            // Cập nhật hiển thị
            WideModeSkill.updateBoardDisplay(boardEl, BOARD_WIDTH);
            
            // Kiểm tra xem mảnh hiện tại có bị ra ngoài bảng không
            if (currentPiece && checkCollision(currentPiece)) {
                // Di chuyển mảnh vào trong bảng
                currentPiece.x = Math.max(0, Math.min(
                    currentPiece.x, 
                    BOARD_WIDTH - currentPiece.shape[0].length
                ));
            }
            
            drawBoard();
            break;
        case 'TELEPORT':
            // Tắt chế độ teleport nếu còn đang bật
            if (teleportDeactivator) {
                teleportDeactivator();
                teleportDeactivator = null;
            }
            break;
    }
    
    updateActivePowerupsDisplay();
}

/**
 * Update active powerups display
 */
function updateActivePowerupsDisplay() {
    const all = [...activePowerups, ...permanentPowerups.map(id => ({ id, permanent: true }))];
    
    if (shieldActive) {
        all.push({ id: 'SHIELD', icon: '🛡️' });
    }
    
    if (all.length === 0) {
        activePowerupsDisplay.textContent = 'Active: None';
    } else {
        const names = all.map(p => {
            const powerup = POWERUPS[p.id];
            if (!powerup) return '';
            
            let display = powerup.icon;
            if (p.endTime) {
                const remaining = Math.ceil((p.endTime - Date.now()) / 1000);
                display += ` (${remaining}s)`;
            } else if (p.permanent) {
                display += ' (∞)';
            } else if (p.uses) {
                display += ` (${p.uses}×)`;
            }
            return display;
        }).filter(Boolean);
        
        activePowerupsDisplay.textContent = `Active: ${names.join(', ')}`;
    }
}

/**
 * Check if powerup is active
 */
function hasPowerup(powerupId) {
    return activePowerups.some(p => p.id === powerupId) || 
           permanentPowerups.includes(powerupId) ||
           (powerupId === 'SHIELD' && shieldActive);
}

/**
 * Get current drop delay (affected by SLOW_TIME)
 */
function getCurrentDropDelay() {
    let delay = INITIAL_DROP_DELAY / level;
    
    if (hasPowerup('SLOW_TIME')) {
        delay *= 2; // 50% slower
    }
    
    return delay;
}

/**
 * Swaps the current piece with the held piece (SWAP_PIECE powerup)
 */
function swapHeldPiece() {
    if (!hasPowerup('SWAP_PIECE')) return;
    
    const currentPieceBackup = {
        shape: currentPiece.shape,
        color: currentPiece.color,
        rotation: currentPiece.rotation
    };
    
    if (heldPiece) {
        // Swap with held piece
        currentPiece.shape = heldPiece.shape;
        currentPiece.color = heldPiece.color;
        currentPiece.rotation = 0;
        
        // Reset position to top center
        currentPiece.x = Math.floor((BOARD_WIDTH - currentPiece.shape[0][0].length) / 2);
        currentPiece.y = 0;
    } else {
        // First time holding - spawn new piece
        spawnNewPiece();
    }
    
    // Store the old piece
    heldPiece = {
        shape: currentPieceBackup.shape,
        color: currentPieceBackup.color
    };
    
    render();
}

// --- GAME LOGIC FUNCTIONS ---

/**
 * Creates an empty game board (20 rows x 10 columns).
 */
function createBoard() {
    board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
}

/**
 * Generates a random tetromino piece.
 * @returns {object} The new piece object.
 */
function getRandomPiece() {
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
 * Draws the game board state onto the DOM.
 */
function drawBoard() {
    boardEl.innerHTML = '';
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            const block = document.createElement('div');
            block.classList.add('block');
            if (cell !== 0) {
                block.classList.add(COLORS[cell]);
            }
            // Hide the top two rows from being fully visible
            if (r < 2) {
                block.style.visibility = 'hidden';
            }
            boardEl.appendChild(block);
        });
    });

    if (currentPiece) {
        drawPiece(currentPiece);
    }
}

/**
 * Draws a single piece onto the board in its current position.
 * @param {object} piece - The piece to draw.
 */
function drawPiece(piece) {
    piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                const boardX = piece.x + c;
                const boardY = piece.y + r;

                if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                    const index = boardY * BOARD_WIDTH + boardX;
                    const block = boardEl.children[index];
                    if (block) {
                        block.classList.remove(...COLORS);
                        block.classList.add(COLORS[piece.color], 'current-piece-cell');
                        block.style.visibility = 'visible'; // Ensure current piece is visible even in ghost rows
                    }
                }
            }
        });
    });
}

/**
 * Draws the next piece in the side panel.
 */
function drawNextPiece() {
    nextPieceEl.innerHTML = '';
    // Fill the next piece grid with empty blocks
    for (let i = 0; i < NEXT_GRID_SIZE * NEXT_GRID_SIZE; i++) {
        const block = document.createElement('div');
        block.classList.add('block', 'w-1/4', 'h-1/4', 'border-gray-800');
        nextPieceEl.appendChild(block);
    }

    if (nextPiece) {
        const startRow = Math.floor((NEXT_GRID_SIZE - nextPiece.shape.length) / 2);
        const startCol = Math.floor((NEXT_GRID_SIZE - nextPiece.shape[0].length) / 2);

        nextPiece.shape.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell) {
                    const gridX = startCol + c;
                    const gridY = startRow + r;
                    const index = gridY * NEXT_GRID_SIZE + gridX;
                    
                    const block = nextPieceEl.children[index];
                    if (block) {
                        block.classList.add(COLORS[nextPiece.color]);
                    }
                }
            });
        });
    }
}

/**
 * Checks if the piece at the given position collides with boundaries or existing blocks.
 * @param {object} piece - The piece to check.
 * @returns {boolean} True if collision occurs, false otherwise.
 */
function checkCollision(piece) {
    for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c]) {
                const boardX = piece.x + c;
                const boardY = piece.y + r;

                // Check boundaries
                if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
                    return true;
                }
                
                // Check for collision with existing blocks on the board (ignore top "ghost" rows)
                if (boardY >= 0 && boardY < BOARD_HEIGHT && board[boardY][boardX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * Locks the current piece into the board state.
 * Khóa mảnh ghép hiện tại vào bảng
 */
function lockPiece() {
    currentPiece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) {
                const boardX = currentPiece.x + c;
                const boardY = currentPiece.y + r;
                // Only lock blocks that are within the visible board area (Y >= 0)
                if (boardY >= 0) {
                    board[boardY][boardX] = currentPiece.color;
                }
            }
        });
    });
    
    // Kiểm tra và kích hoạt các kỹ năng nextPiece (Bomb, Magic Block)
    
    // BOMB SKILL - Tạo vụ nổ 3x3
    if (BombSkill.hasBombPending(activePowerups)) {
        BombSkill.activateBombEffect(
            board, 
            currentPiece, 
            BOARD_WIDTH, 
            BOARD_HEIGHT
        );
        activePowerups = BombSkill.consumeBombUse(activePowerups);
        updateActivePowerupsDisplay();
        console.log('💣 Bomb exploded!');
    }
    
    // MAGIC BLOCK SKILL - Lấp đầy các khoảng trống
    if (MagicBlockSkill.hasMagicBlockPending(activePowerups)) {
        const filled = MagicBlockSkill.activateMagicBlockEffect(
            board, 
            currentPiece, 
            BOARD_WIDTH, 
            BOARD_HEIGHT
        );
        activePowerups = MagicBlockSkill.consumeMagicBlockUse(activePowerups);
        updateActivePowerupsDisplay();
        if (filled) {
            console.log('✨ Magic Block filled gaps!');
        }
    }
}

/**
 * Clears full lines and updates score/level.
 */
function clearLines() {
    let linesCleared = 0;
    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            // Line is full, clear it
            linesCleared++;
            // Move all rows above down by one
            for (let rr = r; rr > 0; rr--) {
                board[rr] = board[rr - 1];
            }
            // Top row is now empty
            board[0] = Array(BOARD_WIDTH).fill(0);
            // Rerun the check for the same row since content has shifted
            r++; 
        }
    }

    if (linesCleared > 0) {
        const scoreMultiplier = [0, 1, 3, 5, 8]; // Score for 0, 1, 2, 3, 4 lines (TETRIS!)
        score += scoreMultiplier[linesCleared] * SCORE_PER_LINE * level;
        lines += linesCleared;
        
        // Check for level up
        const newLevel = Math.floor(lines / LINES_PER_LEVEL) + 1;
        if (newLevel > level) {
            level = newLevel;
            showPowerupModal(); // Show powerup selection
            restartDropInterval();
        }

        updateStats();
    }
}

/**
 * Moves the current piece in a given direction.
 * @param {number} dx - Change in X (column).
 * @param {number} dy - Change in Y (row).
 */
function movePiece(dx, dy) {
    if (!currentPiece) return;
    const newPiece = { ...currentPiece, x: currentPiece.x + dx, y: currentPiece.y + dy };

    if (!checkCollision(newPiece)) {
        currentPiece = newPiece;
        drawBoard();
        return true;
    }
    return false;
}

/**
 * Hard drops the current piece to the bottom.
 * Thả nhanh mảnh xuống đáy (hoặc lên trần nếu Reverse Gravity)
 */
function hardDrop() {
    if (!currentPiece) return;
    let drops = 0;
    
    // Sử dụng hướng trọng lực phù hợp
    if (ReverseGravitySkill.isReverseGravityActive()) {
        drops = ReverseGravitySkill.hardDropWithGravity(currentPiece, movePiece);
    } else {
        while (movePiece(0, 1)) {
            drops++;
        }
    }
    
    // Lock the piece immediately after hard drop
    if (drops > 0) {
        gameTick(true);
    }
}

/**
 * Rotates the current piece 90 degrees clockwise.
 */
function rotatePiece() {
    if (!currentPiece) return;
    const shape = currentPiece.shape;
    const size = shape.length;
    const newShape = Array.from({ length: size }, () => Array(size).fill(0));

    // Perform rotation (transpose and reverse rows)
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            newShape[c][size - 1 - r] = shape[r][c];
        }
    }

    const newPiece = { ...currentPiece, shape: newShape };

    // Kick-testing: Try to move the piece slightly if the rotation causes a collision
    const kicks = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [kx, ky] of kicks) {
        const kickedPiece = { ...newPiece, x: newPiece.x + kx, y: newPiece.y + ky };
        if (!checkCollision(kickedPiece)) {
            currentPiece = kickedPiece;
            drawBoard();
            return;
        }
    }
}

/**
 * The main game loop tick (gravity).
 * Vòng lặp chính của game (trọng lực)
 * @param {boolean} forceLock - Whether to force a lock if movement fails (used for hard drop).
 */
function gameTick(forceLock = false) {
    if (!isPlaying || isPaused) return;

    // 1. Try to move down (or up if Reverse Gravity is active)
    // Thử di chuyển xuống (hoặc lên nếu Reverse Gravity đang hoạt động)
    let moved;
    if (ReverseGravitySkill.isReverseGravityActive()) {
        moved = ReverseGravitySkill.moveWithGravity(currentPiece, movePiece);
    } else {
        moved = movePiece(0, 1);
    }

    // 2. If movement failed (collision), lock the piece
    if (!moved || forceLock) {
        lockPiece();
        clearLines();

        // 3. Spawn next piece
        currentPiece = nextPiece;
        nextPiece = getRandomPiece();
        
        // Điều chỉnh vị trí spawn cho Reverse Gravity
        if (ReverseGravitySkill.isReverseGravityActive()) {
            currentPiece = ReverseGravitySkill.adjustSpawnPosition(
                currentPiece, 
                BOARD_WIDTH, 
                BOARD_HEIGHT
            );
        }
        
        // Điều chỉnh vị trí spawn cho Wide Mode
        if (WideModeSkill.isWideModeActive()) {
            currentPiece = WideModeSkill.adjustPieceForWideMode(
                currentPiece, 
                ORIGINAL_BOARD_WIDTH
            );
        }
        
        drawNextPiece();

        // 4. Check for Game Over (new piece immediately collides)
        if (checkCollision(currentPiece)) {
            endGame();
            return;
        }
        drawBoard(); // Draw the newly spawned piece
    }
}

/**
 * Updates score and level displays.
 */
function updateStats() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
    
    // Update speed display if settings allow it
    const speedEl = document.getElementById('speed-display');
    if (speedEl) {
        const showSpeed = localStorage.getItem('showSpeed') === 'true';
        if (showSpeed) {
            const currentSpeed = Math.round(getCurrentDropDelay());
            speedEl.textContent = `(${currentSpeed}ms)`;
            speedEl.classList.remove('hidden');
        } else {
            speedEl.classList.add('hidden');
        }
    }
}

/**
 * Starts the piece dropping interval.
 */
function startDropInterval() {
    const dropDelay = getCurrentDropDelay();
    if (dropIntervalId) clearInterval(dropIntervalId);
    dropIntervalId = setInterval(gameTick, dropDelay);
}

/**
 * Restarts the drop interval after a level change.
 */
function restartDropInterval() {
    if (isPlaying && !isPaused) {
        startDropInterval();
    }
}

// --- GAME CONTROL ---

/**
 * Initializes and starts a new game.
 */
function startGame() {
    if (isPlaying) return;

    // Reset state
    createBoard();
    score = 0;
    lines = 0;
    level = 1;
    updateStats();

    // Setup initial pieces
    currentPiece = getRandomPiece();
    nextPiece = getRandomPiece();
    drawNextPiece();

    isPlaying = true;
    isPaused = false;
    statusEl.textContent = 'GAME ON!';
    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');

    drawBoard();
    startDropInterval();
    attachInputHandlers();
}

/**
 * Pauses the game.
 */
function pauseGame() {
    if (!isPlaying) return;

    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(dropIntervalId);
        dropIntervalId = null;
        statusEl.textContent = 'PAUSED';
        pauseButton.textContent = 'RESUME';
    } else {
        startDropInterval();
        statusEl.textContent = 'GAME ON!';
        pauseButton.textContent = 'PAUSE';
    }
}

/**
 * Ends the game.
 */
function endGame() {
    // Check if player has SHIELD powerup
    if (shieldActive) {
        shieldActive = false;
        removePowerup('SHIELD');
        statusEl.textContent = '🛡️ SHIELD SAVED YOU!';
        
        // Clear top rows to give player breathing room
        for (let r = 0; r < 4; r++) {
            board[r] = Array(BOARD_WIDTH).fill(0);
        }
        render();
        
        // Flash board to indicate shield activation
        boardEl.style.opacity = '0.3';
        setTimeout(() => { boardEl.style.opacity = '1'; }, 200);
        
        return; // Don't actually end the game
    }
    
    isPlaying = false;
    if (dropIntervalId) clearInterval(dropIntervalId);
    dropIntervalId = null;
    
    // Clear all active powerups
    activePowerups.forEach(p => removePowerup(p.id));
    activePowerups = [];
    permanentPowerups = [];
    
    statusEl.textContent = `GAME OVER! Score: ${score}`;
    startButton.textContent = 'RESTART';
    startButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');

    // Flash the board (optional)
    boardEl.style.opacity = '0.5';
    setTimeout(() => { boardEl.style.opacity = '1'; }, 100);
    
    // Auto-save final score (no modal needed)
    if (window.saveScore && score > 0) {
        window.saveScore(score).catch(err => {
            console.log('Failed to save final score:', err);
        });
    }

    // Remove input handlers until restart
    document.removeEventListener('keydown', handleKeyDown);
    touchControls.removeEventListener('click', handleTouchControls);
}

/**
 * Shows the name input modal after game over
 */
function showNameModal(finalScore) {
    modalScore.textContent = finalScore;
    saveStatus.textContent = '';
    
    const currentName = getPlayerName();
    const canChangeName = canChangeNameToday();

    if (canChangeName) {
        // Cho phép nhập tên
        nameInputSection.classList.remove('hidden');
        nameLockedSection.classList.add('hidden');
        playerNameInput.value = currentName || '';
        playerNameInput.disabled = false;
    } else {
        // Đã đặt tên hôm nay, chỉ hiển thị
        nameInputSection.classList.add('hidden');
        nameLockedSection.classList.remove('hidden');
        currentPlayerNameEl.textContent = currentName || 'Anonymous';
    }

    // Show modal
    nameModal.classList.remove('hidden');
}

/**
 * Hides the name modal
 */
function hideNameModal() {
    nameModal.classList.add('hidden');
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
    updateStats();
}

// --- INPUT HANDLING ---

function handleKeyDown(event) {
    if (!isPlaying || isPaused) {
        if (event.key === ' ' && !isPlaying) {
            startGame();
        } else if (event.key === 'p' || event.key === 'P') {
            pauseGame();
        }
        return;
    }

    switch (event.key) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            // Soft drop
            movePiece(0, 1);
            break;
        case 'ArrowUp':
        case 'x':
            rotatePiece();
            break;
        case ' ': // Hard drop
            hardDrop();
            // Prevent the spacebar from scrolling the page
            event.preventDefault(); 
            break;
        case 'h':
        case 'H':
            // Swap current piece with held piece (if SWAP_PIECE powerup is active)
            if (hasPowerup('SWAP_PIECE')) {
                swapHeldPiece();
            }
            break;
        case 'p':
        case 'P':
            pauseGame();
            break;
    }
}

function handleTouchControls(event) {
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
            hardDrop();
            break;
    }
}

function attachInputHandlers() {
    document.addEventListener('keydown', handleKeyDown);
    touchControls.addEventListener('click', handleTouchControls);
}

// --- INITIALIZATION ---

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);

// Modal button handlers
saveScoreBtn.addEventListener('click', async () => {
    // Lưu tên nếu có thể thay đổi
    if (canChangeNameToday()) {
        const newName = playerNameInput.value.trim();
        if (newName && newName.length > 0 && newName.length <= 20) {
            savePlayerName(newName);
            console.log(`Player name saved: ${newName}`);
            
            // Update user display
            const displayName = newName;
            document.getElementById('user-id-display').textContent = `Player: ${displayName}`;
        } else if (newName.length > 20) {
            saveStatus.textContent = '❌ Name too long (max 20 characters)';
            saveStatus.className = 'text-sm text-center mt-4 text-red-400';
            return;
        }
    }

    // Disable button while saving
    saveScoreBtn.disabled = true;
    saveStatus.textContent = '⏳ Saving...';
    saveStatus.className = 'text-sm text-center mt-4 text-yellow-400';

    // Save score
    const finalScore = parseInt(modalScore.textContent);
    const saved = await window.saveScore(finalScore);

    // Re-enable button
    saveScoreBtn.disabled = false;

    // Close modal after 2 seconds if successful
    if (saved) {
        setTimeout(() => {
            hideNameModal();
        }, 2000);
    }
});

skipSaveBtn.addEventListener('click', () => {
    hideNameModal();
});

// Close modal when clicking outside
nameModal.addEventListener('click', (e) => {
    if (e.target === nameModal) {
        hideNameModal();
    }
});

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

// Initial setup for the board display (empty)
createBoard();
drawBoard(); 
drawNextPiece();
updateStats();

// Attach initial keydown listener for Start/Pause functionality
document.addEventListener('keydown', handleKeyDown);

// The loadLeaderboard function will be called automatically once Firebase auth is ready.

