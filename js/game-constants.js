// --- GAME CONSTANTS ---
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const NEXT_GRID_SIZE = 4;
export const SCORE_PER_LINE = 10;
export const LINES_PER_LEVEL = 10;
export const INITIAL_DROP_DELAY = 1000; // ms

// Tetromino shapes and their colors (color index 1-7)
export const SHAPES = [
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
export const COLORS = [
    null, // Index 0 is reserved for empty space
    'color-1', // T: Pink
    'color-2', // I: Cyan
    'color-3', // J: Lime Green
    'color-4', // L: Orange
    'color-5', // O: Yellow
    'color-6', // S: Red
    'color-7', // Z: Blue Violet
];
