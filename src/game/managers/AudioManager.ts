// src/game/managers/AudioManager.ts
// ======================================================
// ✅ Audio Manager - Quản lý âm thanh trong game
// 
// Manager này quản lý:
// - Sound effects (move, rotate, lock, clear, game over)
// - Background music
// - Volume controls
// - Mute/unmute
// 
// Sử dụng Phaser's Sound System
// ======================================================

import { Scene } from 'phaser';
import { Settings } from '../scenes/Settings';

/**
 * ✅ AudioManager - Quản lý toàn bộ âm thanh game
 * 
 * Singleton pattern: Chỉ có 1 instance duy nhất
 * Load settings từ Settings scene
 */
export class AudioManager {
    private scene: Scene;
    
    // 🎵 Music
    private bgMusic: Phaser.Sound.BaseSound | null = null;
    
    // 🔊 Sound effects
    private sounds: Map<string, Phaser.Sound.BaseSound> = new Map();
    
    // ⚙️ Settings
    private settings: {
        soundEnabled: boolean;
        musicEnabled: boolean;
        soundVolume: number;
        musicVolume: number;
    };

    constructor(scene: Scene) {
        this.scene = scene;
        
        // 📥 Load settings
        this.loadSettings();
        
        // 🎵 Initialize sounds (với web audio fallback)
        this.initSounds();
    }

    /**
     * ✅ loadSettings() - Load audio settings
     */
    private loadSettings() {
        this.settings = Settings.getSettings();
    }

    /**
     * ✅ initSounds() - Khởi tạo sound effects
     * 
     * Tạo các âm thanh cơ bản sử dụng Web Audio API
     * Vì không có file audio thật, ta dùng synthesized sounds
     */
    private initSounds() {
        // 🎵 Background music (sẽ được add sau khi có file audio)
        // Hiện tại tạo silent sound để không bị lỗi
        
        // Các sound effects sẽ được tạo khi cần (lazy loading)
        // Điều này tránh lỗi khi chưa có audio files
    }

    /**
     * ✅ playSound() - Phát sound effect
     * 
     * @param soundName - Tên sound: 'move', 'rotate', 'lock', 'clear', 'gameover'
     */
    playSound(soundName: string) {
        if (!this.settings.soundEnabled) return;
        
        // 🎵 Tạo synthesized sound effects
        switch (soundName) {
            case 'move':
                this.playBeep(200, 0.05, 'sine');
                break;
            case 'rotate':
                this.playBeep(400, 0.08, 'sine');
                break;
            case 'lock':
                this.playBeep(150, 0.15, 'square');
                break;
            case 'clear':
                this.playMultiBeep([523, 659, 784, 1047], 0.1);
                break;
            case 'gameover':
                this.playDescendingBeep();
                break;
            case 'levelup':
                this.playAscendingBeep();
                break;
            default:
                console.warn(`Unknown sound: ${soundName}`);
        }
    }

    /**
     * ✅ playBeep() - Phát một beep đơn giản
     * 
     * Sử dụng Web Audio API để tạo âm thanh tổng hợp
     * 
     * @param frequency - Tần số (Hz), VD: 440 = nốt A
     * @param duration - Độ dài (giây)
     * @param type - Loại wave: 'sine', 'square', 'sawtooth', 'triangle'
     */
    private playBeep(frequency: number, duration: number, type: OscillatorType = 'sine') {
        if (!this.settings.soundEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            
            // Volume envelope (fade out)
            gainNode.gain.setValueAtTime(this.settings.soundVolume * 0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    /**
     * ✅ playMultiBeep() - Phát nhiều beeps liên tiếp
     * 
     * Dùng cho clear line effect (âm thanh vui vẻ!)
     * 
     * @param frequencies - Mảng tần số [Do, Mi, Sol, Do]
     * @param noteDuration - Độ dài mỗi note
     */
    private playMultiBeep(frequencies: number[], noteDuration: number) {
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playBeep(freq, noteDuration, 'sine');
            }, index * noteDuration * 1000);
        });
    }

    /**
     * ✅ playAscendingBeep() - Âm thanh tăng dần (level up!)
     */
    private playAscendingBeep() {
        const notes = [262, 330, 392, 523]; // C4, E4, G4, C5
        this.playMultiBeep(notes, 0.1);
    }

    /**
     * ✅ playDescendingBeep() - Âm thanh giảm dần (game over...)
     */
    private playDescendingBeep() {
        const notes = [523, 392, 330, 262]; // C5, G4, E4, C4
        this.playMultiBeep(notes, 0.2);
    }

    /**
     * ✅ playMusic() - Phát background music
     * 
     * Loop mãi cho đến khi dừng
     */
    playMusic() {
        if (!this.settings.musicEnabled) return;
        
        // Tạm thời không có music file
        // Sẽ implement sau khi có audio assets
        
        // if (this.bgMusic && !this.bgMusic.isPlaying) {
        //     this.bgMusic.play({
        //         loop: true,
        //         volume: this.settings.musicVolume,
        //     });
        // }
    }

    /**
     * ✅ stopMusic() - Dừng background music
     */
    stopMusic() {
        if (this.bgMusic && this.bgMusic.isPlaying) {
            this.bgMusic.stop();
        }
    }

    /**
     * ✅ pauseMusic() - Tạm dừng music (có thể resume)
     */
    pauseMusic() {
        if (this.bgMusic && this.bgMusic.isPlaying) {
            this.bgMusic.pause();
        }
    }

    /**
     * ✅ resumeMusic() - Tiếp tục music
     */
    resumeMusic() {
        if (this.bgMusic && this.bgMusic.isPaused) {
            this.bgMusic.resume();
        }
    }

    /**
     * ✅ updateSettings() - Cập nhật settings
     * 
     * Gọi khi user thay đổi settings
     */
    updateSettings() {
        this.loadSettings();
        
        // Cập nhật volume của music nếu đang chạy
        if (this.bgMusic && this.bgMusic.isPlaying) {
            // Phaser's BaseSound has setVolume but TypeScript definition is incomplete
            // Cast to WebAudioSound which has the method
            (this.bgMusic as Phaser.Sound.WebAudioSound).setVolume(this.settings.musicVolume);
        }
        
        // Nếu tắt music → dừng music
        if (!this.settings.musicEnabled) {
            this.stopMusic();
        }
    }

    /**
     * ✅ destroy() - Dọn dẹp
     */
    destroy() {
        this.stopMusic();
        this.sounds.clear();
    }
}
