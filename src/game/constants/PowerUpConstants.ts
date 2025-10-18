// src/game/constants/PowerUpConstants.ts
// ======================================================
// ✅ Power-Up Constants - Hằng số cho các kỹ năng đặc biệt
// 
// File này chứa:
// - Danh sách các power-ups (Bomb, Magic Block, Reverse Gravity, Teleport, Wide Mode)
// - Cấu hình cho từng power-up
// - Interface cho power-up state
// ======================================================

/**
 * ✅ PowerUpType - Các loại power-up có trong game
 * 
 * Mỗi power-up có 1 id và chức năng riêng:
 * - BOMB: Nổ tung 3x3 khi đặt mảnh
 * - MAGIC_BLOCK: Lấp đầy khoảng trống
 * - REVERSE_GRAVITY: Đảo chiều trọng lực (mảnh bay lên)
 * - TELEPORT: Dịch chuyển tức thời mảnh đến vị trí mong muốn
 * - WIDE_MODE: Mở rộng board từ 10 → 12 cột
 */
export enum PowerUpType {
    BOMB = 'BOMB',
    MAGIC_BLOCK = 'MAGIC_BLOCK',
    REVERSE_GRAVITY = 'REVERSE_GRAVITY',
    TELEPORT = 'TELEPORT',
    WIDE_MODE = 'WIDE_MODE'
}

/**
 * ✅ PowerUpState - Trạng thái của 1 power-up
 * 
 * Cấu trúc dữ liệu chứa thông tin về power-up đang hoạt động
 */
export interface PowerUpState {
    type: PowerUpType;      // Loại power-up
    uses: number;           // Số lần sử dụng còn lại (cho Bomb, Magic Block)
    duration?: number;      // Thời gian còn lại (ms) - cho Reverse Gravity, Wide Mode
    active: boolean;        // Đang hoạt động hay không
}

/**
 * ✅ PowerUpConfig - Cấu hình cho mỗi loại power-up
 * 
 * Định nghĩa các thuộc tính cơ bản của power-up
 */
export interface PowerUpConfig {
    type: PowerUpType;
    name: string;           // Tên hiển thị (tiếng Việt)
    emoji: string;          // Icon emoji
    description: string;    // Mô tả ngắn
    color: number;          // Màu hiển thị (hex)
    defaultUses?: number;   // Số lần dùng mặc định
    defaultDuration?: number; // Thời gian hoạt động mặc định (ms)
}

/**
 * 💣 Bomb Skill Configuration
 * 
 * Khi mảnh được đặt xuống, tạo vụ nổ 3x3 xóa tất cả các ô xung quanh
 */
export const BOMB_CONFIG: PowerUpConfig = {
    type: PowerUpType.BOMB,
    name: 'Bom',
    emoji: '💣',
    description: 'Nổ tung 3x3 khi đặt mảnh',
    color: 0xFF4444,        // Màu đỏ
    defaultUses: 1          // Dùng 1 lần
};

/**
 * ✨ Magic Block Skill Configuration
 * 
 * Tự động lấp đầy các khoảng trống (gaps) trong board
 */
export const MAGIC_BLOCK_CONFIG: PowerUpConfig = {
    type: PowerUpType.MAGIC_BLOCK,
    name: 'Khối Ma Thuật',
    emoji: '✨',
    description: 'Lấp đầy khoảng trống',
    color: 0xFFD700,        // Màu vàng
    defaultUses: 1          // Dùng 1 lần
};

/**
 * 🔺 Reverse Gravity Skill Configuration
 * 
 * Đảo chiều trọng lực - mảnh bay lên thay vì rơi xuống
 */
export const REVERSE_GRAVITY_CONFIG: PowerUpConfig = {
    type: PowerUpType.REVERSE_GRAVITY,
    name: 'Đảo Trọng Lực',
    emoji: '🔺',
    description: 'Mảnh bay lên thay vì rơi',
    color: 0xFF00FF,        // Màu tím
    defaultDuration: 15000  // 15 giây
};

/**
 * 🌀 Teleport Skill Configuration
 * 
 * Cho phép click vào board để đặt mảnh ở vị trí mong muốn
 */
export const TELEPORT_CONFIG: PowerUpConfig = {
    type: PowerUpType.TELEPORT,
    name: 'Dịch Chuyển',
    emoji: '🌀',
    description: 'Click để dịch chuyển mảnh',
    color: 0x00FFFF,        // Màu cyan
    defaultUses: 1          // Dùng 1 lần
};

/**
 * 📏 Wide Mode Skill Configuration
 * 
 * Mở rộng board từ 10 cột → 12 cột
 */
export const WIDE_MODE_CONFIG: PowerUpConfig = {
    type: PowerUpType.WIDE_MODE,
    name: 'Mở Rộng',
    emoji: '📏',
    description: 'Tăng chiều rộng board',
    color: 0x00FF00,        // Màu xanh lá
    defaultDuration: 20000  // 20 giây
};

/**
 * ✅ Tất cả các power-up configs
 * 
 * Array chứa config của tất cả power-ups
 * Dùng để dễ dàng duyệt qua và tạo UI
 */
export const ALL_POWERUP_CONFIGS: PowerUpConfig[] = [
    BOMB_CONFIG,
    MAGIC_BLOCK_CONFIG,
    REVERSE_GRAVITY_CONFIG,
    TELEPORT_CONFIG,
    WIDE_MODE_CONFIG
];

/**
 * ✅ Helper function - Lấy config của power-up theo type
 * 
 * @param type - Loại power-up
 * @returns PowerUpConfig hoặc undefined
 */
export function getPowerUpConfig(type: PowerUpType): PowerUpConfig | undefined {
    return ALL_POWERUP_CONFIGS.find(config => config.type === type);
}

// ❓ Thử nghiệm: Thay defaultDuration của WIDE_MODE = 30000 → Hoạt động 30 giây!
// ❓ Thử nghiệm: Thay defaultUses của BOMB = 3 → Dùng được 3 lần!
