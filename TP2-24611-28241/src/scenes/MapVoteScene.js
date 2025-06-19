import Phaser from 'phaser';
import mapData from '../data/mapData.js';
import gameData from '../data/gameData.js';

export default class MapVoteScene extends Phaser.Scene {
  constructor() {
    super('MapVoteScene');
  }

  init() {
    this.playerSelections = {
      player1: 0,
      player2: 0,
      confirmed: { player1: false, player2: false }
    };
  }

  create() {
    const { width, height } = this.scale;
    const controls = gameData.playerControls;
    this.mapKeys = Object.keys(mapData);

    this.add.image(width / 2, height / 2, 'background')
      .setOrigin(0.5)
      .setDisplaySize(width, height)
      .setDepth(0);

    this.add.text(width / 2, 40, 'Votação de Mapas', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'monospace'
    }).setOrigin(0.5);

    const spacing = 300;
    const startX = (width - spacing * (this.mapKeys.length - 1)) / 2;
    this.mapSprites = {};

    this.mapKeys.forEach((mapKey, i) => {
      const x = startX + i * spacing;
      const y = height / 2 + 60;

      this.add.image(x, y, `industrialView`)
        .setDisplaySize(240, 160)
        .setOrigin(0.5);

      this.add.text(x, y + 90, mapKey, {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'monospace'
      }).setOrigin(0.5);

      this.mapSprites[mapKey] = { x, y };
    });

    this.punkIcon = this.add.sprite(0, 0, 'player-punk-fists-idle')
      .setScale(1.5)
      .setDepth(1)
      .play('player-punk-fists-idle');

    this.cyborgIcon = this.add.sprite(0, 0, 'player-cyborg-fists-idle')
      .setScale(1.5)
      .setFlipX(true)
      .setDepth(1)
      .play('player-cyborg-fists-idle');

    this.updateIconPositions();

    this.p1Keys = this.input.keyboard.addKeys({
      left: controls.player1.left,
      right: controls.player1.right,
      confirm: controls.player1.attack
    });

    this.p2Keys = this.input.keyboard.addKeys({
      left: controls.player2.left,
      right: controls.player2.right,
      confirm: controls.player2.attack
    });
  }

  updateIconPositions() {
    const cardW = 240, cardH = 160;
    const above = 40, xMargin = 30;

    const map1 = this.mapKeys[this.playerSelections.player1];
    const map2 = this.mapKeys[this.playerSelections.player2];
    const pos1 = this.mapSprites[map1];
    const pos2 = this.mapSprites[map2];

    this.punkIcon.setPosition(pos1.x - cardW / 2 + xMargin, pos1.y - cardH / 2 - above);
    this.cyborgIcon.setPosition(pos2.x + cardW / 2 - xMargin, pos2.y - cardH / 2 - above);
  }

  update() {
    const p1 = this.playerSelections;
    const { left: l1, right: r1, confirm: c1 } = this.p1Keys;
    const { left: l2, right: r2, confirm: c2 } = this.p2Keys;

    // Player 1
    if (Phaser.Input.Keyboard.JustDown(l1)) {
      p1.player1 = Math.max(0, p1.player1 - 1);
      this.updateIconPositions();
    }
    if (Phaser.Input.Keyboard.JustDown(r1)) {
      p1.player1 = Math.min(this.mapKeys.length - 1, p1.player1 + 1);
      this.updateIconPositions();
    }
    if (Phaser.Input.Keyboard.JustDown(c1)) {
      p1.confirmed.player1 = true;
      this.punkIcon.setTint(0x3399ff);
      this.sound.play('menuClick', { volume: 0.5 });
    }

    // Player 2
    if (Phaser.Input.Keyboard.JustDown(l2)) {
      p1.player2 = Math.max(0, p1.player2 - 1);
      this.updateIconPositions();
    }
    if (Phaser.Input.Keyboard.JustDown(r2)) {
      p1.player2 = Math.min(this.mapKeys.length - 1, p1.player2 + 1);
      this.updateIconPositions();
    }
    if (Phaser.Input.Keyboard.JustDown(c2)) {
      p1.confirmed.player2 = true;
      this.cyborgIcon.setTint(0xff3333);
      this.sound.play('menuClick', { volume: 0.5 });
    }

    const c = p1.confirmed;
    if (c.player1 && c.player2) {
      const m1 = this.mapKeys[p1.player1];
      const m2 = this.mapKeys[p1.player2];
      const chosen = (m1 === m2) ? m1 : Phaser.Utils.Array.GetRandom([m1, m2]);

      const menuMusic = this.sound.get('menuMusic');
      if (menuMusic?.isPlaying) {
        menuMusic.stop();
      }

      this.scene.start('GameScene', { mapKey: chosen });
    }
  }
}