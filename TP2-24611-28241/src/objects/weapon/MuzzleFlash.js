export default class MuzzleFlash extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, flipX = false) {
    super(scene, x, y, texture);

    this.setOrigin(0.5, 0.5);
    this.setDepth(30);
    this.setFlipX(flipX);

    scene.add.existing(this);

    // Animação breve
    this.setScale(1);
    this.setAlpha(1);

    scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 1.5,
      duration: 100,
      onComplete: () => this.destroy()
    });
  }
}