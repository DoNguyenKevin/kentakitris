// src/game/scenes/Settings.ts
// ======================================================
// ✅ Settings Scene - Màn hình cài đặt game
// 
// Scene này cho phép người chơi tùy chỉnh:
// - Bật/tắt hiển thị tốc độ rơi (Speed Indicator)
// - Bật/tắt âm thanh (Sound Effects)
// - Bật/tắt nhạc nền (Background Music)
// - Điều chỉnh âm lượng
// 
// Được mở từ MainMenu hoặc khi game đang pause
// ======================================================

import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

/**
 * ✅ Settings Scene - Màn hình cài đặt
 * 
 * Cho phép người chơi điều chỉnh các tùy chọn game
 * Lưu settings vào localStorage để giữ lại khi tắt game
 */
export class Settings extends Scene {
    // 📝 UI Elements
    private background: Phaser.GameObjects.Graphics;
    private settingsText: Phaser.GameObjects.Text;
    private closeButton: Phaser.GameObjects.Text;
    
    // ⚙️ Settings toggles
    private showSpeedToggle: Phaser.GameObjects.Text;
    private soundToggle: Phaser.GameObjects.Text;
    private musicToggle: Phaser.GameObjects.Text;
    
    // 📊 Settings state
    private settings: {
        showSpeed: boolean;
        soundEnabled: boolean;
        musicEnabled: boolean;
        soundVolume: number;
        musicVolume: number;
    };
    
    // 🔙 Previous scene (để biết quay lại scene nào)
    private previousScene: string;

    constructor() {
        super('Settings');
    }

    /**
     * ✅ init() - Khởi tạo với data từ scene trước
     * 
     * @param data - Chứa previousScene để biết quay lại đâu
     */
    init(data: any) {
        this.previousScene = data.previousScene || 'MainMenu';
        
        // 📥 Load settings từ localStorage
        this.loadSettings();
    }

    /**
     * ✅ create() - Tạo UI cho Settings scene
     * 
     * Tạo:
     * 1. Background tối (overlay)
     * 2. Settings box với border
     * 3. Các toggle buttons (Show Speed, Sound, Music)
     * 4. Close button
     */
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 🎨 Tạo background overlay (tối mờ)
        this.background = this.add.graphics();
        this.background.fillStyle(0x000000, 0.8);
        this.background.fillRect(0, 0, width, height);

        // 📦 Settings box
        const boxX = width / 2;
        const boxY = height / 2;
        const boxWidth = 500;
        const boxHeight = 400;
        
        // Vẽ box với border
        const settingsBox = this.add.graphics();
        settingsBox.fillStyle(0x2c314c, 1);
        settingsBox.fillRect(boxX - boxWidth / 2, boxY - boxHeight / 2, boxWidth, boxHeight);
        settingsBox.lineStyle(4, 0xf9f9f9, 1);
        settingsBox.strokeRect(boxX - boxWidth / 2, boxY - boxHeight / 2, boxWidth, boxHeight);

        // 🏆 Tiêu đề "SETTINGS"
        this.settingsText = this.add.text(boxX, boxY - boxHeight / 2 + 40, '⚙️ SETTINGS', {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#FFD700',
        }).setOrigin(0.5);

        // 📊 Settings options (Y positions)
        const startY = boxY - boxHeight / 2 + 120;
        const spacing = 80;

        // 1️⃣ Show Speed Toggle
        this.createToggle(
            '📊 Show Speed',
            'Display drop speed (ms) beside level',
            boxX,
            startY,
            this.settings.showSpeed,
            () => this.toggleShowSpeed()
        );

        // 2️⃣ Sound Effects Toggle
        this.createToggle(
            '🔊 Sound Effects',
            'Enable sound effects (move, rotate, clear)',
            boxX,
            startY + spacing,
            this.settings.soundEnabled,
            () => this.toggleSound()
        );

        // 3️⃣ Background Music Toggle
        this.createToggle(
            '🎵 Background Music',
            'Enable background music',
            boxX,
            startY + spacing * 2,
            this.settings.musicEnabled,
            () => this.toggleMusic()
        );

