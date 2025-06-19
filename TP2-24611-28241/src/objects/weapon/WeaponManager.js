import Phaser        from 'phaser';
import Weapon        from './Weapon.js';
import Bullet        from './Bullet.js';
import MuzzleFlash   from './MuzzleFlash.js';
import weaponDataMap from '../../data/weaponData.js';

export default class WeaponManager {
  constructor(player, scene) {
    this.player = player;
    this.scene  = scene;

    this.bulletGroup = scene.add.group();

    this.setWeapon('fists');

    this.canAttack   = true;
    this.currentAmmo = Infinity;
    this.reloading   = false;
  }

  setWeapon(key) {
    this.weaponKey   = key;
    this.weaponStats = weaponDataMap[key];
    this.weapon      = new Weapon(this.weaponStats);

    this.currentAmmo = this.weapon.ammoCapacity;
    this.player.setMode(this.weapon.mode);
    this.player.equipWeaponSprite(key);
  }

  isFists() {
    return this.weaponKey === 'fists';
  }

  attack() {
    if (!this.canAttack || this.reloading) return;

    if (this.weapon.isRanged() &&
        this.weapon.needsReload() &&
        this.currentAmmo <= 0) {
      return this.reload();
    }

    this.canAttack = false;
    this.scene.time.delayedCall(this.weapon.cooldown, () => {
      this.canAttack = true;
    });

    if (this.weapon.isMelee()) {
      this.performMelee();
    } else {
      this.shootProjectile();
      this.currentAmmo--;
    }
  }

  reload() {
    /*
    if (this.reloading || !this.weapon.reloadTime) return;

    this.reloading = true;
    this.scene.time.delayedCall(this.weapon.reloadTime, () => {
      this.currentAmmo = this.weapon.ammoCapacity;
      this.reloading   = false;
    });
    */
   this.drop();
  }

  performMelee() {
    const { sprite, characterKey, PlayerMode } = this.player;
    
    if (PlayerMode.isFists()) {
      const animKey = `player-${characterKey}-fists-attack`;
      sprite.anims.play(animKey, true);

      this.player.isAttacking = true;

      // Liberta após terminar animação
      sprite.once('animationcomplete', () => {
        this.player.isAttacking = false;
      });
    }

    const range = this.weapon.range || 40;
    const { x, y, flipX } = this.player.sprite;
    const hitboxX = flipX ? x - range : x + range;

    const hitArea = this.scene.add.rectangle(hitboxX, y, range, 20);
    this.scene.physics.add.existing(hitArea);
    hitArea.body.setAllowGravity(false);
    hitArea.body.setImmovable(true);

    this.scene.registerMeleeCollision(
      hitArea,
      this.player,
      this.weapon.damage
    );

    this.scene.time.delayedCall(100, () => hitArea.destroy());
  }

  shootProjectile() {
    const { weaponSprite, aimDirection, flipX } = this.player;

    if (!weaponSprite) {
      console.warn('[WeaponManager] weaponSprite está null!');
      return;
    }

    const worldPos = new Phaser.Math.Vector2();
    weaponSprite.getWorldTransformMatrix().transformPoint(0, 0, worldPos);
    const { x, y } = worldPos;

    const dir = new Phaser.Math.Vector2(aimDirection.x, aimDirection.y);
    if (dir.lengthSq() === 0) {
      console.warn('[WeaponManager] aimDirection inválido, usando fallback {1,0}');
      dir.set(1, 0);
    }
    dir.normalize();

    if (!this.weapon.bulletSprite) {
      console.warn('[WeaponManager] Sem textura bulletSprite!');
      return;
    }

    const bullet = new Bullet(
      this.scene,
      x,
      y,
      this.weapon.bulletSprite,
      dir,
      this.weaponStats
    );

    this.scene.registerBulletCollision(bullet, this.player);

    this.bulletGroup.add(bullet);

    bullet.setCollisionHandler(
      this.scene.groundLayer,
      this.scene.oneWayTileIndexes || []
    );

    if (this.weapon.muzzleSprite) {
      const flash = new MuzzleFlash(
        this.scene,
        x,
        y,
        this.weapon.muzzleSprite,
        !flipX
      );
      flash.setRotation(Phaser.Math.Angle.Between(0, 0, dir.x, dir.y));
    }

    this.scene.sound.play('gunshot', { volume: 0.5 });

    this.scene.tweens.add({
      targets: weaponSprite,
      x: weaponSprite.x - dir.x * 5,
      y: weaponSprite.y - dir.y * 5,
      duration: 50,
      yoyo: true,
      ease: 'Quad.easeOut'
    });
  }

  drop() {
    if (this.isFists() || !this.weaponStats?.file) return;

    this.scene.physics.add.sprite(
      this.player.sprite.x,
      this.player.sprite.y,
      this.weaponStats.file
    )
      .setData('weaponKey', this.weaponKey)
      .setData('isPickup',  true)
      .setDepth(1)
      .setVelocityY(-150);

    this.setWeapon('fists');
  }


  pickupNearby() {
    this.scene.physics.overlap(
      this.player.sprite,
      this.scene.pickupGroup,
      (_p, item) => {
        const weaponKey = item.getData('weaponKey');
        if (weaponKey && weaponKey !== this.weaponKey) {
          item.destroy();
          this.setWeapon(weaponKey);
        }
      }
    );
  }
}