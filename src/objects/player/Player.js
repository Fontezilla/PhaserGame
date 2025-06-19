import Phaser from 'phaser';
import playerData from '../../data/playerData.js';
import PlayerController from './PlayerController.js';
import PlayerMode from './PlayerMode.js';
import PlayerAnimations from './PlayerAnimations.js';
import WeaponManager from '../weapon/WeaponManager.js';
import weaponDataMap from '../../data/weaponData.js';

export default class Player {
  constructor (scene, x, y, config) {
    this.scene = scene;

    this.slotId       = config.slot ?? 'player1';
    this.characterKey = config.character ?? 'biker';

    this.PlayerMode = new PlayerMode('fists');

    const initialTexture = `player-${this.characterKey}-fists-idle`;
    this.sprite = scene.physics.add
      .sprite(x, y, initialTexture)
      .setCollideWorldBounds(true);

    this.sprite.body.setSize(14, 22);
    this.sprite.body.setOffset(10, 20);
    this.sprite.setDepth(10);

    const base = playerData[this.characterKey];
    this.baseSpeed = base.speed;
    this.maxHealth = base.health;
    this.health    = base.health;

    this.controller = new PlayerController(scene, this, config.controls, {
      tilemap:     config.tilemap,
      groundLayer: config.groundLayer
    });

    this.animations = new PlayerAnimations(this);

    this.hasDoubleJumped = false;
    this.isAttacking     = false;
    this.isInvulnerable  = false;

    this.weaponSprite = null;
    this.weapon       = new WeaponManager(this, scene);
    this.aimDirection = { x: 1, y: 0 };
    this.armSprite1   = null;
    this.armSprite2   = null;
    this.armContainer = null;

    this.sprite.setFlipX(config.flipX ?? false);
  }

  get currentSpeed () {
    const factor = this.PlayerMode.isFists()
      ? 1
      : this.PlayerMode.isLight()
        ? 0.85
        : 0.65;
    return this.baseSpeed * factor;
  }

  onGround () {
    return this.sprite.body?.onFloor?.() ?? false;
  }

  update () {
    this.controller.update();
    this.animations.update();
    this.updateArmContainerTransform();
  }

  setMode (modeName) {
    this.PlayerMode.set(modeName);
    this.animations.reset();

    const modeKey    = this.PlayerMode.name;
    const newTexture = `player-${this.characterKey}-${modeKey}-idle`;
    this.sprite.setTexture(newTexture);

    this.updateArmSprite();
  }

  updateArmSprite () {
    if (this.armSprite1) { this.armSprite1.destroy(); this.armSprite1 = null; }
    if (this.armSprite2) { this.armSprite2.destroy(); this.armSprite2 = null; }

    const { x, y } = this.sprite;

    if (this.PlayerMode.isFists()) {
      this.createArmContainer();
      return;
    }

    if (this.PlayerMode.isLight()) {
      const key = `player-${this.characterKey}-light-armed-arm`;
      this.armSprite1 = this.scene.add.sprite(x, y, key);
    } else if (this.PlayerMode.isHeavy()) {
      const key1 = `player-${this.characterKey}-heavy-armed-arm`;
      const key2 = `player-${this.characterKey}-heavy-armed-arm2`;
      this.armSprite1 = this.scene.add.sprite(x, y, key1);
      this.armSprite2 = this.scene.add.sprite(x, y, key2);
    }

    this.createArmContainer();
  }

  startInvulnerability (duration = 300) {
    this.isInvulnerable = true;
    this.sprite.setAlpha(0.5);
    this.scene.time.delayedCall(duration, () => {
      this.isInvulnerable = false;
      this.sprite.setAlpha(1);
    });
  }

  equipWeaponSprite (weaponKey) {
    if (this.weaponSprite) {
      this.weaponSprite.destroy();
      this.weaponSprite = null;
    }

    if (!weaponKey) {
      this.createArmContainer();
      return;
    }

    const weaponData = weaponDataMap[weaponKey];
    if (!weaponData?.file) {
      this.createArmContainer();
      return;
    }

    this.weaponSprite = this.scene.add
      .sprite(this.sprite.x, this.sprite.y, weaponData.file)
      .setOrigin(0, 0.5);

    this.createArmContainer();
  }

