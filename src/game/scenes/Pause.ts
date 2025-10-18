// src/game/scenes/Pause.ts
// ======================================================
// ✅ Pause Scene - Màn hình tạm dừng game
// 
// Scene này hiển thị khi game bị pause:
// - Overlay tối (để thấy game phía sau)
// - Text "PAUSED"
// - Button: Resume, Settings, Quit
// 
// Được mở bằng phím P hoặc ESC trong Game scene
// ======================================================

import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

/**
 * ✅ Pause Scene - Overlay khi game tạm dừng
 * 
 * Scene này không dừng Game scene, chỉ hiển thị overlay trên đó
 * Game scene vẫn chạy ở phía sau nhưng được pause
 */
export class Pause extends Scene {
    private background: Phaser.GameObjects.Graphics;
    private pausedText: Phaser.GameObjects.Text;
    private resumeButton: Phaser.GameObjects.Text;
    private settingsButton: Phaser.GameObjects.Text;
    private quitButton: Phaser.GameObjects.Text;

    constructor() {
        super('Pause');
    }

    /**
     * ✅ create() - Tạo pause overlay
     * 
     * Các bước:
     * 1. Tạo background tối mờ (50% opacity)
     * 2. Hiển thị "PAUSED" to đùng
     * 3. Tạo 3 nút: Resume, Settings, Quit
     * 4. Thiết lập keyboard input (P/ESC để resume)
     */
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 🎨 Tạo background overlay (tối mờ 50%)
        this.background = this.add.graphics();
        this.background.fillStyle(0x000000, 0.7);
        this.background.fillRect(0, 0, width, height);

        // 🏆 Text "PAUSED" lớn ở giữa
        this.pausedText = this.add.text(width / 2, height / 2 - 100, 'PAUSED', {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 8,
        }).setOrigin(0.5);

        // Hiệu ứng nhấp nháy
        this.tweens.add({
            targets: this.pausedText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // 🔘 Resume button
        this.resumeButton = this.createButton(
            width / 2,
            height / 2,
            'RESUME',
            '#10b981',
            () => this.resumeGame()
        );

        // ⚙️ Settings button
        this.settingsButton = this.createButton(
            width / 2,
            height / 2 + 70,
            'SETTINGS',
            '#3b82f6',
            () => this.openSettings()
        );

        // 🚪 Quit button
        this.quitButton = this.createButton(
            width / 2,
            height / 2 + 140,
            'QUIT TO MENU',
            '#ef4444',
            () => this.quitToMenu()
        );

        // ⌨️ Keyboard shortcuts
        this.input.keyboard!.on('keydown-P', () => this.resumeGame());
        this.input.keyboard!.on('keydown-ESC', () => this.resumeGame());
        this.input.keyboard!.on('keydown-SPACE', () => this.resumeGame());

        // 📝 Hint text ở dưới
        this.add.text(width / 2, height - 50, 'Press P, ESC, or SPACE to resume', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#888888',
        }).setOrigin(0.5);

        // 📡 Thông báo scene ready
        EventBus.emit('current-scene-ready', this);
    }

    /**
     * ✅ createButton() - Helper tạo button
     * 
     * Tạo button với:
     * - Text có màu background
     * - Hover effect (đổi màu khi rê chuột)
     * - Click callback
     * 
     * @param x - Vị trí X
     * @param y - Vị trí Y
     * @param text - Chữ trên button
     * @param color - Màu button (hex)
     * @param callback - Hàm gọi khi click
     */
    private createButton(
        x: number,
        y: number,
        text: string,
        color: string,
        callback: () => void
    ): Phaser.GameObjects.Text {
        const button = this.add.text(x, y, text, {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#FFFFFF',
            backgroundColor: color,
            padding: { x: 30, y: 15 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // 🖱️ Hover effects
        button.on('pointerover', () => {
            button.setScale(1.1);
            // Lighten color on hover
            const hoverColors: { [key: string]: string } = {
                '#10b981': '#34d399',
                '#3b82f6': '#60a5fa',
                '#ef4444': '#f87171',
            };
            button.setBackgroundColor(hoverColors[color] || color);
        });

        button.on('pointerout', () => {
            button.setScale(1);
            button.setBackgroundColor(color);
        });

        // 🖱️ Click
        button.on('pointerdown', () => {
            button.setScale(0.95);
        });

        button.on('pointerup', () => {
            button.setScale(1.1);
            callback();
        });

        return button;
    }

    /**
     * ✅ resumeGame() - Tiếp tục game
     * 
     * Đóng Pause scene và resume Game scene
     */
    private resumeGame() {
        this.scene.stop('Pause');
        this.scene.resume('Game');
        EventBus.emit('game-resumed');
    }

    /**
     * ✅ openSettings() - Mở Settings
     * 
     * Giữ Pause scene, mở Settings scene
     */
    private openSettings() {
        this.scene.pause('Pause');
        this.scene.launch('Settings', { previousScene: 'Pause' });
    }

    /**
     * ✅ quitToMenu() - Thoát về menu
     * 
     * Dừng Game scene và Pause scene
     * Chuyển về MainMenu
     */
    private quitToMenu() {
        this.scene.stop('Pause');
        this.scene.stop('Game');
        this.scene.start('MainMenu');
        EventBus.emit('game-quit');
    }
}
