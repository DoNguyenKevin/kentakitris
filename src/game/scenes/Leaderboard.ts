// src/game/scenes/Leaderboard.ts
// ======================================================
// ✅ Leaderboard Scene - Bảng xếp hạng người chơi
// 
// Scene này hiển thị:
// - Top 10 người chơi có điểm cao nhất
// - Medals cho top 3 (🥇🥈🥉)
// - Highlight người chơi hiện tại
// - Nút "Back to Menu"
// 
// 🏆 Leaderboard = Bảng xếp hạng
//    Cho phép người chơi xem ai giỏi nhất!
// ======================================================

import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

// 🏆 Cấu trúc dữ liệu cho 1 entry trong leaderboard
// ======================================================
interface LeaderboardEntry {
    playerName: string;  // Tên người chơi
    score: number;       // Điểm số
    lines: number;       // Số hàng đã xóa
    level: number;       // Level đạt được
    timestamp: number;   // Thời gian chơi (milliseconds)
}

// 🔧 Hằng số (Constants)
// ======================================================
const DEFAULT_PLAYER_NAME = 'Anonymous';  // Tên mặc định nếu không có tên
const LEADERBOARD_KEY = 'kentakitris-leaderboard';  // Key trong localStorage
const MAX_ENTRIES = 100;  // Số entry tối đa lưu trữ

/**
 * ✅ Leaderboard Scene - Bảng xếp hạng
 * 
 * Scene này hiển thị top 10 người chơi tốt nhất
 * Dữ liệu lưu trong localStorage (không mất khi tắt trình duyệt)
 * 
 * 🎮 Scene = Màn hình trong game
 * Mỗi scene là 1 màn hình khác nhau: Menu, Game, GameOver, Leaderboard...
 */
export class Leaderboard extends Scene {
    // 📹 Camera
    camera: Phaser.Cameras.Scene2D.Camera;
    
    // 📝 Text objects
    titleText: Phaser.GameObjects.Text;
    backText: Phaser.GameObjects.Text;
    
    // 📊 Leaderboard data
    leaderboardData: LeaderboardEntry[];
    
    constructor() {
        super('Leaderboard');
    }

    /**
     * ✅ create() - Tạo màn hình leaderboard
     * 
     * Các bước:
     * 1. Đặt màu nền
     * 2. Hiển thị tiêu đề "🏆 LEADERBOARD"
     * 3. Load dữ liệu từ localStorage
     * 4. Hiển thị top 10 entries
     * 5. Thêm nút "Back to Menu"
     * 6. Lắng nghe click chuột
     * 
     * 💾 localStorage = Kho lưu trữ trên trình duyệt
     *    Dữ liệu không mất khi tắt trình duyệt!
     */
    create() {
        // 📹 Thiết lập camera và màu nền
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x0d0d1a); // Xanh đen

        // 🏆 Tiêu đề "LEADERBOARD"
        this.titleText = this.add.text(512, 80, '🏆 LEADERBOARD 🏆', {
            fontFamily: 'Arial Black',
            fontSize: '48px',
            color: '#FFD700',      // Màu vàng
            stroke: '#000000',     // Viền đen
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // 📊 Load dữ liệu từ localStorage
        this.leaderboardData = this.loadLeaderboard();

        // 🎨 Hiển thị leaderboard entries
        this.renderLeaderboard();

        // 🔙 Nút "Back to Menu"
        this.backText = this.add.text(512, 700, '⬅ Back to Menu', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#00FF88',  // Màu xanh lá
            align: 'center'
        }).setOrigin(0.5);

        // ✨ Hiệu ứng nhấp nháy cho nút back
        this.tweens.add({
            targets: this.backText,
            alpha: 0.5,        // Mờ xuống 50%
            duration: 800,     // Trong 0.8 giây
            yoyo: true,        // Quay lại
            repeat: -1         // Lặp mãi
        });

        // 🖱️ Lắng nghe click vào nút back
        this.backText.setInteractive({ useHandCursor: true });
        this.backText.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // 📡 Thông báo: Scene sẵn sàng!
        EventBus.emit('current-scene-ready', this);
    }