  createArmContainer () {
    if (!this.armContainer) {
      const behind = this.armSprite2 == null;
      const depth  = behind ? this.sprite.depth - 1 : this.sprite.depth + 1;
      this.armContainer = this.scene.add.container(0, 0).setDepth(depth);
    } else {
      this.armContainer.removeAll(false);
    }

    if (this.armSprite1)   this.armContainer.add(this.armSprite1);
    if (this.armSprite2)   this.armContainer.add(this.armSprite2);
    if (this.weaponSprite) this.armContainer.add(this.weaponSprite);
  }

  updateArmContainerTransform () {
    if (!this.armContainer) return;

    const { x: sx, y: sy, flipX } = this.sprite;
    const sign = flipX ? -1 : 1;

    const modeCfg   = playerData[this.characterKey].modes[this.PlayerMode.name] || {};
    const armCfg    = modeCfg.armConfig   ?? {};
    const weaponOff = modeCfg.weaponOffset ?? { x: 0, y: 0 };
    const pivot     = armCfg.pivot         ?? { x: 0, y: 0 };

    const off1 = armCfg.offset1 ?? armCfg.offset ?? { x: 0, y: 0 };
    const off2 = armCfg.offset2 ?? off1;

    if (this.armSprite1)   this.armSprite1.setPosition(off1.x - pivot.x, off1.y - pivot.y);
    if (this.armSprite2)   this.armSprite2.setPosition(off2.x - pivot.x, off2.y - pivot.y);
    if (this.weaponSprite) this.weaponSprite.setPosition(weaponOff.x - pivot.x, weaponOff.y - pivot.y);

    this.armContainer.setScale(sign, 1);

    const pivotX = flipX ? -pivot.x : pivot.x;
    this.armContainer.setPosition(
      sx + pivotX,
      sy + pivot.y
    );

    let rot = Phaser.Math.Angle.Between(0, 0, this.aimDirection.x, this.aimDirection.y);
    if (flipX) rot = Math.PI - rot;
    this.armContainer.rotation = rot;
  }

  setAimDirection (vec) {
    this.aimDirection.x = vec.x;
    this.aimDirection.y = vec.y;
  }

  takeDamage(amount) {
    if (this.isInvulnerable) return;

    this.health -= amount;
    this.flashTint(0xff0000);

    this.scene.sound.play('hurt', { volume: 0.5 });

    if (this.health <= 0) {
      this.health = 0;
      this.die();
    } else {
      this.startInvulnerability();
    }
  }

  flashTint(color = 0xffffff, duration = 100) {
    this.sprite.setTint(color);
    if (this.armSprite1)   this.armSprite1.setTint(color);
    if (this.armSprite2)   this.armSprite2.setTint(color);
    if (this.weaponSprite) this.weaponSprite.setTint(color);

    this.scene.time.delayedCall(duration, () => {
      this.sprite.clearTint();
      if (this.armSprite1)   this.armSprite1.clearTint();
      if (this.armSprite2)   this.armSprite2.clearTint();
      if (this.weaponSprite) this.weaponSprite.clearTint();
    });
  }

  die() {
    this.sprite.anims.play(`player-${this.characterKey}-fists-death`);

    this.sprite.once('animationcomplete', () => {
      this.sprite.setActive(false).setVisible(false);
      this.sprite.body.enable = false;

      const music = this.scene.sound.get('gameMusic');
      if (music) music.stop();

      this.scene.scene.start('GameOverScene', {
        winner: this.slotId === 'player1' ? 'Player 2' : 'Player 1'
      });
    });
  }

  attack ()            { this.weapon.attack(); }
  dropWeapon ()        { this.weapon.drop(); }
  checkWeaponPickup () { this.weapon.pickupNearby(); }
}