import { BOARD_WIDTH, BOARD_HEIGHT, NEXT_GRID_SIZE, COLORS } from './game-constants.js';
import { board, currentPiece, nextPiece } from './game-state.js';

// --- DOM ELEMENTS ---
const boardEl = document.getElementById('game-board');
const nextPieceEl = document.getElementById('next-piece-display');

/**
 * Draws the game board state onto the DOM.
 */
export function drawBoard() {
    boardEl.innerHTML = '';
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            const block = document.createElement('div');
            block.classList.add('block');
            
            if (cell !== 0) {
                block.classList.add(COLORS[cell]);
            } else {
                block.classList.add('bg-gray-900');
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
export function drawPiece(piece) {
    piece.shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell !== 0) {
                const boardY = piece.y + r;
                const boardX = piece.x + c;
                
                // Only draw blocks that are within the visible board
                if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                    const index = boardY * BOARD_WIDTH + boardX;
                    const block = boardEl.children[index];
                    
                    if (block) {
                        block.className = 'block';
                        block.classList.add(COLORS[piece.color]);
                    }
                }
            }
        });
    });
}

/**
 * Draws the next piece in the side panel.
 */
export function drawNextPiece() {
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
                if (cell !== 0) {
                    const gridRow = startRow + r;
                    const gridCol = startCol + c;
                    const index = gridRow * NEXT_GRID_SIZE + gridCol;
                    const block = nextPieceEl.children[index];
                    
                    if (block) {
                        block.className = 'block w-1/4 h-1/4 border-gray-800';
                        block.classList.add(COLORS[nextPiece.color]);
                    }
                }
            });
        });
    }
}

/**
 * Creates animated score particles that fly out from cleared lines
 * @param {number} points - Points earned
 * @param {number} rowIndex - The row index where lines were cleared
 * @param {number} linesCleared - Number of lines cleared
 */
export function createScoreParticles(points, rowIndex, linesCleared) {
    const boardRect = boardEl.getBoundingClientRect();
    const particleCount = linesCleared * 4 + 2; // More particles for more lines
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('score-particle');
        
        // Show points divided among particles or special messages
        let displayText = '';
        if (i === 0) {
            if (linesCleared === 4) {
                displayText = '🎉 TETRIS!';
            } else if (linesCleared === 3) {
                displayText = '🔥 TRIPLE!';
            } else if (linesCleared === 2) {
                displayText = '✨ DOUBLE!';
            } else {
                displayText = `+${points}`;
            }
        } else if (i < particleCount / 2) {
            displayText = `+${Math.floor(points / (particleCount / 2))}`;
        } else {
            displayText = '⭐';
        }
        
        particle.textContent = displayText;
        
        // Random position within the board horizontally, at the cleared line vertically
        const startX = Math.random() * boardRect.width;
        const startY = (rowIndex / BOARD_HEIGHT) * boardRect.height;
        
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        // Random trajectory for each particle - create explosion effect
        const angle = (Math.random() * 2 * Math.PI); // Full circle
        const distance = 40 + Math.random() * 120; // Random distance
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 30; // Slight upward bias
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        // Add slight delay for staggered effect
        particle.style.animationDelay = `${Math.random() * 0.1}s`;
        
        document.querySelector('.board-container').appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 1300 + (Math.random() * 100));
    }
}

/**
 * Flashes the cleared lines before removing them
 * @param {array} clearedRows - Array of row indices that were cleared
 */
export function flashClearedLines(clearedRows) {
    clearedRows.forEach(rowIndex => {
        for (let c = 0; c < BOARD_WIDTH; c++) {
            const index = rowIndex * BOARD_WIDTH + c;
            const block = boardEl.children[index];
            if (block) {
                block.style.animation = 'flash 0.3s ease-in-out 2';
            }
        }
    });
}

/**
 * Updates score and level displays.
 * @param {number} score - Current score
 * @param {number} level - Current level
 * @param {number} speed - Current drop speed in ms (optional)
 */
export function updateStats(score, level, speed) {
    const scoreEl = document.getElementById('score-display');
    const levelEl = document.getElementById('level-display');
    const speedEl = document.getElementById('speed-display');
    
    scoreEl.textContent = score;
    levelEl.textContent = level;
    
    // Update speed display if provided and settings allow it
    if (speed !== undefined && speedEl) {
        const showSpeed = localStorage.getItem('showSpeed') === 'true';
        if (showSpeed) {
            speedEl.textContent = `(${speed}ms)`;
            speedEl.classList.remove('hidden');
        } else {
            speedEl.classList.add('hidden');
        }
    }
}
