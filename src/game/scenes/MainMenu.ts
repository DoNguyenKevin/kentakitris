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
     * 4. Tạo nút "Click to Start" (nhấp nháy)
     * 5. Hiển thị hướng dẫn phím
     * 6. Lắng nghe click chuột
     * 
     * 💡 Tween = Animation (hiệu ứng chuyển động)
     */
    create ()
    {
        // 📹 Thiết lập camera và màu nền
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x0d0d1a); // Xanh đen

        // 🏆 Tiêu đề game
        this.logoText = this.add.text(512, 200, '🎮 KENTAKITRIS 🎮', {
            fontFamily: 'Arial Black', 
            fontSize: '64px', 
            color: '#FFD700',      // Màu vàng
            stroke: '#000000',     // Viền đen
            strokeThickness: 8,    // Độ dày viền
            align: 'center'
        }).setOrigin(0.5); // Căn giữa

        // 📝 Subtitle (dòng chữ nhỏ)
        this.add.text(512, 300, 'A Tetris Game with Phaser', {
            fontFamily: 'Arial', 
            fontSize: '24px', 
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        // 🎮 Nút "Click to Start"
        this.startText = this.add.text(512, 400, 'Click to Start', {
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

        // 📖 Hướng dẫn phím
        this.add.text(512, 550, 'Controls:', {
            fontFamily: 'Arial', 
            fontSize: '20px', 
            color: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 590, '← → : Move  |  ↑ : Rotate  |  SPACE : Drop', {
            fontFamily: 'Arial', 
            fontSize: '18px', 
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
     * ✅ changeScene() - Chuyển sang Game scene
     * 
     * Được gọi khi người chơi click chuột
     */
    changeScene ()
    {
        this.scene.start('Game'); // Bắt đầu Game scene
    }

    /**
     * 🗑️ moveLogo() - Legacy method (không dùng nữa)
     */
    moveLogo (reactCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        // Legacy method - no longer used
    }
}
