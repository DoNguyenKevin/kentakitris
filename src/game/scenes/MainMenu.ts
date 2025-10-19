// src/game/scenes/MainMenu.ts
// ======================================================
// ✅ MainMenu Scene - Menu chính của game
// 
// Scene này hiển thị:
// - Tiêu đề game
// - Nút "Click to Start"
// - Hướng dẫn điều khiển
// 
// Khi click chuột → Chuyển sang Game scene
// 
// 🎬 Menu = Màn hình đầu tiên người chơi thấy
// ======================================================

import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { 
    DIFFICULTY_LEVELS, 
    DIFFICULTY_CONFIG, 
    DEFAULT_DIFFICULTY,
    DIFFICULTY_STORAGE_KEY
} from '../constants/DifficultyConstants';

/**
 * ✅ MainMenu Scene - Menu chính
 * 
 * Scene này chờ người chơi click để bắt đầu chơi
 */
export class MainMenu extends Scene
{
    // 📹 Camera
    camera: Phaser.Cameras.Scene2D.Camera;
    
    // 📝 Text objects
    logoText: Phaser.GameObjects.Text;   // Tiêu đề game
    startText: Phaser.GameObjects.Text;  // Nút start (nhấp nháy)
    leaderboardText: Phaser.GameObjects.Text; // Nút leaderboard
    
    // 🎮 Difficulty selection
    selectedDifficulty: DIFFICULTY_LEVELS;   // Độ khó đã chọn
    difficultyButtons: Phaser.GameObjects.Text[]; // Các nút chọn độ khó
    difficultyButtonMap: Map<Phaser.GameObjects.Text, DIFFICULTY_LEVELS>; // Map button → difficulty

    constructor ()
    {
        super('MainMenu');
    }

    /**
     * ✅ create() - Tạo menu
     * 
     * Các bước:
     * 1. Đặt màu nền
     * 2. Tạo tiêu đề game (lớn, vàng)
     * 3. Tạo subtitle
     * 4. Tạo UI chọn độ khó (4 buttons)
     * 5. Tạo nút "Click to Start" (nhấp nháy)
     * 6. Tạo nút "Leaderboard"
     * 7. Hiển thị hướng dẫn phím
     * 8. Lắng nghe click chuột
     * 
     * 💡 Tween = Animation (hiệu ứng chuyển động)
     */
    create ()
    {
        // 📹 Thiết lập camera và màu nền
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x0d0d1a); // Xanh đen

        // 🎮 Load difficulty đã lưu hoặc dùng mặc định
        // localStorage = Lưu trữ dữ liệu trên máy người chơi
        const savedDifficulty = localStorage.getItem(DIFFICULTY_STORAGE_KEY) as DIFFICULTY_LEVELS;
        this.selectedDifficulty = savedDifficulty || DEFAULT_DIFFICULTY;

        // 🏆 Tiêu đề game
        this.logoText = this.add.text(512, 150, '🎮 KENTAKITRIS 🎮', {
            fontFamily: 'Arial Black', 
            fontSize: '64px', 
            color: '#FFD700',      // Màu vàng
            stroke: '#000000',     // Viền đen
            strokeThickness: 8,    // Độ dày viền
            align: 'center'
        }).setOrigin(0.5); // Căn giữa

        // 📝 Subtitle (dòng chữ nhỏ)
        this.add.text(512, 230, 'A Tetris Game with Phaser', {
            fontFamily: 'Arial', 
            fontSize: '24px', 
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        // 🎯 Tạo UI chọn độ khó
        this.createDifficultySelection();

        // 🎮 Nút "Click to Start"
        this.startText = this.add.text(512, 480, 'Click to Start', {
            fontFamily: 'Arial', 
            fontSize: '32px', 
            color: '#00FF88',  // Màu xanh lá
            align: 'center'
        }).setOrigin(0.5);

        // ✨ Hiệu ứng nhấp nháy (blink)
        // Làm text mờ dần rồi sáng lại, lặp mãi
        this.tweens.add({
            targets: this.startText,  // Áp dụng cho startText
            alpha: 0.3,               // Độ trong suốt giảm xuống 30%
            duration: 1000,           // Trong 1 giây
            yoyo: true,               // Quay lại (mờ → sáng → mờ...)
            repeat: -1                // Lặp mãi (-1 = vô hạn)
        });

        // 🏆 Nút "Leaderboard"
        this.leaderboardText = this.add.text(512, 550, '🏆 Leaderboard', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#FFD700',  // Màu vàng
            align: 'center'
        }).setOrigin(0.5);

        // 🖱️ Cho phép click vào nút Leaderboard
        this.leaderboardText.setInteractive({ useHandCursor: true });
        this.leaderboardText.on('pointerdown', () => {
            this.scene.start('Leaderboard');
        });

        // ✨ Hiệu ứng hover (phóng to khi di chuột vào)
        this.leaderboardText.on('pointerover', () => {
            this.leaderboardText.setScale(1.1);  // Phóng to 110%
        });
        this.leaderboardText.on('pointerout', () => {
            this.leaderboardText.setScale(1.0);  // Về kích thước bình thường
        });
        
        // ⚙️ Nút "Settings"
        const settingsText = this.add.text(512, 600, '⚙️ Settings', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#AAAAAA',  // Màu xám
            align: 'center'
        }).setOrigin(0.5);

