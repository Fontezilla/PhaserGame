import weaponData from '../../data/weaponData.js';

export default class SpawnWeapon {
  constructor (scene, tilemap, groundLayer) {
    this.scene       = scene;
    this.tilemap     = tilemap;
    this.groundLayer = groundLayer;
  }

  getValidWeaponKeys () {
    return Object.keys(weaponData).filter(
      key => weaponData[key]?.file && key !== 'fists'
    );
  }

  getGravityFactor (weapon) {
    return weapon.gravityFactor ?? 0.001;
  }

  spawnRandom (maxTries = 50) {
    const keys = this.getValidWeaponKeys();
    if (keys.length === 0) {
      console.warn('[SpawnWeapon] Nenhuma arma válida disponível.');
      return null;
    }
    const weaponKey = Phaser.Utils.Array.GetRandom(keys);
    return this.spawnWeapon(weaponKey, maxTries);
  }

  spawnWeapon (weaponKey, maxTries = 50) {
    const weapon = weaponData[weaponKey];
    if (!weapon?.file) {
      console.warn(`[SpawnWeapon] Arma inválida: ${weaponKey}`);
      return null;
    }

    const { tileWidth, tileHeight, width: mapW, height: mapH } = this.tilemap;

    for (let i = 0; i < maxTries; i++) {
      const tileX   = Phaser.Math.Between(0, mapW - 1);
      const tileY   = Phaser.Math.Between(0, mapH - 1);
      const worldX  = tileX * tileWidth  + tileWidth  / 2;
      const worldY  = tileY * tileHeight + tileHeight / 2;

      const tile      = this.groundLayer.getTileAt(tileX, tileY);
      const tileBelow = this.groundLayer.getTileAt(tileX, tileY + 1);

      if ((!tile || !tile.collides) && tileBelow?.collides) {
        return this._createSprite(worldX, worldY, weaponKey, weapon);
      }
    }

    console.warn(`[SpawnWeapon] Falhou ao posicionar ${weaponKey}`);
    return null;
  }

  spawnAtTile (tileX, tileY, weaponKey) {
    const weapon = weaponData[weaponKey];
    if (!weapon?.file) {
      console.warn(`[SpawnWeapon] Arma inválida: ${weaponKey}`);
      return null;
    }

    const { tileWidth, tileHeight } = this.tilemap;
    const centerX = tileX * tileWidth  + tileWidth  / 2;
    const centerY = tileY * tileHeight + tileHeight / 2;

    return this._createSprite(centerX, centerY, weaponKey, weapon);
  }

  _createSprite (worldX, worldY, weaponKey, weapon) {
    const sprite = this.scene.physics.add
      .sprite(worldX, worldY, weapon.file)
      .setOrigin(0.5);

    const gFactor = this.getGravityFactor(weapon);
    sprite.body.setGravityY(this.scene.physics.world.gravity.y * gFactor);

    sprite
      .setData('weaponKey', weaponKey)
      .setData('isPickup',  true)
      .setData('idleStarted', false)
      .setImmovable(false)
      .setDepth(1)
      .setName(`pickup-${weaponKey}`);

    if (this.scene.pickupGroup) {
      this.scene.pickupGroup.add(sprite);
    }

    this.scene.physics.add.collider(sprite, this.groundLayer, () => {
      if (!sprite.getData('idleStarted')) {
        sprite.setData('idleStarted', true);
        this.enableIdleEffect(sprite);
      }
    });

    return sprite;
  }

  enableIdleEffect (sprite) {
    sprite.body.setAllowGravity(false);
    sprite.body.setVelocity(0, 0);
    sprite.body.moves = false;

    const baseY = sprite.y;
    let   t     = 0;

    const event = this.scene.time.addEvent({
      delay: 16,
      loop:  true,
      callback: () => {
        if (!sprite.active) return; // segurança
        sprite.y = baseY + Math.sin(t) * 4;
        sprite.setScale(Math.cos(t), 1);
        t += 0.05;
      }
    });

    sprite.once('destroy', () => event.remove());
  }
}