// src/game/scenes/GameOver.ts
// ======================================================
// ✅ GameOver Scene - Màn hình game over
// 
// Scene này hiển thị khi người chơi thua:
// - Chữ "GAME OVER" màu đỏ
// - Điểm số cuối cùng
// - Nút "Click to Play Again"
// 
// Khi click chuột → Quay lại MainMenu
// 
// 💀 Game Over = Thua game (không còn chỗ để mảnh mới spawn)
// ======================================================

import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

/**
 * ✅ GameOver Scene - Màn hình kết thúc
 * 
 * Scene này nhận điểm số từ Game scene và hiển thị
 */
export class GameOver extends Scene
{
    // 📹 Camera
    camera: Phaser.Cameras.Scene2D.Camera;
    
    // 📝 Text objects
    gameOverText: Phaser.GameObjects.Text;  // Chữ "GAME OVER"
    scoreText: Phaser.GameObjects.Text;     // Điểm số
    restartText: Phaser.GameObjects.Text;   // Nút restart (nhấp nháy)
    leaderboardText: Phaser.GameObjects.Text; // Nút leaderboard

    constructor ()
    {
        super('GameOver');
    }

    /**
     * ✅ create() - Tạo màn hình game over
     * 
     * Tham số:
     * - data: { score: number } - Điểm số từ Game scene
     * 
     * Các bước:
     * 1. Đặt màu nền
     * 2. Hiển thị "GAME OVER" (đỏ, lớn)
     * 3. Hiển thị điểm số
     * 4. Hiển thị nút restart (nhấp nháy)
     * 5. Hiển thị nút "View Leaderboard"
     * 6. Lắng nghe click chuột
     * 
     * 📦 data = Dữ liệu truyền từ scene khác
     *    Ví dụ: this.scene.start('GameOver', { score: 100 })
     */
    create (data: { score: number })
    {
        // 📹 Thiết lập camera và màu nền
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x0d0d1a); // Xanh đen

        // 💀 Chữ "GAME OVER"
        this.gameOverText = this.add.text(512, 250, 'GAME OVER', {
            fontFamily: 'Arial Black', 
            fontSize: '64px', 
            color: '#FF0000',      // Màu đỏ
            stroke: '#000000',     // Viền đen
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // 🏆 Điểm số cuối cùng
        const finalScore = data.score || 0; // Nếu không có điểm → 0
        this.scoreText = this.add.text(512, 350, `Final Score: ${finalScore}`, {
            fontFamily: 'Arial', 
            fontSize: '32px', 
            color: '#FFD700',  // Màu vàng
            align: 'center'
        }).setOrigin(0.5);

        // 🔄 Nút "Click to Play Again"
        this.restartText = this.add.text(512, 450, 'Click to Play Again', {
            fontFamily: 'Arial', 
            fontSize: '24px', 
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        // ✨ Hiệu ứng nhấp nháy
        this.tweens.add({
            targets: this.restartText,
            alpha: 0.3,        // Mờ xuống 30%
            duration: 1000,    // Trong 1 giây
            yoyo: true,        // Quay lại
            repeat: -1         // Lặp mãi
        });

        // 🏆 Nút "View Leaderboard"
        this.leaderboardText = this.add.text(512, 520, '🏆 View Leaderboard', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#FFD700',  // Màu vàng
            align: 'center'
        }).setOrigin(0.5);

        // 🖱️ Cho phép click vào nút Leaderboard
        this.leaderboardText.setInteractive({ useHandCursor: true });
        this.leaderboardText.on('pointerdown', () => {
            this.scene.start('Leaderboard');
        });

        // ✨ Hiệu ứng hover
        this.leaderboardText.on('pointerover', () => {
            this.leaderboardText.setScale(1.1);
        });
        this.leaderboardText.on('pointerout', () => {
            this.leaderboardText.setScale(1.0);
        });

        // 🖱️ Lắng nghe click chuột
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu'); // Quay lại menu
        });
        
        // 📡 Thông báo: Scene sẵn sàng!
        EventBus.emit('current-scene-ready', this);
    }

    /**
     * ✅ changeScene() - Quay lại MainMenu
     * 
     * Method này có thể gọi từ ngoài (ví dụ từ React)
     */
    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
