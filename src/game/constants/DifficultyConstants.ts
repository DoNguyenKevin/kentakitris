// src/game/constants/DifficultyConstants.ts
// ======================================================
// ✅ File này quản lý CẤU HÌNH ĐỘ KHÓ của game
// 
// Độ khó ảnh hưởng đến:
// - Tốc độ rơi của mảnh (nhanh hay chậm)
// - Điểm nhân được (càng khó càng nhiều điểm)
// 
// ❓ Câu hỏi: Tại sao cần nhiều độ khó?
// 💡 Trả lời: Để người chơi mới và cao thủ đều thấy vui!
//            Người mới → Easy (chậm, dễ chơi)
//            Cao thủ → Impossible (nhanh, thử thách)
// ======================================================

/**
 * ✅ Các mức độ khó có trong game
 * 
 * 4 mức độ từ dễ đến cực khó:
 * - EASY: Cho người mới bắt đầu
 * - NORMAL: Tốc độ chuẩn của Tetris
 * - HARD: Cho người có kinh nghiệm
 * - IMPOSSIBLE: Thử thách cao thủ!
 */
export enum DIFFICULTY_LEVELS {
    EASY = 'easy',
    NORMAL = 'normal',
    HARD = 'hard',
    IMPOSSIBLE = 'impossible'
}

/**
 * ✅ Cấu hình cho từng độ khó
 * 
 * Interface = Khuôn mẫu (định nghĩa cấu trúc dữ liệu)
 */
export interface DifficultyConfig {
    name: string;                   // Tên hiển thị (VD: "Dễ (Easy)")
    displayName: string;            // Tên ngắn gọn
    dropSpeedMultiplier: number;    // Hệ số nhân tốc độ rơi
    scoreMultiplier: number;        // Hệ số nhân điểm số
    color: string;                  // Màu hiển thị
    description: string;            // Mô tả độ khó
}

/**
 * ✅ Cấu hình chi tiết cho từng độ khó
 * 
 * dropSpeedMultiplier giải thích:
 * - 1.5 = Chậm hơn 1.5 lần (Easy)
 * - 1.0 = Tốc độ chuẩn (Normal)
 * - 0.8 = Nhanh hơn 1.25 lần (Hard)
 * - 0.6 = Nhanh hơn 1.67 lần (Impossible)
 * 
 * Công thức: dropDelay = (1000ms * dropSpeedMultiplier) / level
 * 
 * Ví dụ Level 1:
 * - Easy: 1000 * 1.5 / 1 = 1500ms (rơi mỗi 1.5 giây)
 * - Normal: 1000 * 1.0 / 1 = 1000ms (rơi mỗi 1 giây)
 * - Hard: 1000 * 0.8 / 1 = 800ms (rơi mỗi 0.8 giây)
 * - Impossible: 1000 * 0.6 / 1 = 600ms (rơi mỗi 0.6 giây)
 * 
 * ❓ Câu hỏi: Tại sao level càng cao, dropDelay càng nhỏ?
 * 💡 Trả lời: Vì chia cho level! Level 2 → delay giảm 1/2
 *            → Mảnh rơi nhanh gấp đôi!
 */
export const DIFFICULTY_CONFIG: Record<DIFFICULTY_LEVELS, DifficultyConfig> = {
    [DIFFICULTY_LEVELS.EASY]: {
        name: 'Dễ (Easy)',
        displayName: 'Easy',
        dropSpeedMultiplier: 1.5,        // Chậm hơn 50%
        scoreMultiplier: 0.8,            // Điểm ít hơn 20%
        color: '#00FF88',                // Màu xanh lá nhạt
        description: 'Cho người mới bắt đầu - Mảnh rơi chậm'
    },
    [DIFFICULTY_LEVELS.NORMAL]: {
        name: 'Bình thường (Normal)',
        displayName: 'Normal',
        dropSpeedMultiplier: 1.0,        // Tốc độ chuẩn
        scoreMultiplier: 1.0,            // Điểm chuẩn
        color: '#FFD700',                // Màu vàng
        description: 'Độ khó chuẩn của Tetris'
    },
    [DIFFICULTY_LEVELS.HARD]: {
        name: 'Khó (Hard)',
        displayName: 'Hard',
        dropSpeedMultiplier: 0.8,        // Nhanh hơn 25%
        scoreMultiplier: 1.3,            // Điểm nhiều hơn 30%
        color: '#FF8E0D',                // Màu cam
        description: 'Thử thách - Mảnh rơi nhanh hơn'
    },
    [DIFFICULTY_LEVELS.IMPOSSIBLE]: {
        name: 'Impossible',
        displayName: 'Impossible',
        dropSpeedMultiplier: 0.6,        // Nhanh hơn 67%
        scoreMultiplier: 1.5,            // Điểm nhiều hơn 50%
        color: '#FF0D72',                // Màu hồng sáng
        description: 'Cực khó - Chỉ dành cho cao thủ!'
    }
};

