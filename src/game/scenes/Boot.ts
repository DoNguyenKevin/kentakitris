// src/game/scenes/Boot.ts
// ======================================================
// ✅ Boot Scene - Scene khởi động game
// 
// Đây là scene đầu tiên chạy khi game bắt đầu
// Nhiệm vụ: Chuẩn bị và chuyển sang scene tiếp theo
// 
// 🚀 Boot = Khởi động (như khởi động máy tính)
// Thường dùng để:
// - Load logo công ty/game
// - Setup cấu hình ban đầu
// - Chuyển sang Preloader
// 
// Kentakitris: Không cần load gì, chỉ chuyển scene!
// ======================================================

import { Scene } from 'phaser';

/**
 * ✅ Boot Scene - Scene đầu tiên của game
 * 
 * Scene này chạy rất nhanh, chỉ để chuyển sang Preloader
 */
export class Boot extends Scene
{
    /**
     * Constructor - Khởi tạo scene với tên 'Boot'
     */
    constructor ()
    {
        super('Boot');
    }

    /**
     * ✅ preload() - Load assets cần thiết
     * 
     * Thông thường load logo hoặc background cho Preloader
     * 
     * Kentakitris: Không cần load gì vì vẽ bằng code!
     * (Programmatic graphics = Vẽ bằng lệnh, không cần ảnh)
     */
    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  For Kentakitris, we don't need any external assets, everything is drawn programmatically.
    }

    /**
     * ✅ create() - Chạy sau khi preload() xong
     * 
     * Chuyển sang scene 'Preloader' ngay lập tức
     * 
     * 📍 this.scene.start() = Chuyển scene
     */
    create ()
    {
        this.scene.start('Preloader'); // Chuyển sang Preloader
    }
}
