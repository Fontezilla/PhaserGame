import Phaser from 'phaser';

export default class Bullet extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, directionVec, weaponStats) {
    super(scene, x, y, texture);

    this.scene = scene;
    this.weaponStats = weaponStats;

    // Adiciona ao jogo e ativa física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    const speed = weaponStats.projectileSpeed;
    this.body.setVelocity(directionVec.x * speed, directionVec.y * speed);
    this.body.setAllowGravity(false);
    this.setDepth(20);

    const angle = Phaser.Math.RadToDeg(Math.atan2(directionVec.y, directionVec.x));
    this.setRotation(Phaser.Math.DegToRad(angle));

    const lifetime = (weaponStats.range / speed) * 1000;
    scene.time.delayedCall(lifetime, () => this.destroy());
  }

  preUpdate(time, delta) {
    super.preUpdate?.(time, delta);
  }

  setCollisionHandler(groundLayer, oneWayTileIndexes = []) {
    this.scene.physics.add.collider(this, groundLayer, (bullet, tile) => {
      if (!oneWayTileIndexes.includes(tile.index)) {
        bullet.destroy();
      }
    });
  }
}