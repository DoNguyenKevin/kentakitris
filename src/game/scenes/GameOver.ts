import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    gameOverText: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
    restartText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create (data: { score: number })
    {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x0d0d1a);

        this.gameOverText = this.add.text(512, 250, 'GAME OVER', {
            fontFamily: 'Arial Black', 
            fontSize: '64px', 
            color: '#FF0000',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        const finalScore = data.score || 0;
        this.scoreText = this.add.text(512, 350, `Final Score: ${finalScore}`, {
            fontFamily: 'Arial', 
            fontSize: '32px', 
            color: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);

        this.restartText = this.add.text(512, 450, 'Click to Play Again', {
            fontFamily: 'Arial', 
            fontSize: '24px', 
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);

        // Make restart text blink
        this.tweens.add({
            targets: this.restartText,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Click to restart
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
