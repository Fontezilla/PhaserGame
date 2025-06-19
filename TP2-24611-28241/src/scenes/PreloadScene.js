import Phaser from 'phaser';
import WeaponUtils from '../utils/WeaponUtils.js';
import PlayerUtils from '../utils/PlayerUtils.js';
import MapUtils from '../utils/MapUtils.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    const { width, height } = this.scale;

    this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(width, height);

    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Carregando...',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    }).setOrigin(0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: {
        font: '16px monospace',
        fill: '#ffffff'
      }
    }).setOrigin(0.5);

    this.load.on('progress', value => {
      percentText.setText(`${parseInt(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBox.destroy();
      progressBar.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    WeaponUtils.preloadWeaponAssets(this);
    PlayerUtils.preloadPlayerAssets(this);
    MapUtils.preloadMapAssets(this);

    this.load.audio('gameMusic', 'src/assets/audio/GameMusic.mp3');
    this.load.audio('jump', 'src/assets/audio/Jump.mp3');
    this.load.audio('gunshot', 'src/assets/audio/Gunshot.mp3');
    this.load.audio('hurt', 'src/assets/audio/Hurt.mp3');

    this.load.image('industrialView', 'src/assets/background/IndustrialView.png');
  }

  create() {
    PlayerUtils.registerPlayerAnims(this);
    WeaponUtils.registerWeaponsAnims(this);

    this.scene.start('MapVoteScene');
  }
}