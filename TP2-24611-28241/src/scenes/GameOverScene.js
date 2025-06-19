import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.winner = data.winner || 'Desconhecido';
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(width, height);

    let music = this.sound.get('menuMusic');
    if (!music) {
      music = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
    }
    if (!music.isPlaying) {
      music.play();
    }

    this.add.text(width / 2, height / 2 - 120, '💀 FIM DE JOGO 💀', {
      fontSize: '60px',
      fontFamily: 'Arial Black',
      color: '#ff3333',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 40, `${this.winner} venceu!`, {
      fontSize: '36px',
      fontFamily: 'Verdana',
      color: '#ffff66',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    const retryBtn = this.createButton(width / 2, height / 2 + 50, 'Jogar Novamente', '#00ffaa', () => {
      this.scene.start('GameScene');
    });

    const menuBtn = this.createButton(width / 2, height / 2 + 120, 'Voltar ao Menu', '#ff6666', () => {
      this.scene.start('StartScene');
    });
  }

  createButton(x, y, text, color, callback) {
    const button = this.add.text(x, y, text, {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: color,
      backgroundColor: '#222222',
      padding: { x: 15, y: 10 },
      align: 'center',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setStyle({ backgroundColor: '#444444' }));
    button.on('pointerout', () => button.setStyle({ backgroundColor: '#222222' }));
    button.on('pointerdown', callback);

    return button;
  }
}
