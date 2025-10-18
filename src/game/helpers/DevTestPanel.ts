// src/game/helpers/DevTestPanel.ts
// ======================================================
// ✅ Dev Test Panel - Bảng điều khiển test cho developer
// 
// Panel này giúp developer dễ dàng test các chức năng power-ups
// Có thể mở/đóng bằng phím 'D' (Debug)
// 
// 🎯 Mục đích: Không cần nhớ phím tắt, click chuột để test!
// ======================================================

import { Scene } from 'phaser';
import { PowerUpManager } from '../managers/PowerUpManager';
import { PowerUpType, ALL_POWERUP_CONFIGS } from '../constants/PowerUpConstants';

/**
 * ✅ DevTestPanel - Bảng điều khiển test power-ups
 * 
 * Mục tiêu: Tạo UI để dev test power-ups dễ dàng
 * 
 * Cách hoạt động:
 * 1. Hiển thị panel khi nhấn phím 'D'
 * 2. Hiển thị 5 power-ups với nút kích hoạt
 * 3. Cho phép nhập số uses và duration tùy chỉnh
 * 4. Có nút Reset để tắt tất cả power-ups
 * 
 * Try it: Nhấn 'D' trong game để mở panel!
 */
export class DevTestPanel {
    private scene: Scene;
    private powerUpManager: PowerUpManager;
    private isVisible: boolean = false;
    
    // 🎨 UI Elements
    private container: Phaser.GameObjects.Container;
    private background: Phaser.GameObjects.Rectangle;
    private titleText: Phaser.GameObjects.Text;
    private closeButton: Phaser.GameObjects.Text;
    private buttons: Phaser.GameObjects.Text[] = [];
    
    // 📊 Input fields (simulated with text)
    private usesInputs: Map<PowerUpType, number> = new Map();
    private durationInputs: Map<PowerUpType, number> = new Map();
    
    /**
     * ✅ Constructor - Khởi tạo DevTestPanel
     * 
     * @param scene - Phaser Scene
     * @param powerUpManager - PowerUpManager instance
     */
    constructor(scene: Scene, powerUpManager: PowerUpManager) {
        this.scene = scene;
        this.powerUpManager = powerUpManager;
        
        // Khởi tạo giá trị mặc định cho inputs
        ALL_POWERUP_CONFIGS.forEach(config => {
            this.usesInputs.set(config.type, config.defaultUses || 1);
            this.durationInputs.set(config.type, config.defaultDuration || 0);
        });
        
        this.createPanel();
        this.hide(); // Ẩn ban đầu
    }
    
    /**
     * ✅ createPanel() - Tạo UI panel
     * 
     * Tạo panel với:
     * - Nền tối có viền
     * - Tiêu đề "Dev Test Panel"
     * - Danh sách 5 power-ups
     * - Mỗi power-up có: Tên, nút Activate, nút +/-, nút Reset
     * - Nút Close ở góc trên
     */
    private createPanel(): void {
        // 📦 Container để nhóm tất cả UI
        this.container = this.scene.add.container(0, 0);
        this.container.setDepth(1000); // Hiển thị trên tất cả
        
        // 🎨 Background - Nền panel
        const panelWidth = 600;
        const panelHeight = 500;
        const panelX = 512; // Giữa màn hình (1024/2)
        const panelY = 384; // Giữa màn hình (768/2)
        
        this.background = this.scene.add.rectangle(
            panelX, panelY, 
            panelWidth, panelHeight,
            0x000000, 0.9
        );
        this.background.setStrokeStyle(3, 0x00FF88);
        this.container.add(this.background);
        
        // 📝 Title
        this.titleText = this.scene.add.text(
            panelX, panelY - 220,
            '🧪 Dev Test Panel - Power-ups',
            {
                fontFamily: 'Arial Black',
                fontSize: '24px',
                color: '#00FF88',
                align: 'center'
            }
        ).setOrigin(0.5);
        this.container.add(this.titleText);
        
        // ❌ Close button
        this.closeButton = this.scene.add.text(
            panelX + 280, panelY - 230,
            '✕',
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#FF4444',
                align: 'center'
            }
        ).setOrigin(0.5);
        this.closeButton.setInteractive({ useHandCursor: true });
        this.closeButton.on('pointerdown', () => this.hide());
        this.closeButton.on('pointerover', () => this.closeButton.setScale(1.2));
        this.closeButton.on('pointerout', () => this.closeButton.setScale(1.0));
        this.container.add(this.closeButton);
        