        // 🔙 Close button
        this.closeButton = this.add.text(boxX, boxY + boxHeight / 2 - 40, 'CLOSE', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#FFFFFF',
            backgroundColor: '#3b82f6',
            padding: { x: 40, y: 15 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.closeButton.on('pointerdown', () => this.closeSettings());
        this.closeButton.on('pointerover', () => {
            this.closeButton.setBackgroundColor('#60a5fa');
        });
        this.closeButton.on('pointerout', () => {
            this.closeButton.setBackgroundColor('#3b82f6');
        });

        // ⌨️ ESC để đóng
        this.input.keyboard!.on('keydown-ESC', () => this.closeSettings());

        // 📡 Thông báo scene ready
        EventBus.emit('current-scene-ready', this);
    }

    /**
     * ✅ createToggle() - Tạo một toggle button
     * 
     * @param label - Nhãn chính (vd: "Show Speed")
     * @param description - Mô tả (vd: "Display drop speed...")
     * @param x - Vị trí X
     * @param y - Vị trí Y
     * @param isOn - Trạng thái hiện tại (true/false)
     * @param callback - Hàm gọi khi click
     */
    private createToggle(
        label: string,
        description: string,
        x: number,
        y: number,
        isOn: boolean,
        callback: () => void
    ) {
        // 📝 Label text (bên trái)
        const labelText = this.add.text(x - 180, y - 15, label, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#FFFFFF',
            fontStyle: 'bold',
        });

        // 📝 Description text (bên trái, dưới label)
        this.add.text(x - 180, y + 10, description, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#888888',
        });

        // 🔘 Toggle switch (bên phải)
        const toggleBox = this.add.graphics();
        const toggleX = x + 150;
        const toggleWidth = 60;
        const toggleHeight = 30;
        
        // Background
        toggleBox.fillStyle(isOn ? 0x10b981 : 0x6b7280, 1);
        toggleBox.fillRoundedRect(toggleX, y - 5, toggleWidth, toggleHeight, 15);
        
        // Circle
        const circleX = isOn ? toggleX + toggleWidth - 15 : toggleX + 15;
        const circleY = y + 10;
        const circle = this.add.circle(circleX, circleY, 12, 0xffffff);
        
        // 🖱️ Make interactive
        const hitArea = this.add.rectangle(toggleX, y + 10, toggleWidth, toggleHeight, 0x000000, 0)
            .setInteractive({ useHandCursor: true });
        
        hitArea.on('pointerdown', () => {
            callback();
            
            // Animate toggle
            const newState = !isOn;
            toggleBox.clear();
            toggleBox.fillStyle(newState ? 0x10b981 : 0x6b7280, 1);
            toggleBox.fillRoundedRect(toggleX, y - 5, toggleWidth, toggleHeight, 15);
            
            // Animate circle
            const newCircleX = newState ? toggleX + toggleWidth - 15 : toggleX + 15;
            this.tweens.add({
                targets: circle,
                x: newCircleX,
                duration: 200,
                ease: 'Power2',
            });
            
            // Update state
            isOn = newState;
        });
    }

    /**
     * ✅ Toggle functions - Bật/tắt từng setting
     */
    private toggleShowSpeed() {
        this.settings.showSpeed = !this.settings.showSpeed;
        this.saveSettings();
        EventBus.emit('settings-changed', this.settings);
    }

    private toggleSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        this.saveSettings();
        EventBus.emit('settings-changed', this.settings);
    }

    private toggleMusic() {
        this.settings.musicEnabled = !this.settings.musicEnabled;
        this.saveSettings();
        EventBus.emit('settings-changed', this.settings);
    }

    /**
     * ✅ loadSettings() - Load settings từ localStorage
     * 
     * Nếu chưa có settings → dùng default values
     */
    private loadSettings() {
        const savedSettings = localStorage.getItem('gameSettings');
        
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        } else {
            // 🎯 Default settings
            this.settings = {
                showSpeed: false,
                soundEnabled: true,
                musicEnabled: true,
                soundVolume: 0.7,
                musicVolume: 0.5,
            };
        }
    }

    /**
     * ✅ saveSettings() - Lưu settings vào localStorage
     */
    private saveSettings() {
        localStorage.setItem('gameSettings', JSON.stringify(this.settings));
    }

    /**
     * ✅ closeSettings() - Đóng Settings và quay lại scene trước
     */
    private closeSettings() {
        this.scene.stop('Settings');
        this.scene.resume(this.previousScene);
    }

    /**
     * ✅ getSettings() - Lấy settings hiện tại (static method)
     * 
     * Dùng để các scene khác truy cập settings
     */
    static getSettings() {
        const savedSettings = localStorage.getItem('gameSettings');
        
        if (savedSettings) {
            return JSON.parse(savedSettings);
        } else {
            return {
                showSpeed: false,
                soundEnabled: true,
                musicEnabled: true,
                soundVolume: 0.7,
                musicVolume: 0.5,
            };
        }
    }
}