/**
 * ✅ Hằng số mặc định
 */
export const DEFAULT_DIFFICULTY = DIFFICULTY_LEVELS.NORMAL;
export const DIFFICULTY_STORAGE_KEY = 'kentakitris_difficulty'; // Key lưu trong localStorage

/**
 * ✅ Hàm lấy cấu hình độ khó
 * 
 * Mục tiêu: Lấy thông tin chi tiết của 1 độ khó
 * 
 * Tham số:
 * - difficulty: Độ khó cần lấy (VD: DIFFICULTY_LEVELS.EASY)
 * 
 * Trả về: DifficultyConfig (object chứa name, multiplier, etc.)
 * 
 * Ví dụ:
 * getDifficultyConfig(DIFFICULTY_LEVELS.EASY)
 * → { name: "Dễ (Easy)", dropSpeedMultiplier: 1.5, ... }
 * 
 * Try it: console.log(getDifficultyConfig(DIFFICULTY_LEVELS.HARD))
 */
export function getDifficultyConfig(difficulty: DIFFICULTY_LEVELS): DifficultyConfig {
    return DIFFICULTY_CONFIG[difficulty];
}

/**
 * ✅ Hàm tính dropDelay dựa trên độ khó và level
 * 
 * Mục tiêu: Tính thời gian mảnh tự động rơi (milliseconds)
 * 
 * Công thức: (1000ms * dropSpeedMultiplier) / level
 * 
 * Tham số:
 * - difficulty: Độ khó đã chọn
 * - level: Level hiện tại (1, 2, 3...)
 * 
 * Trả về: Thời gian delay (ms)
 * 
 * Ví dụ:
 * calculateDropDelay(DIFFICULTY_LEVELS.EASY, 1) → 1500ms
 * calculateDropDelay(DIFFICULTY_LEVELS.HARD, 2) → 400ms
 * 
 * ❓ Câu hỏi: Tại sao chia cho level?
 * 💡 Trả lời: Để game càng chơi càng khó!
 *            Level 1: Rơi chậm (dễ chơi)
 *            Level 10: Rơi rất nhanh (khó chơi)
 */
export function calculateDropDelay(difficulty: DIFFICULTY_LEVELS, level: number): number {
    const config = getDifficultyConfig(difficulty);
    const baseDelay = 1000; // 1000ms = 1 giây
    const delay = (baseDelay * config.dropSpeedMultiplier) / level;
    
    // ✅ Đảm bảo delay không quá nhanh (tối thiểu 50ms)
    // Vì nếu quá nhanh, người chơi không kịp nhìn!
    return Math.max(50, delay);
}

/**
 * ✅ Hàm tính điểm dựa trên độ khó
 * 
 * Mục tiêu: Nhân điểm số theo độ khó
 * 
 * Tham số:
 * - baseScore: Điểm gốc (không nhân)
 * - difficulty: Độ khó đã chọn
 * 
 * Trả về: Điểm sau khi nhân
 * 
 * Ví dụ:
 * calculateScore(100, DIFFICULTY_LEVELS.EASY) → 80
 * calculateScore(100, DIFFICULTY_LEVELS.IMPOSSIBLE) → 150
 * 
 * ❓ Câu hỏi: Tại sao Easy ít điểm hơn?
 * 💡 Trả lời: Vì dễ chơi hơn! Khó hơn = xứng đáng nhiều điểm hơn!
 */
export function calculateScore(baseScore: number, difficulty: DIFFICULTY_LEVELS): number {
    const config = getDifficultyConfig(difficulty);
    return Math.floor(baseScore * config.scoreMultiplier);
}

// ❓ Thử nghiệm:
// Try it: Thay đổi các con số multiplier và xem game thay đổi thế nào!
// - Tăng dropSpeedMultiplier của EASY lên 2.0 → Chậm gấp đôi!
// - Giảm dropSpeedMultiplier của IMPOSSIBLE xuống 0.3 → Cực nhanh!
