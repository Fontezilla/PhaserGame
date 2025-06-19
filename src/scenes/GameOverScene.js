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

    if (!this.sound.get('menuMusic')) {
      const music = this.sound.add('menuMusic', { loop: true, volume: 0.5 });
      music.play();
    }

    this.add.text(width / 2, height / 2 - 80, 'FIM DE JOGO', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 20, `${this.winner} venceu!`, {
      fontSize: '32px',
      color: '#ffcc00'
    }).setOrigin(0.5);

    const retryBtn = this.add.text(width / 2, height / 2 + 60, 'Jogar Novamente', {
      fontSize: '28px',
      color: '#00ffcc'
    }).setOrigin(0.5).setInteractive();

    const menuBtn = this.add.text(width / 2, height / 2 + 120, 'Voltar ao Menu', {
      fontSize: '28px',
      color: '#ff6666'
    }).setOrigin(0.5).setInteractive();

    retryBtn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    menuBtn.on('pointerdown', () => {
      this.scene.start('StartScene');
    });
  }
}
