// src/game/scenes/Leaderboard.ts
// ======================================================
// ✅ Leaderboard Scene - Bảng xếp hạng người chơi
// 
// Scene này hiển thị:
// - Top 10 người chơi có điểm cao nhất
// - Medals cho top 3 (🥇🥈🥉)
// - Highlight người chơi hiện tại
// - Nút "Back to Menu"
// - 🔥 Realtime updates từ Firebase!
// 
// 🏆 Leaderboard = Bảng xếp hạng
//    Cho phép người chơi xem ai giỏi nhất!
// 
// 🔥 Firebase Integration:
//    Dữ liệu được lưu trên cloud, chia sẻ giữa mọi người!
// ======================================================

import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { firebaseService, LeaderboardEntry } from '../services/FirebaseService';

// 🔧 Hằng số (Constants)
// ======================================================
const DEFAULT_PLAYER_NAME = 'Anonymous';  // Tên mặc định nếu không có tên

/**
 * ✅ Leaderboard Scene - Bảng xếp hạng
 * 
 * Scene này hiển thị top 10 người chơi tốt nhất
 * Dữ liệu được lưu trên Firebase Realtime Database
 * 
 * 🎮 Scene = Màn hình trong game
 * Mỗi scene là 1 màn hình khác nhau: Menu, Game, GameOver, Leaderboard...
 * 
 * 🔥 Firebase Integration:
 * - Dữ liệu được đồng bộ realtime giữa tất cả người chơi
 * - Tự động update khi có điểm mới
 * - Lưu trữ trên cloud, không bị mất
 */
export class Leaderboard extends Scene {
    // 📹 Camera
    camera: Phaser.Cameras.Scene2D.Camera;
    
    // 📝 Text objects
    titleText: Phaser.GameObjects.Text;
    backText: Phaser.GameObjects.Text;
    statusText: Phaser.GameObjects.Text;  // Text hiển thị trạng thái loading/error
    
    // 📊 Leaderboard data
    leaderboardData: LeaderboardEntry[];
    
    // 🔄 Realtime subscription
    unsubscribe: (() => void) | null = null;  // Function để hủy đăng ký updates
    
    // 🎨 Text objects cho entries (để có thể update)
    entryTexts: Phaser.GameObjects.Text[] = [];
    
    constructor() {
        super('Leaderboard');
    }

    /**
     * ✅ create() - Tạo màn hình leaderboard
     * 
     * Các bước:
     * 1. Đặt màu nền
     * 2. Hiển thị tiêu đề "🏆 LEADERBOARD"
     * 3. Khởi tạo Firebase (nếu chưa)
     * 4. Subscribe để nhận updates realtime
     * 5. Thêm nút "Back to Menu"
     * 6. Lắng nghe click chuột
     * 7. Đăng ký cleanup khi scene shutdown
     * 
     * 🔥 Firebase Realtime Updates:
     *    Khi ai đó lưu điểm mới → leaderboard tự động cập nhật!
     *    Không cần refresh trang.
     */
    async create() {
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

        // 📊 Status text (hiển thị trạng thái)
        this.statusText = this.add.text(512, 350, '🔄 Đang kết nối Firebase...', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#888888',
            align: 'center'
        }).setOrigin(0.5);

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

        // 🔥 Khởi tạo Firebase và load leaderboard
        await this.initializeFirebase();

        // 🗑️ Đăng ký cleanup khi scene shutdown
        // Sự kiện 'shutdown' được gọi khi chuyển sang scene khác
        this.events.once('shutdown', () => {
            this.cleanupFirebase();
        });