        // 📝 Instruction text
        const instructionText = this.scene.add.text(
            panelX, panelY - 180,
            'Nhấn "D" để mở/đóng | Click nút để kích hoạt power-up',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#AAAAAA',
                align: 'center'
            }
        ).setOrigin(0.5);
        this.container.add(instructionText);
        
        // 🎯 Tạo nút cho mỗi power-up
        const startY = panelY - 140;
        const rowHeight = 60;
        
        ALL_POWERUP_CONFIGS.forEach((config, index) => {
            const y = startY + index * rowHeight;
            this.createPowerUpRow(config, panelX, y);
        });
        
        // 🔄 Reset All button
        const resetAllButton = this.scene.add.text(
            panelX, panelY + 200,
            '🔄 Reset All Power-ups',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#FFD700',
                backgroundColor: '#333333',
                padding: { x: 12, y: 8 }
            }
        ).setOrigin(0.5);
        resetAllButton.setInteractive({ useHandCursor: true });
        resetAllButton.on('pointerdown', () => this.resetAllPowerUps());
        resetAllButton.on('pointerover', () => resetAllButton.setScale(1.1));
        resetAllButton.on('pointerout', () => resetAllButton.setScale(1.0));
        this.container.add(resetAllButton);
    }
    
    /**
     * ✅ createPowerUpRow() - Tạo một hàng cho power-up
     * 
     * Mỗi hàng bao gồm:
     * - Emoji + Tên power-up
     * - Nút Activate
     * - Input uses/duration (nút +/-)
     * 
     * @param config - Cấu hình power-up
     * @param centerX - Tọa độ X giữa panel
     * @param y - Tọa độ Y của hàng
     */
    private createPowerUpRow(config: any, centerX: number, y: number): void {
        // 📝 Power-up name
        const nameText = this.scene.add.text(
            centerX - 220, y,
            `${config.emoji} ${config.name}`,
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#FFFFFF'
            }
        ).setOrigin(0, 0.5);
        this.container.add(nameText);
        
        // 🎯 Activate button
        const activateButton = this.scene.add.text(
            centerX - 50, y,
            'Activate',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#FFFFFF',
                backgroundColor: '#444444',
                padding: { x: 8, y: 4 }
            }
        ).setOrigin(0.5);
        activateButton.setInteractive({ useHandCursor: true });
        activateButton.on('pointerdown', () => {
            const uses = this.usesInputs.get(config.type);
            const duration = this.durationInputs.get(config.type);
            this.powerUpManager.activatePowerUp(config.type, uses, duration);
        });
        activateButton.on('pointerover', () => {
            activateButton.setStyle({ backgroundColor: '#00FF88' });
        });
        activateButton.on('pointerout', () => {
            activateButton.setStyle({ backgroundColor: '#444444' });
        });
        this.container.add(activateButton);
        this.buttons.push(activateButton);
        
        // 🔢 Uses/Duration controls
        if (config.defaultUses !== undefined) {
            // Uses control
            this.createNumberControl(
                config.type,
                centerX + 60, y,
                'Uses:',
                this.usesInputs,
                1, 10
            );
        }
        
        if (config.defaultDuration !== undefined) {
            // Duration control (in seconds)
            this.createNumberControl(
                config.type,
                centerX + 150, y,
                'Sec:',
                this.durationInputs,
                1000, 60000,
                true // convert to seconds
            );
        }
    }
    
    /**
     * ✅ createNumberControl() - Tạo control tăng/giảm số
     * 
     * @param type - Power-up type
     * @param x - Tọa độ X
     * @param y - Tọa độ Y
     * @param label - Nhãn (Uses/Sec)
     * @param valueMap - Map lưu giá trị
     * @param step - Bước tăng/giảm
     * @param max - Giá trị tối đa
     * @param inSeconds - Hiển thị dưới dạng giây
     */
    private createNumberControl(
        type: PowerUpType,
        x: number,
        y: number,
        label: string,
        valueMap: Map<PowerUpType, number>,
        step: number,
        max: number,
        inSeconds: boolean = false
    ): void {
        // Label
        const labelText = this.scene.add.text(x - 30, y, label, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#AAAAAA'
        }).setOrigin(0, 0.5);
        this.container.add(labelText);
        
        // Value display
        const getValue = () => {
            const val = valueMap.get(type) || 0;
            return inSeconds ? Math.floor(val / 1000) : val;
        };
        
        const valueText = this.scene.add.text(x + 35, y, getValue().toString(), {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        this.container.add(valueText);
        
        // - button
        const minusButton = this.scene.add.text(x + 10, y, '-', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFFFFF',
            backgroundColor: '#333333',
            padding: { x: 6, y: 2 }
        }).setOrigin(0.5);
        minusButton.setInteractive({ useHandCursor: true });
        minusButton.on('pointerdown', () => {
            const current = valueMap.get(type) || 0;
            const newValue = Math.max(step, current - step);
            valueMap.set(type, newValue);
            valueText.setText(getValue().toString());
        });
        this.container.add(minusButton);
        
        // + button
        const plusButton = this.scene.add.text(x + 60, y, '+', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#FFFFFF',
            backgroundColor: '#333333',
            padding: { x: 6, y: 2 }
        }).setOrigin(0.5);
        plusButton.setInteractive({ useHandCursor: true });
        plusButton.on('pointerdown', () => {
            const current = valueMap.get(type) || 0;
            const newValue = Math.min(max, current + step);
            valueMap.set(type, newValue);
            valueText.setText(getValue().toString());
        });
        this.container.add(plusButton);
    }
    
    /**
     * ✅ resetAllPowerUps() - Reset tất cả power-ups
     * 
     * Tắt tất cả power-ups đang active
     */
    private resetAllPowerUps(): void {
        ALL_POWERUP_CONFIGS.forEach(config => {
            this.powerUpManager.deactivatePowerUp(config.type);
        });
        console.log('🔄 All power-ups reset!');
    }
    
    /**
     * ✅ toggle() - Bật/tắt panel
     */
    toggle(): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * ✅ show() - Hiển thị panel
     */
    show(): void {
        this.isVisible = true;
        this.container.setVisible(true);
    }
    
    /**
     * ✅ hide() - Ẩn panel
     */
    hide(): void {
        this.isVisible = false;
        this.container.setVisible(false);
    }
    
    /**
     * ✅ destroy() - Dọn dẹp khi scene kết thúc
     */
    destroy(): void {
        this.container.destroy();
    }
}
