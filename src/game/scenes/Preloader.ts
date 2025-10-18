// src/game/scenes/Preloader.ts
// ======================================================
// ✅ Preloader Scene - Scene load assets (tài nguyên)
// 
// Scene này load các file cần thiết cho game:
// - Hình ảnh (images)
// - Âm thanh (sounds)
// - Font chữ (fonts)
// 
// Kentakitris: Không cần load gì vì vẽ bằng code!
// Nhưng vẫn hiển thị progress bar để đẹp hơn.
// 
// 📦 Preload = Tải trước
//    Giống như tải game trên điện thoại!
// ======================================================

import { Scene } from 'phaser';

/**
 * ✅ Preloader Scene - Scene hiển thị loading
 */
export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    /**
     * ✅ init() - Khởi tạo trước khi load
     * 
     * Tạo progress bar (thanh tiến trình) để hiển thị % loading
     * 
     * Các phần:
     * 1. Box xám (nền của progress bar)
     * 2. Bar trắng (thanh tiến trình)
     * 3. Text "Loading..." và "X%"
     * 
     * 📊 Progress = Tiến trình (0% → 100%)
     */
    init ()
    {
        // 📏 Lấy kích thước màn hình
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 🎨 Tạo progress bar (thanh tiến trình)
        const progressBar = this.add.graphics(); // Bar trắng (sẽ tăng dần)
        const progressBox = this.add.graphics(); // Box xám (nền)
        progressBox.fillStyle(0x222222, 0.8);    // Màu xám đậm, trong suốt 80%
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        // 📝 Chữ "Loading..."
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff'
        });
        loadingText.setOrigin(0.5); // Căn giữa

        // 📝 Chữ phần trăm "0%"
        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff'
        });
        percentText.setOrigin(0.5);

        // 📊 Event: Khi đang load (progress)
        // value = 0.0 → 1.0 (0% → 100%)
        this.load.on('progress', (value: number) => {
            percentText.setText(Math.floor(value * 100) + '%'); // Cập nhật text
            progressBar.clear();                                // Xóa bar cũ
            progressBar.fillStyle(0xffffff, 1);                 // Màu trắng
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
            // Chiều rộng bar = 300 * value (0 → 300 pixels)
        });

        // ✅ Event: Khi load xong
        this.load.on('complete', () => {
            progressBar.destroy();  // Xóa các đối tượng
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }

    /**
     * ✅ preload() - Load assets
     * 
     * Kentakitris: Không có assets thật sự
     * Chỉ load 1 ảnh fake để progress bar chạy
     * 
     * 💡 data:image/... = Ảnh nhỏ xíu, 1x1 pixel trong suốt
     */
    preload ()
    {
        //  Load assets here if needed
        //  For now, we don't need any external assets for Tetris
        
        // Simulate loading delay (giả lập loading)
        this.load.image('placeholder', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    }

    /**
     * ✅ create() - Sau khi load xong
     * 
     * Chuyển sang MainMenu scene
     * 
     * 🎬 Có thể thêm hiệu ứng chuyển cảnh (fade, slide...)
     */
    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu'); // Chuyển sang MainMenu
    }
}