        // 🖱️ Cho phép click vào nút Settings
        settingsText.setInteractive({ useHandCursor: true });
        settingsText.on('pointerdown', () => {
            this.scene.pause('MainMenu');
            this.scene.launch('Settings', { previousScene: 'MainMenu' });
        });

        // ✨ Hiệu ứng hover
        settingsText.on('pointerover', () => {
            settingsText.setScale(1.1);
            settingsText.setColor('#FFFFFF');
        });
        settingsText.on('pointerout', () => {
            settingsText.setScale(1.0);
            settingsText.setColor('#AAAAAA');
        });

        // 📖 Hướng dẫn phím
        this.add.text(512, 650, 'Controls:', {
            fontFamily: 'Arial', 
            fontSize: '20px', 
            color: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 685, '← → : Move  |  ↑ : Rotate  |  SPACE : Drop', {
            fontFamily: 'Arial', 
            fontSize: '16px', 
            color: '#AAAAAA',  // Màu xám
            align: 'center'
        }).setOrigin(0.5);
        
        this.add.text(512, 710, 'P / ESC : Pause', {
            fontFamily: 'Arial', 
            fontSize: '16px', 
            color: '#AAAAAA',  // Màu xám
            align: 'center'
        }).setOrigin(0.5);

        // 🖱️ Lắng nghe click chuột (chỉ 1 lần)
        // once = Chỉ lắng nghe 1 lần (không lặp)
        this.input.once('pointerdown', () => {
            this.changeScene(); // Chuyển sang Game scene
        });

        // 📡 Thông báo: Scene sẵn sàng!
        EventBus.emit('current-scene-ready', this);
    }
    
    /**
     * ✅ createDifficultySelection() - Tạo UI chọn độ khó
     * 
     * Mục tiêu: Hiển thị 4 nút để chọn độ khó
     * 
     * Cách hoạt động:
     * 1. Tạo tiêu đề "Select Difficulty"
     * 2. Lặp qua 4 độ khó (Easy, Normal, Hard, Impossible)
     * 3. Tạo nút cho mỗi độ khó
     * 4. Highlight nút đã chọn
     * 5. Cho phép click để thay đổi lựa chọn
     * 
     * Try it: Click vào các nút để thấy màu thay đổi!
     * 
     * ❓ Câu hỏi: Tại sao dùng Object.values()?
     * 💡 Trả lời: Để lấy tất cả giá trị trong DIFFICULTY_LEVELS!
     *            Giống như lấy tất cả đồ chơi ra khỏi hộp!
     */
    createDifficultySelection() {
        // 📝 Tiêu đề
        this.add.text(512, 290, 'Select Difficulty:', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);

        // 🎯 Vị trí bắt đầu cho các nút
        const startX = 512 - 180; // Bắt đầu từ bên trái
        const y = 340;
        const buttonSpacing = 120; // Khoảng cách giữa các nút

        // 📋 Lấy danh sách tất cả độ khó
        const difficulties = Object.values(DIFFICULTY_LEVELS);
        this.difficultyButtons = [];
        this.difficultyButtonMap = new Map(); // ✅ Type-safe map

        // 🔄 Tạo nút cho mỗi độ khó
        difficulties.forEach((difficulty, index) => {
            const config = DIFFICULTY_CONFIG[difficulty];
            const x = startX + index * buttonSpacing;

            // 🎨 Tạo nút text
            const button = this.add.text(x, y, config.displayName, {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#FFFFFF',
                backgroundColor: '#333333',
                padding: { x: 12, y: 8 }
            }).setOrigin(0.5);

            // 🖱️ Cho phép click
            button.setInteractive({ useHandCursor: true });

            // 📍 Lưu difficulty vào map (type-safe!)
            this.difficultyButtonMap.set(button, difficulty);

            // 🎯 Xử lý click
            button.on('pointerdown', () => {
                this.selectDifficulty(difficulty);
            });

            // ✨ Hiệu ứng hover
            button.on('pointerover', () => {
                if (this.selectedDifficulty !== difficulty) {
                    button.setScale(1.1);
                }
            });
            button.on('pointerout', () => {
                if (this.selectedDifficulty !== difficulty) {
                    button.setScale(1.0);
                }
            });

            this.difficultyButtons.push(button);
        });

        // ✅ Highlight nút đã chọn
        this.updateDifficultyButtons();
    }