    /**
     * ✅ loadLeaderboard() - Load dữ liệu từ localStorage
     * 
     * Đọc danh sách điểm từ localStorage và sắp xếp
     * 
     * Cách hoạt động:
     * 1. Đọc dữ liệu từ localStorage key 'kentakitris-leaderboard'
     * 2. Parse JSON string thành array
     * 3. Sắp xếp theo điểm giảm dần (cao nhất lên đầu)
     * 4. Lấy top 10 entries
     * 
     * Trả về: Array của LeaderboardEntry (max 10 entries)
     * 
     * ❓ Câu hỏi: Tại sao dùng JSON.parse()?
     * 💡 Trả lời: Vì localStorage chỉ lưu được text (string)!
     *            Phải chuyển text → object bằng JSON.parse()
     */
    loadLeaderboard(): LeaderboardEntry[] {
        try {
            // 📖 Đọc dữ liệu từ localStorage
            const dataString = localStorage.getItem(LEADERBOARD_KEY);
            
            // Nếu chưa có dữ liệu → trả về mảng rỗng
            if (!dataString) {
                console.log('📊 Chưa có dữ liệu leaderboard');
                return [];
            }

            // 🔄 Chuyển string → array
            const parsed = JSON.parse(dataString);
            
            // ✅ Validate: Kiểm tra dữ liệu có đúng định dạng không
            if (!Array.isArray(parsed)) {
                console.warn('⚠️ Dữ liệu leaderboard không phải array, reset về rỗng');
                return [];
            }
            
            // ✅ Filter: Chỉ giữ entries hợp lệ
            const data: LeaderboardEntry[] = parsed.filter(entry => {
                return entry &&
                    typeof entry.playerName === 'string' &&
                    typeof entry.score === 'number' &&
                    typeof entry.lines === 'number' &&
                    typeof entry.level === 'number' &&
                    typeof entry.timestamp === 'number';
            });

            // 📊 Sắp xếp theo điểm giảm dần (cao nhất lên đầu)
            // sort() = sắp xếp mảng
            // (a, b) => b.score - a.score = sắp xếp giảm dần
            data.sort((a, b) => b.score - a.score);

            // 🔟 Lấy top 10 (slice = cắt mảng)
            return data.slice(0, 10);

        } catch (error) {
            console.error('❌ Lỗi khi load leaderboard:', error);
            return [];
        }
    }

