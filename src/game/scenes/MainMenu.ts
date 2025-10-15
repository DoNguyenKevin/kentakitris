import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    logoText: Phaser.GameObjects.Text;
    startText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x0d0d1a);

        // Title
        this.logoText = this.add.text(512, 200, '🎮 KENTAKITRIS 🎮', {
            fontFamily: 'Arial Black', 
            fontSize: '64px', 
            color: '#FFD700',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(512, 300, 'A Tetris Game with Phaser', {
            fontFamily: 'Arial', 
            fontSize: '24px', 
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        // Start button
        this.startText = this.add.text(512, 400, 'Click to Start', {
            fontFamily: 'Arial', 
            fontSize: '32px', 
            color: '#00FF88',
            align: 'center'
        }).setOrigin(0.5);

        // Make start text blink
        this.tweens.add({
            targets: this.startText,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Controls info
        this.add.text(512, 550, 'Controls:', {
            fontFamily: 'Arial', 
            fontSize: '20px', 
            color: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 590, '← → : Move  |  ↑ : Rotate  |  SPACE : Drop', {
            fontFamily: 'Arial', 
            fontSize: '18px', 
            color: '#AAAAAA',
            align: 'center'
        }).setOrigin(0.5);

        // Click to start
        this.input.once('pointerdown', () => {
            this.changeScene();
        });

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        this.scene.start('Game');
    }

    moveLogo (reactCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        // Legacy method - no longer used
    }
}
