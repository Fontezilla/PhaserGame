import Phaser       from 'phaser';
import Player       from '../objects/player/Player.js';
import SpawnWeapon  from '../objects/weapon/SpawnWeapon.js';
import mapData      from '../data/mapData.js';
import gameData     from '../data/gameData.js';

export default class GameScene extends Phaser.Scene {
  constructor() { 
    super('GameScene'); 
  }

  init(data) {
    this.selectedMapKey = data.mapKey || 'IndustrialMap';
  }

  create() {
    console.log('[GameScene] Tem animação?', this.anims.exists('player-punk-fists-idle'));

    this.physics.world.gravity.y = gameData.globalConfig.gravityY;
    this.pickupGroup = this.physics.add.group();

    const mapConfig = mapData[this.selectedMapKey];
    this.tilemap = this.make.tilemap({ key: mapConfig.key });

    const tilesets = mapConfig.tilesets.map(ts =>
      this.tilemap.addTilesetImage(ts.name, ts.key)
    );

    this.add.tileSprite(
      0, 0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels,
      `${mapConfig.key}_1`
    ).setOrigin(0, 0).setScrollFactor(0);

    this.bg2 = this.add.tileSprite(
      0, 0, this.scale.width, 648, `${mapConfig.key}_2.1`
    ).setOrigin(0, 0).setScrollFactor(0);

    ['3.1', '4.1', '5.1'].forEach((name, i) => {
      this.add.image(
        this.tilemap.widthInPixels / 2,
        150 + i * 50,
        `${mapConfig.key}_${name}`
      ).setOrigin(0.5, 0).setScrollFactor(0);
    });

    this.tilemap.createLayer(mapConfig.layers.wall,    tilesets, 0, 0);
    this.tilemap.createLayer(mapConfig.layers.objects, tilesets, 0, 0);

    this.groundLayer = this.tilemap.createLayer(
      mapConfig.layers.ground,
      tilesets,
      0,
      0
    );

    const tileset = this.tilemap.tilesets[0];
    const oneWayLocal = [71, 17];
    const oneWayGlobal = oneWayLocal.map(id => tileset.firstgid + id);
    this.oneWayTileIndexes = oneWayGlobal;

    this.groundLayer.setCollisionByExclusion([-1]);
    this.groundLayer.forEachTile(tile => {
      if (oneWayGlobal.includes(tile.index)) {
        tile.setCollision(true, false, true, false, false);
      }
    });

    this.physics.world.setBounds(
      0, 0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );

    const { spawn_1: s1, spawn_2: s2 } = mapConfig.spawnOffset;

    this.player1 = new Player(this, s1.x, s1.y, {
      slot:        'player1',
      character:   'punk',
      controls:    gameData.playerControls.player1,
      tilemap:     this.tilemap,
      groundLayer: this.groundLayer,
      flipX: false
    });

    this.player2 = new Player(this, s2.x, s2.y, {
      slot:        'player2',
      character:   'cyborg',
      controls:    gameData.playerControls.player2,
      tilemap:     this.tilemap,
      groundLayer: this.groundLayer,
      flipX: true
    });

    this.physics.add.collider(this.player1.sprite, this.groundLayer);
    this.physics.add.collider(this.player2.sprite, this.groundLayer);

    const cam = this.cameras.main;
    cam.setBounds(
      0, 0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );

    this.weaponSpawner = new SpawnWeapon(this, this.tilemap, this.groundLayer);

    const tileX = 6;
    const tileY = 1;
    this.weaponSpawner.spawnAtTile(tileX - 1, tileY, 'pistol');
    const tileXOpposite = this.tilemap.width - tileX;
    this.weaponSpawner.spawnAtTile(tileXOpposite, tileY, 'pistol');

    this.time.addEvent({
      delay: 20000,
      loop: true,
      callback: () => this.weaponSpawner.spawnRandom()
    });

    this.players = [this.player1, this.player2];

    // Garantir que a música toca sempre ao entrar na cena
    let music = this.sound.get('gameMusic');
    if (!music) {
      music = this.sound.add('gameMusic', { volume: 0.5, loop: true });
    }
    if (!music.isPlaying) {
      music.play();
    }
  }

  update() {
    this.player1.update();
    this.player2.update();

    const cam   = this.cameras.main;
    const midX  = (this.player1.sprite.x + this.player2.sprite.x) / 2;
    const midY  = (this.player1.sprite.y + this.player2.sprite.y) / 2;
    const halfW = cam.width / 2;
    const halfH = cam.height / 2;

    cam.centerOn(
      Phaser.Math.Clamp(midX, halfW, this.tilemap.widthInPixels - halfW),
      Phaser.Math.Clamp(midY, halfH, this.tilemap.heightInPixels - halfH)
    );

    this.bg2.tilePositionX += 0.1;
  }

  registerMeleeCollision(hitArea, attacker, damage) {
    this.players.forEach(target => {
      if (target === attacker) return;

      this.physics.add.overlap(hitArea, target.sprite, () => {
        if (target.isInvulnerable) return;
        target.takeDamage(damage);
        hitArea.destroy();
      });
    });
  }

  registerBulletCollision(bullet, shooterPlayer) {
    this.players.forEach(target => {
      if (target === shooterPlayer) return;

      this.physics.add.overlap(
        bullet,
        target.sprite,
        () => {
          if (target.isInvulnerable) return;
          target.takeDamage(bullet.weaponStats.damage);
          bullet.destroy();
        }
      );
    });
  }
}