        // 📡 Thông báo: Scene sẵn sàng!
        EventBus.emit('current-scene-ready', this);
    }

    /**
     * ✅ initializeFirebase() - Khởi tạo Firebase và subscribe updates
     * 
     * Kết nối với Firebase và đăng ký nhận updates realtime
     * 
     * Cách hoạt động:
     * 1. Kiểm tra Firebase đã khởi tạo chưa
     * 2. Nếu chưa → gọi firebaseService.initialize()
     * 3. Subscribe để nhận updates realtime
     * 4. Mỗi khi có update → render lại leaderboard
     * 
     * 🔄 Realtime Updates:
     *    Khi người khác lưu điểm → callback tự động được gọi!
     *    UI update ngay lập tức không cần refresh.
     * 
     * ❓ Câu hỏi: Tại sao dùng async/await?
     * 💡 Trả lời: Vì kết nối Firebase mất thời gian!
     *            async/await giúp đợi kết nối xong mới tiếp tục.
     */
    async initializeFirebase() {
        try {
            // 🔥 Khởi tạo Firebase (nếu chưa)
            if (!firebaseService.isInitialized()) {
                this.statusText.setText('🔄 Đang kết nối Firebase...');
                await firebaseService.initialize();
            }

            // 👂 Đăng ký nhận updates realtime
            // Mỗi khi database thay đổi → callback được gọi
            this.unsubscribe = firebaseService.subscribeToLeaderboard(
                (entries) => {
                    // 📊 Callback: Nhận dữ liệu mới
                    this.leaderboardData = entries;
                    
                    // 🎨 Render lại UI với dữ liệu mới
                    this.renderLeaderboard();
                    
                    // ✅ Cập nhật status
                    this.statusText.setText('');  // Xóa text loading
                },
                10  // Top 10 entries
            );

            console.log('✅ Firebase leaderboard đã sẵn sàng!');

        } catch (error) {
            console.error('❌ Lỗi khi khởi tạo Firebase:', error);
            
            // ⚠️ Hiển thị thông báo lỗi
            this.statusText.setText('❌ Không thể kết nối Firebase\nVui lòng thử lại sau');
            this.statusText.setColor('#FF0000');  // Màu đỏ
        }
    }

    /**
     * ✅ cleanupFirebase() - Dọn dẹp Firebase listener
     * 
     * Hủy đăng ký Firebase listener để tránh memory leak
     * 
     * ❓ Câu hỏi: Tại sao cần unsubscribe?
     * 💡 Trả lời: Để ngắt kết nối với Firebase!
     *            Nếu không unsubscribe → listener vẫn chạy ngầm,
     *            tốn bộ nhớ và có thể gây lỗi.
     */
    cleanupFirebase() {
        // 🔌 Hủy đăng ký Firebase updates
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
            console.log('🔌 Đã ngắt kết nối Firebase listener');
        }
    }

    /**
     * ✅ renderLeaderboard() - Hiển thị leaderboard entries
     * 
     * Vẽ từng entry lên màn hình
     * 
     * Cách hoạt động:
     * 1. Xóa các text entries cũ (nếu có)
     * 2. Duyệt qua từng entry (forEach)
     * 3. Tạo text cho rank, tên, điểm
     * 4. Thêm medal cho top 3 (🥇🥈🥉)
     * 5. Tô màu khác cho từng hạng
     * 
     * 🎨 forEach = Lặp qua từng phần tử trong mảng
     *    Ví dụ: [1,2,3].forEach(x => console.log(x))
     *            → In ra: 1, 2, 3
     * 
     * 🔄 Update: Hàm này được gọi lại mỗi khi có realtime update!
     */
    renderLeaderboard() {
        const startY = 180;  // Vị trí y bắt đầu
        const spacing = 45;  // Khoảng cách giữa các entry

        // 🗑️ Xóa các text entries cũ
        this.entryTexts.forEach(text => text.destroy());
        this.entryTexts = [];

        // 📊 Kiểm tra: Có dữ liệu không?
        if (!this.leaderboardData || this.leaderboardData.length === 0) {
            // Không có dữ liệu → Hiển thị thông báo
            const emptyText = this.add.text(512, 350, 'No scores yet!\nPlay the game to set a record!', {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#888888',
                align: 'center'
            }).setOrigin(0.5);
            this.entryTexts.push(emptyText);
            return;
        }

        // 🎨 Vẽ header (tiêu đề cột)
        const headerRank = this.add.text(150, startY - 40, 'RANK', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFD700',
        });
        const headerName = this.add.text(300, startY - 40, 'NAME', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFD700',
        });
        const headerScore = this.add.text(600, startY - 40, 'SCORE', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFD700',
        });

        this.entryTexts.push(headerRank, headerName, headerScore);

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
            const rankText = this.add.text(150, y, `${medal} #${index + 1}`, {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: rankColor,
            });

            // 📝 Vẽ tên
            const nameText = this.add.text(300, y, entry.name || DEFAULT_PLAYER_NAME, {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#FFFFFF',
            });

            // 📝 Vẽ điểm
            const scoreText = this.add.text(600, y, entry.score.toString(), {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#00FF88',  // Xanh lá
            });

            this.entryTexts.push(rankText, nameText, scoreText);
        });
    }

    /**
     * ✅ saveScore() - Lưu điểm vào Firebase
     * 
     * Hàm static để lưu điểm mới vào leaderboard
     * Được gọi từ Game scene khi game over
     * 
     * Tham số:
     * - score: điểm số
     * - playerName: tên người chơi (optional)
     * 
     * Cách hoạt động:
     * 1. Kiểm tra Firebase đã khởi tạo chưa
     * 2. Nếu chưa → khởi tạo Firebase
     * 3. Gọi firebaseService.saveScore()
     * 4. Dữ liệu tự động lưu lên cloud
     * 5. Tất cả người chơi đều thấy update realtime!
     * 
     * 🔥 Firebase Benefits:
     * - Dữ liệu lưu trên cloud (không mất khi xóa cache)
     * - Chia sẻ giữa tất cả người chơi
     * - Realtime updates tự động
     * 
     * ❓ Câu hỏi: Tại sao là hàm static?
     * 💡 Trả lời: Vì gọi từ scene khác mà không cần tạo instance!
     *            Ví dụ: Leaderboard.saveScore(100, "KHOI")
     */
    static async saveScore(score: number, playerName: string = DEFAULT_PLAYER_NAME) {
        try {
            // 🔥 Khởi tạo Firebase nếu chưa
            if (!firebaseService.isInitialized()) {
                console.log('🔥 Đang khởi tạo Firebase để lưu điểm...');
                await firebaseService.initialize();
            }

            // 💾 Lưu điểm lên Firebase
            await firebaseService.saveScore(score, playerName);

            console.log('✅ Đã lưu điểm vào Firebase leaderboard:', { score, playerName });

        } catch (error) {
            console.error('❌ Lỗi khi lưu điểm vào Firebase:', error);
            
            // ⚠️ Fallback: Vẫn có thể thêm localStorage backup nếu muốn
            console.log('💡 Gợi ý: Kiểm tra kết nối internet và thử lại');
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