    /**
     * ✅ renderLeaderboard() - Hiển thị leaderboard entries
     * 
     * Vẽ từng entry lên màn hình
     * 
     * Cách hoạt động:
     * 1. Duyệt qua từng entry (forEach)
     * 2. Tạo text cho rank, tên, điểm
     * 3. Thêm medal cho top 3 (🥇🥈🥉)
     * 4. Tô màu khác cho từng hạng
     * 
     * 🎨 forEach = Lặp qua từng phần tử trong mảng
     *    Ví dụ: [1,2,3].forEach(x => console.log(x))
     *            → In ra: 1, 2, 3
     */
    renderLeaderboard() {
        const startY = 180;  // Vị trí y bắt đầu
        const spacing = 45;  // Khoảng cách giữa các entry

        // 📊 Kiểm tra: Có dữ liệu không?
        if (this.leaderboardData.length === 0) {
            // Không có dữ liệu → Hiển thị thông báo
            this.add.text(512, 350, 'No scores yet!\nPlay the game to set a record!', {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#888888',
                align: 'center'
            }).setOrigin(0.5);
            return;
        }

        // 🎨 Vẽ header (tiêu đề cột)
        this.add.text(150, startY - 40, 'RANK', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFD700',
        });
        this.add.text(300, startY - 40, 'NAME', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFD700',
        });
        this.add.text(600, startY - 40, 'SCORE', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFD700',
        });
        this.add.text(750, startY - 40, 'LINES', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFD700',
        });

        // 🔄 Vẽ từng entry
        this.leaderboardData.forEach((entry, index) => {
            const y = startY + index * spacing;

            // 🏅 Thêm medal cho top 3
            let medal = '';
            let rankColor = '#FFFFFF';  // Màu trắng mặc định
            
            if (index === 0) {
                medal = '🥇';
                rankColor = '#FFD700';  // Vàng
            } else if (index === 1) {
                medal = '🥈';
                rankColor = '#C0C0C0';  // Bạc
            } else if (index === 2) {
                medal = '🥉';
                rankColor = '#CD7F32';  // Đồng
            }

            // 📝 Vẽ rank (hạng)
            this.add.text(150, y, `${medal} #${index + 1}`, {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: rankColor,
            });

            // 📝 Vẽ tên
            const nameText = entry.playerName || DEFAULT_PLAYER_NAME;
            this.add.text(300, y, nameText, {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#FFFFFF',
            });

            // 📝 Vẽ điểm
            this.add.text(600, y, entry.score.toString(), {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#00FF88',  // Xanh lá
            });

            // 📝 Vẽ số hàng
            this.add.text(750, y, entry.lines.toString(), {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#888888',  // Xám
            });
        });
    }

    /**
     * ✅ saveScore() - Lưu điểm vào localStorage
     * 
     * Hàm static để lưu điểm mới vào leaderboard
     * Được gọi từ Game scene khi game over
     * 
     * Tham số:
     * - score: điểm số
     * - lines: số hàng đã xóa
     * - level: level đạt được
     * - playerName: tên người chơi (optional)
     * 
     * Cách hoạt động:
     * 1. Load leaderboard hiện tại
     * 2. Thêm entry mới vào
     * 3. Sắp xếp lại theo điểm
     * 4. Lưu lại vào localStorage
     * 
     * ❓ Câu hỏi: Tại sao là hàm static?
     * 💡 Trả lời: Vì gọi từ scene khác mà không cần tạo instance!
     *            Ví dụ: Leaderboard.saveScore(100, 10, 1)
     */
    static saveScore(score: number, lines: number, level: number, playerName: string = DEFAULT_PLAYER_NAME) {
        try {
            // 📖 Load leaderboard hiện tại
            const dataString = localStorage.getItem(LEADERBOARD_KEY);
            let data: LeaderboardEntry[] = [];
            
            // ✅ Parse và validate dữ liệu hiện có
            if (dataString) {
                try {
                    const parsed = JSON.parse(dataString);
                    if (Array.isArray(parsed)) {
                        // Filter để chỉ giữ entries hợp lệ
                        data = parsed.filter(entry => {
                            return entry &&
                                typeof entry.playerName === 'string' &&
                                typeof entry.score === 'number' &&
                                typeof entry.lines === 'number' &&
                                typeof entry.level === 'number' &&
                                typeof entry.timestamp === 'number';
                        });
                    }
                } catch (parseError) {
                    console.warn('⚠️ Không parse được dữ liệu cũ, bắt đầu mới');
                }
            }

            // ➕ Thêm entry mới
            const newEntry: LeaderboardEntry = {
                playerName: playerName,
                score: score,
                lines: lines,
                level: level,
                timestamp: Date.now()  // Thời gian hiện tại (milliseconds)
            };

            data.push(newEntry);

            // 📊 Sắp xếp lại theo điểm giảm dần
            data.sort((a, b) => b.score - a.score);

            // 🔟 Giữ tối đa MAX_ENTRIES (để không quá nặng)
            data = data.slice(0, MAX_ENTRIES);

            // 💾 Lưu lại vào localStorage
            localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));

            console.log('✅ Đã lưu điểm vào leaderboard:', newEntry);

        } catch (error) {
            console.error('❌ Lỗi khi lưu điểm:', error);
        }
    }

    /**
     * ✅ changeScene() - Quay lại MainMenu
     * 
     * Method này có thể gọi từ ngoài (ví dụ từ React)
     */
    changeScene() {
        this.scene.start('MainMenu');
    }
}