    /**
     * ✅ selectDifficulty() - Chọn độ khó
     * 
     * Mục tiêu: Cập nhật độ khó đã chọn và highlight nút
     * 
     * Tham số:
     * - difficulty: Độ khó mới (EASY/NORMAL/HARD/IMPOSSIBLE)
     * 
     * Cách hoạt động:
     * 1. Lưu difficulty mới
     * 2. Lưu vào localStorage (để lần sau vẫn nhớ)
     * 3. Cập nhật màu sắc của các nút
     * 
     * Try it: Click các nút khác nhau và xem màu thay đổi!
     * 
     * ❓ Câu hỏi: Tại sao lưu vào localStorage?
     * 💡 Trả lời: Để lần sau vào game, không phải chọn lại!
     *            Giống như game nhớ settings của bạn!
     */
    selectDifficulty(difficulty: DIFFICULTY_LEVELS) {
        this.selectedDifficulty = difficulty;
        
        // 💾 Lưu vào localStorage
        localStorage.setItem(DIFFICULTY_STORAGE_KEY, difficulty);
        
        // 🎨 Cập nhật UI
        this.updateDifficultyButtons();
    }

    /**
     * ✅ updateDifficultyButtons() - Cập nhật màu nút
     * 
     * Mục tiêu: Tô màu nút đã chọn, làm mờ các nút khác
     * 
     * Cách hoạt động:
     * 1. Lặp qua tất cả nút
     * 2. Nếu nút = độ khó đã chọn → Tô màu sáng + phóng to
     * 3. Nếu không → Màu xám nhạt
     * 
     * Try it: Gọi hàm này sau khi đổi selectedDifficulty!
     */
    updateDifficultyButtons() {
        this.difficultyButtons.forEach(button => {
            // ✅ Lấy difficulty từ map (type-safe!)
            const buttonDifficulty = this.difficultyButtonMap.get(button);
            if (!buttonDifficulty) return;
            
            const config = DIFFICULTY_CONFIG[buttonDifficulty];

            if (buttonDifficulty === this.selectedDifficulty) {
                // ✅ Nút đã chọn: Màu sáng + scale lớn
                button.setStyle({
                    color: config.color,
                    backgroundColor: '#555555',
                    fontFamily: 'Arial',
                    fontSize: '18px',
                    padding: { x: 12, y: 8 }
                });
                button.setScale(1.15);
            } else {
                // 🔘 Nút chưa chọn: Màu xám
                button.setStyle({
                    color: '#AAAAAA',
                    backgroundColor: '#333333',
                    fontFamily: 'Arial',
                    fontSize: '18px',
                    padding: { x: 12, y: 8 }
                });
                button.setScale(1.0);
            }
        });
    }

    /**
     * ✅ changeScene() - Chuyển sang Game scene
     * 
     * Được gọi khi người chơi click chuột
     * Truyền difficulty đã chọn sang Game scene
     * 
     * ❓ Câu hỏi: Làm sao truyền data giữa các scene?
     * 💡 Trả lời: Dùng tham số thứ 2 của scene.start()!
     *            scene.start('Game', { difficulty: 'hard' })
     *            → Game scene nhận được { difficulty: 'hard' }
     */
    changeScene ()
    {
        // 🎮 Chuyển sang Game scene và truyền difficulty
        this.scene.start('Game', { 
            difficulty: this.selectedDifficulty 
        });
    }

    /**
     * 🗑️ moveLogo() - Legacy method (không dùng nữa)
     */
    moveLogo (reactCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        // Legacy method - no longer used
    }
}
