// src/game/managers/ParticleManager.ts
// ======================================================
// ✅ Particle Manager - Quản lý hiệu ứng particles
// 
// Manager này tạo các hiệu ứng visual:
// - Score particles khi xóa hàng (điểm bay lên)
// - Line clear flash effect (hàng sáng lên khi xóa)
// - Level up celebration (pháo hoa!)
// - Combo effects (nhiều hàng cùng lúc)
// 
// Sử dụng Phaser's Particle System và Tweens
// ======================================================

import { Scene } from 'phaser';

/**
 * ✅ ParticleManager - Quản lý hiệu ứng particles và animations
 * 
 * Tạo các hiệu ứng đẹp mắt để tăng trải nghiệm người chơi
 */
export class ParticleManager {
    private scene: Scene;
    private particleEmitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * ✅ createScoreParticle() - Tạo text particle bay lên
     * 
     * Hiển thị điểm số bay lên khi xóa hàng
     * 
     * @param x - Vị trí X (pixel)
     * @param y - Vị trí Y (pixel)
     * @param score - Điểm số hiển thị
     * @param targetX - Vị trí X đích (score display)
     * @param targetY - Vị trí Y đích (score display)
     */
    createScoreParticle(
        x: number,
        y: number,
        score: number,
        targetX: number,
        targetY: number
    ) {
        // 📝 Tạo text object
        const scoreText = this.scene.add.text(x, y, `+${score}`, {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5);

        // ✨ Hiệu ứng sáng
        scoreText.setAlpha(0);
        
        // 🎬 Animation bay lên và về score display
        this.scene.tweens.add({
            targets: scoreText,
            alpha: 1,
            duration: 200,
            ease: 'Power2',
        });

        this.scene.tweens.add({
            targets: scoreText,
            x: targetX,
            y: targetY,
            scale: 0.5,
            duration: 800,
            ease: 'Power2',
            delay: 200,
            onComplete: () => {
                // Fade out và destroy
                this.scene.tweens.add({
                    targets: scoreText,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => scoreText.destroy(),
                });
            },
        });

        // 🌟 Thêm rotation cho vui
        this.scene.tweens.add({
            targets: scoreText,
            angle: 360,
            duration: 800,
            ease: 'Linear',
            delay: 200,
        });
    }

    /**
     * ✅ createLineClearFlash() - Tạo flash effect cho hàng bị xóa
     * 
     * Hiệu ứng: Hàng sáng lên trắng rồi biến mất
     * 
     * @param y - Số thứ tự hàng (0-19)
     * @param boardX - X của board
     * @param boardY - Y của board
     * @param boardWidth - Chiều rộng board (số cột)
     * @param blockSize - Kích thước mỗi block
     */
    createLineClearFlash(
        y: number,
        boardX: number,
        boardY: number,
        boardWidth: number,
        blockSize: number
    ) {
        // 🎨 Tạo rectangle sáng
        const flashRect = this.scene.add.rectangle(
            boardX + (boardWidth * blockSize) / 2,
            boardY + y * blockSize + blockSize / 2,
            boardWidth * blockSize,
            blockSize,
            0xffffff,
            0.8
        );

        flashRect.setDepth(100);

        // ✨ Flash animation (nhấp nháy 3 lần)
        this.scene.tweens.add({
            targets: flashRect,
            alpha: 0,
            duration: 100,
            yoyo: true,
            repeat: 2,
            onComplete: () => flashRect.destroy(),
        });
    }

    /**
     * ✅ createLevelUpEffect() - Hiệu ứng level up
     * 
     * Hiển thị text "LEVEL UP!" và pháo hoa
     */
    createLevelUpEffect(level: number) {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        // 🏆 Text "LEVEL UP!"
        const levelUpText = this.scene.add.text(
            width / 2,
            height / 2,
            `LEVEL ${level}!`,
            {
                fontFamily: 'Arial Black',
                fontSize: '48px',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 8,
            }
        ).setOrigin(0.5).setAlpha(0).setScale(0);

        levelUpText.setDepth(1000);

        // 🎬 Zoom in → Zoom out
        this.scene.tweens.add({
            targets: levelUpText,
            alpha: 1,
            scale: 1.5,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Hold for a moment
                this.scene.time.delayedCall(500, () => {
                    this.scene.tweens.add({
                        targets: levelUpText,
                        alpha: 0,
                        scale: 2,
                        duration: 300,
                        ease: 'Power2',
                        onComplete: () => levelUpText.destroy(),
                    });
                });
            },
        });

        // 🎆 Tạo particles (stars)
        this.createStarBurst(width / 2, height / 2);
    }

    /**
     * ✅ createStarBurst() - Tạo pháo hoa sao
     * 
     * Nhiều sao bay ra từ 1 điểm
     * 
     * @param x - Vị trí X trung tâm
     * @param y - Vị trí Y trung tâm
     */
    private createStarBurst(x: number, y: number) {
        const colors = [0xFFD700, 0xFF6B00, 0xFF0000, 0x00FF00, 0x0000FF];
        
        // Tạo 20 sao bay ra
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 100 + Math.random() * 100;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;
            
            const star = this.scene.add.circle(x, y, 5, colors[i % colors.length]);
            star.setDepth(999);
            
            this.scene.tweens.add({
                targets: star,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                duration: 800 + Math.random() * 400,
                ease: 'Power2',
                onComplete: () => star.destroy(),
            });
        }
    }

    /**
     * ✅ createComboEffect() - Hiệu ứng combo (xóa nhiều hàng)
     * 
     * Hiển thị text "DOUBLE!", "TRIPLE!", "TETRIS!"
     * 
     * @param linesCleared - Số hàng xóa (2, 3, 4)
     */
    createComboEffect(linesCleared: number) {
        if (linesCleared < 2) return;

        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        const comboTexts: { [key: number]: string } = {
            2: 'DOUBLE!',
            3: 'TRIPLE!',
            4: 'TETRIS!',
        };

        const comboColors: { [key: number]: string } = {
            2: '#10b981',
            3: '#f59e0b',
            4: '#ef4444',
        };

        const text = comboTexts[linesCleared] || 'COMBO!';
        const color = comboColors[linesCleared] || '#FFD700';

        // 📝 Combo text
        const comboText = this.scene.add.text(width / 2, height / 2 + 100, text, {
            fontFamily: 'Arial Black',
            fontSize: '36px',
            color: color,
            stroke: '#000000',
            strokeThickness: 6,
        }).setOrigin(0.5).setAlpha(0);

        comboText.setDepth(1000);

        // 🎬 Bounce in → Bounce out
        this.scene.tweens.add({
            targets: comboText,
            alpha: 1,
            y: height / 2 + 80,
            duration: 200,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                this.scene.time.delayedCall(800, () => {
                    this.scene.tweens.add({
                        targets: comboText,
                        alpha: 0,
                        y: height / 2 + 60,
                        duration: 300,
                        ease: 'Power2',
                        onComplete: () => comboText.destroy(),
                    });
                });
            },
        });
    }

    /**
     * ✅ createGameOverEffect() - Hiệu ứng game over
     * 
     * Screen shake và fade to black
     */
    createGameOverEffect() {
        // 📳 Screen shake
        this.scene.cameras.main.shake(500, 0.01);
        
        // 🌑 Fade to dark
        this.scene.cameras.main.fade(1000, 0, 0, 0);
    }

    /**
     * ✅ destroy() - Dọn dẹp
     */
    destroy() {
        this.particleEmitters.forEach(emitter => emitter.stop());
        this.particleEmitters = [];
    }
}
