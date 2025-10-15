import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  For Kentakitris, we don't need any external assets, everything is drawn programmatically.
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
