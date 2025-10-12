// js/game-state.js
// ======================================================
// ✅ File này quản lý TRẠNG THÁI của game
// Trạng thái = tình trạng hiện tại của game
// Ví dụ: Điểm bao nhiêu? Đang chơi hay đã dừng? Board như thế nào?
// ======================================================

import { BOARD_WIDTH, BOARD_HEIGHT } from './game-constants.js';

// --- TRẠNG THÁI GAME ---

// ✅ Board = bàn chơi (mảng 2 chiều: 20 hàng x 10 cột)
// Mỗi ô có giá trị 0 (trống) hoặc 1-7 (có màu)
export let board = [];

// ✅ currentPiece = mảnh đang rơi hiện tại
// null = chưa có mảnh nào
export let currentPiece = null;

// ✅ nextPiece = mảnh tiếp theo sẽ xuất hiện
export let nextPiece = null;

// ✅ score = điểm số hiện tại
export let score = 0;

// ✅ lines = số hàng đã xóa
export let lines = 0;

// ✅ level = cấp độ hiện tại (càng cao càng nhanh!)
export let level = 1;

// ✅ isPlaying = đang chơi không? (true/false)
export let isPlaying = false;

// ✅ isPaused = đang tạm dừng không? (true/false)
export let isPaused = false;

// ✅ dropIntervalId = ID của bộ đếm thời gian (timer)
// Dùng để dừng/khởi động lại timer khi cần
export let dropIntervalId = null;

// ✅ difficulty = độ khó đã chọn
export let difficulty = 'normal'; // Mặc định là bình thường

// ✅ energyBlocks = các khối năng lượng đang rơi (cho Hard/Impossible)
export let energyBlocks = [];

// ✅ isMouseFrozen = chuột có bị đóng băng không (cho Impossible)
export let isMouseFrozen = false;

// --- HÀM TẠO VÀ QUẢN LÝ ---

/**
 * ✅ Tạo một bàn chơi trống
 * Mục tiêu: Làm board thành mảng 20 hàng x 10 cột, mỗi ô = 0
 * 
 * Giải thích:
 * - Array.from() tạo mảng mới
 * - { length: BOARD_HEIGHT } = tạo 20 hàng
 * - () => Array(BOARD_WIDTH).fill(0) = mỗi hàng có 10 ô giá trị 0
 * 
 * Try it: Gọi createBoard() rồi console.log(board) để xem!
 */
export function createBoard() {
    board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
}

/**
 * ✅ Reset (đặt lại) toàn bộ trạng thái game về ban đầu
 * Mục tiêu: Khi bắt đầu game mới, mọi thứ về 0
 * 
 * Điều gì xảy ra:
 * - Board trở về trống rỗng
 * - Điểm, lines, level về 0/1
 * - Dừng bộ đếm thời gian (nếu có)
 * - Đặt isPlaying = false
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
    energyBlocks = [];
    isMouseFrozen = false;
    if (dropIntervalId) {
        clearInterval(dropIntervalId); // Dừng timer
    }
    dropIntervalId = null;
}

// --- CÁC HÀM CẬP NHẬT (SETTERS) ---
// ✅ Những hàm này giúp thay đổi giá trị của biến state
// Tại sao cần? Để các file khác có thể cập nhật state một cách an toàn!

/**
 * Cập nhật mảnh đang rơi hiện tại
 */
export function setCurrentPiece(piece) {
    currentPiece = piece;
}

/**
 * Cập nhật mảnh tiếp theo
 */
export function setNextPiece(piece) {
    nextPiece = piece;
}

/**
 * Cập nhật điểm số
 * Ví dụ: setScore(100)
 */
export function setScore(newScore) {
    score = newScore;
}

/**
 * Cập nhật số hàng đã xóa
 */
export function setLines(newLines) {
    lines = newLines;
}

/**
 * Cập nhật cấp độ
 */
export function setLevel(newLevel) {
    level = newLevel;
}

/**
 * Cập nhật trạng thái đang chơi
 */
export function setIsPlaying(value) {
    isPlaying = value;
}

/**
 * Cập nhật trạng thái tạm dừng
 */
export function setIsPaused(value) {
    isPaused = value;
}

/**
 * Cập nhật ID của bộ đếm thời gian
 */
export function setDropIntervalId(id) {
    dropIntervalId = id;
}

/**
 * Cập nhật độ khó
 */
export function setDifficulty(newDifficulty) {
    difficulty = newDifficulty;
}

/**
 * Thêm khối năng lượng
 */
export function addEnergyBlock(block) {
    energyBlocks.push(block);
}

/**
 * Xóa khối năng lượng
 */
export function removeEnergyBlock(index) {
    energyBlocks.splice(index, 1);
}

/**
 * Đặt trạng thái đóng băng chuột
 */
export function setIsMouseFrozen(value) {
    isMouseFrozen = value;
}

// ❓ Câu hỏi: Tại sao không thay đổi biến trực tiếp?
// 💡 Trả lời: Dùng setter giúp code rõ ràng hơn và dễ debug!
//            Nếu có lỗi, ta biết hàm nào đã thay đổi biến.
