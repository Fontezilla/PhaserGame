import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  preload() {
    this.load.image('background', 'src/assets/background/Background.png');
    this.load.audio('menuClick', 'src/assets/audio/MenuClick.mp3');
    this.load.audio('menuMusic', 'src/assets/audio/MenuMusic.mp3');
  }

  create() {
    const { width, height } = this.scale;

    if (!this.sound.get('menuMusic')) {
      const music = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
      music.play();
    }


    this.add.image(width / 2, height / 2, 'background')
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    this.add.text(width / 2, height / 2 - 100, 'Gun Fight Ultimate', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    const startText = this.add.text(width / 2, height / 2 + 20, 'Pressiona ENTER para Jogar', {
      fontSize: '24px',
      color: '#aaaaaa',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    this.input.keyboard.once('keydown-ENTER', () => {
      this.sound.play('menuClick', { volume: 0.5 });
      this.scene.start('PreloadScene');
    });
  }
}
