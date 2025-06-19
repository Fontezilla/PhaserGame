import Phaser from 'phaser';
import gameData from '../../data/gameData.js';

export default class PlayerController {
  constructor(scene, player, keyBindings, config = {}) {
    this.scene = scene;
    this.player = player;
    this.sprite = player.sprite;

    this.keys = scene.input.keyboard.addKeys({
      left:   keyBindings.left,
      right:  keyBindings.right,
      up:     keyBindings.up,
      down:   keyBindings.down,
      jump:   keyBindings.jump,
      attack: keyBindings.attack,
      pick:   keyBindings.pick
    });

    this.tilemap     = config.tilemap;
    this.groundLayer = config.groundLayer;

    this.lastDownTime    = 0;
    this.dropTapInterval = 250;

    this.lastJumpPressed = 0;
    this.jumpCooldown    = 250;

    this.jumpCount = 0;
    this.wasOnFloorLastFrame = false;
  }

  update() {
    const body = this.sprite.body;
    const now  = this.scene.time.now;
    const speed = this.player.currentSpeed;

    const onFloor = body.onFloor?.() ?? false;

    if (onFloor && !this.wasOnFloorLastFrame) {
      this.jumpCount = 0;
      this.player.hasDoubleJumped = false;
    }

    this.wasOnFloorLastFrame = onFloor;

    let moved = false;

    if (this.keys.left.isDown) {
      body.setVelocityX(-speed);
      this.sprite.setFlipX(true);
      moved = true;
    } else if (this.keys.right.isDown) {
      body.setVelocityX(speed);
      this.sprite.setFlipX(false);
      moved = true;
    } else {
      body.setVelocityX(0);
    }

    const aim = new Phaser.Math.Vector2(
      (this.keys.left.isDown ? -1 : this.keys.right.isDown ? 1 : 0),
      (this.keys.up.isDown   ? -1 : this.keys.down.isDown  ? 1 : 0)
    );

    if (aim.lengthSq() > 0) {
      aim.normalize();
    } else {
      aim.set(this.sprite.flipX ? -1 : 1, 0);
    }

    if (!moved && aim.x !== 0) {
      this.sprite.setFlipX(aim.x < 0);
    }

    this.updateBodyOffset();
    this.player.setAimDirection(aim);

    if (Phaser.Input.Keyboard.JustDown(this.keys.jump) &&
        now - this.lastJumpPressed > this.jumpCooldown) {

      const force = gameData.globalConfig.jumpForce;

      if (this.jumpCount === 0) {
        body.setVelocityY(-force);
        this.jumpCount = 1;
        this.scene.sound.play('jump', { volume: 0.5 });
        this.player.hasDoubleJumped = false;
      } else if (
        this.jumpCount === 1 &&
        this.player.PlayerMode.allowsDoubleJump()
      ) {
        body.setVelocityY(-force * gameData.globalConfig.multiplierDouble);
        this.jumpCount = 2;
        this.scene.sound.play('jump', { volume: 0.5 });
        this.player.hasDoubleJumped = true;

        if (this.player.PlayerMode.allowsInvulnerability()) {
          this.player.startInvulnerability?.(150);
        }
      }

      this.lastJumpPressed = now;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.down)) {
      if (now - this.lastDownTime < this.dropTapInterval) {
        this.dropFromPlatform();
        this.lastDownTime = 0;
      } else {
        this.lastDownTime = now;
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
      this.player.attack();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.pick)) {
      if (this.player.weapon.isFists()) {
        this.player.checkWeaponPickup();
      } else {
        this.player.dropWeapon();
      }
    }
  }

  dropFromPlatform() {
    const body = this.sprite.body;
    if (!body.onFloor()) return;

    const tileBelow = this.groundLayer.getTileAtWorldXY(
      this.sprite.x,
      body.bottom + 1
    );
    if (!tileBelow) return;

    const tileset      = this.tilemap.tilesets[0];
    const oneWayLocal  = [71, 17];
    const oneWayGlobal = oneWayLocal.map(id => tileset.firstgid + id);

    if (!oneWayGlobal.includes(tileBelow.index)) return;

    body.checkCollision.down = false;
    body.setVelocityY(30);

    this.scene.time.delayedCall(200, () => {
      body.checkCollision.down = true;
    });
  }

  updateBodyOffset() {
    const body = this.sprite.body;

    const width   = 14;
    const height  = 22;
    const offsetY = 20;

    const offsetX = this.sprite.flipX
      ? this.sprite.width - width - 10
      : 10;

    body.setSize(width, height);
    body.setOffset(offsetX, offsetY);
  }
}