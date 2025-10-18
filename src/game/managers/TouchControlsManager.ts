// src/game/managers/TouchControlsManager.ts
// ======================================================
// ✅ Touch Controls Manager - Quản lý điều khiển cảm ứng
// 
// Manager này tạo overlay buttons cho mobile:
// - Left, Right, Down arrows
// - Rotate button
// - Hard Drop button
// 
// Tự động ẩn trên desktop, hiện trên mobile
// ======================================================

import { Scene } from 'phaser';

/**
 * ✅ TouchControlsManager - Quản lý touch controls
 * 
 * Tạo các nút điều khiển cho mobile devices
 * Responsive: Tự động ẩn/hiện dựa vào kích thước màn hình
 */
export class TouchControlsManager {
    private scene: Scene;
    private container: Phaser.GameObjects.Container;
    private buttons: Map<string, Phaser.GameObjects.Container>;
    
    // 🎮 Callbacks cho các hành động
    private onMoveLeft: () => void;
    private onMoveRight: () => void;
    private onMoveDown: () => void;
    private onRotate: () => void;
    private onHardDrop: () => void;
    
    // 📱 Mobile detection
    private isMobile: boolean;

    constructor(
        scene: Scene,
        callbacks: {
            onMoveLeft: () => void;
            onMoveRight: () => void;
            onMoveDown: () => void;
            onRotate: () => void;
            onHardDrop: () => void;
        }
    ) {
        this.scene = scene;
        this.buttons = new Map();
        
        // 📥 Lưu callbacks
        this.onMoveLeft = callbacks.onMoveLeft;
        this.onMoveRight = callbacks.onMoveRight;
        this.onMoveDown = callbacks.onMoveDown;
        this.onRotate = callbacks.onRotate;
        this.onHardDrop = callbacks.onHardDrop;
        
        // 📱 Detect mobile (screen width < 768px)
        this.isMobile = this.checkMobile();
        
        // 🎨 Tạo controls nếu là mobile
        if (this.isMobile) {
            this.createControls();
        }
        
        // 🔄 Listen for resize events
        this.scene.scale.on('resize', this.onResize, this);
    }

    /**
     * ✅ checkMobile() - Kiểm tra xem có phải mobile không
     * 
     * @returns true nếu screen width < 768px
     */
    private checkMobile(): boolean {
        return window.innerWidth < 768;
    }

    /**
     * ✅ createControls() - Tạo touch control overlay
     * 
     * Layout:
     * ```
     *         [↻]
     * [←] [↓] [→]
     *   [HARD DROP]
     * ```
     */
    private createControls() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        // 🎨 Container chứa tất cả buttons (ở dưới cùng màn hình)
        this.container = this.scene.add.container(0, height - 200);
        this.container.setDepth(1000); // Luôn hiển thị trên cùng

        // 📍 Positions
        const centerX = width / 2;
        const buttonSize = 70;
        const spacing = 10;
        
        // 🔘 Rotate button (trên cùng, giữa)
        this.createButton(
            'rotate',
            centerX,
            -20,
            buttonSize,
            buttonSize,
            '↻',
            '#f59e0b',
            this.onRotate
        );
        
        // ⬅️ Left button
        this.createButton(
            'left',
            centerX - buttonSize - spacing,
            60,
            buttonSize,
            buttonSize,
            '←',
            '#3b82f6',
            this.onMoveLeft
        );
        
        // ⬇️ Down button
        this.createButton(
            'down',
            centerX,
            60,
            buttonSize,
            buttonSize,
            '↓',
            '#3b82f6',
            this.onMoveDown
        );
        
        // ➡️ Right button
        this.createButton(
            'right',
            centerX + buttonSize + spacing,
            60,
            buttonSize,
            buttonSize,
            '→',
            '#3b82f6',
            this.onMoveRight
        );
        
        // ⬇️⬇️ Hard Drop button (to hơn, ở dưới)
        this.createButton(
            'hardDrop',
            centerX,
            140,
            buttonSize * 3 + spacing * 2,
            50,
            'HARD DROP',
            '#8b5cf6',
            this.onHardDrop
        );
    }

    /**
     * ✅ createButton() - Tạo một nút điều khiển
     * 
     * @param id - ID của button
     * @param x - Vị trí X (relative to container)
     * @param y - Vị trí Y (relative to container)
     * @param width - Chiều rộng
     * @param height - Chiều cao
     * @param text - Text trên button
     * @param color - Màu button
     * @param callback - Hàm gọi khi nhấn
     */
    private createButton(
        id: string,
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        color: string,
        callback: () => void
    ) {
        // 🎨 Button container
        const buttonContainer = this.scene.add.container(x, y);
        
        // 🔲 Background rectangle
        const bg = this.scene.add.graphics();
        bg.fillStyle(parseInt(color.replace('#', '0x')), 1);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
        bg.lineStyle(3, 0xffffff, 1);
        bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
        
        // 📝 Text
        const buttonText = this.scene.add.text(0, 0, text, {
            fontFamily: 'Arial Black',
            fontSize: text.length > 2 ? '18px' : '32px',
            color: '#FFFFFF',
        }).setOrigin(0.5);
        
        buttonContainer.add([bg, buttonText]);
        
        // 🖱️ Make interactive
        buttonContainer.setSize(width, height);
        buttonContainer.setInteractive(
            new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
            Phaser.Geom.Rectangle.Contains
        );
        
        // 📱 Touch events
        buttonContainer.on('pointerdown', () => {
            // Visual feedback
            buttonContainer.setScale(0.95);
            callback();
        });
        
        buttonContainer.on('pointerup', () => {
            buttonContainer.setScale(1);
        });
        
        buttonContainer.on('pointerout', () => {
            buttonContainer.setScale(1);
        });
        
        // 💾 Lưu button
        this.buttons.set(id, buttonContainer);
        this.container.add(buttonContainer);
    }

    /**
     * ✅ onResize() - Xử lý khi resize window
     * 
     * Ẩn/hiện controls dựa vào kích thước màn hình
     */
    private onResize() {
        const wasMobile = this.isMobile;
        this.isMobile = this.checkMobile();
        
        // Nếu chuyển từ desktop → mobile
        if (!wasMobile && this.isMobile && !this.container) {
            this.createControls();
        }
        
        // Nếu chuyển từ mobile → desktop
        if (wasMobile && !this.isMobile && this.container) {
            this.destroy();
        }
        
        // Cập nhật vị trí nếu vẫn là mobile
        if (this.isMobile && this.container) {
            const height = this.scene.cameras.main.height;
            this.container.setY(height - 200);
        }
    }

    /**
     * ✅ show() - Hiển thị controls
     */
    show() {
        if (this.container) {
            this.container.setVisible(true);
        }
    }

    /**
     * ✅ hide() - Ẩn controls
     */
    hide() {
        if (this.container) {
            this.container.setVisible(false);
        }
    }

    /**
     * ✅ destroy() - Xóa controls
     */
    destroy() {
        if (this.container) {
            this.container.destroy();
            this.container = null as any;
            this.buttons.clear();
        }
    }
}
