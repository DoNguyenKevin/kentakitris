// src/game/main.ts
// ======================================================
// ✅ File khởi tạo Phaser Game - Điểm bắt đầu của game
// 
// File này cấu hình và khởi động Phaser game engine
// 
// Các bước:
// 1. Import các Scene (màn hình) của game
// 2. Cấu hình Phaser (kích thước, renderer, scenes...)
// 3. Export hàm StartGame() để React gọi
// 
// 🎮 Phaser = Game engine chuyên nghiệp (HTML5)
//    Được dùng bởi hàng ngàn game trên web!
// ======================================================

import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

// 🎮 Cấu hình Phaser Game
// ======================================================
// Đối tượng này định nghĩa cách Phaser hoạt động

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,              // AUTO = Tự chọn WebGL hoặc Canvas
    width: 1024,             // Chiều rộng game (pixels)
    height: 768,             // Chiều cao game (pixels)
    parent: 'game-container', // ID của HTML element chứa game
    backgroundColor: '#028af8', // Màu nền (xanh dương)
    scene: [                 // Danh sách các Scene (theo thứ tự)
        Boot,                // Scene 1: Khởi động
        Preloader,           // Scene 2: Load assets
        MainMenu,            // Scene 3: Menu chính
        MainGame,            // Scene 4: Game play
        GameOver             // Scene 5: Game over
    ]
};

/**
 * ✅ StartGame() - Khởi động Phaser game
 * 
 * Hàm này được gọi từ React component
 * Tạo instance mới của Phaser.Game với config ở trên
 * 
 * Tham số:
 * - parent: ID của HTML element để chứa game
 * 
 * Trả về: Phaser.Game instance
 * 
 * ❓ Câu hỏi: Tại sao trả về Game instance?
 * 💡 Trả lời: Để React có thể điều khiển game (pause, resume, destroy...)
 */
const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
