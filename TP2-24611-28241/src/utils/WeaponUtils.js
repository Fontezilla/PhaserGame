import weaponData from '../data/weaponData.js';

const WeaponUtils = {
  preloadWeaponAssets(scene) {
    for (const key in weaponData) {
      const weapon = weaponData[key];

      if (!weapon.file) continue;

      if (weapon.bulletSprite) {
        scene.load.image(weapon.bulletSprite, `./src/assets/weapons/${weapon.bulletSprite}.png`);
      }

      if (weapon.muzzleSprite) {
        scene.load.spritesheet(weapon.muzzleSprite, `./src/assets/weapons/${weapon.muzzleSprite}.png`, {
          frameWidth: 48,
          frameHeight: 48,
        });
      }

      scene.load.image(weapon.file, `./src/assets/weapons/${weapon.file}.png`);
    }
  },

  registerWeaponsAnims(scene) {
    for (const key in weaponData) {
      const weapon = weaponData[key];

      if (!weapon.file) continue;

      if (weapon.muzzleSprite && !scene.anims.exists(weapon.muzzleSprite)) {
        scene.anims.create({
          key: weapon.muzzleSprite,
          frames: scene.anims.generateFrameNumbers(weapon.muzzleSprite, {
            start: 0,
            end: 5,
          }),
          frameRate: 20,
          repeat: 0,
        });
      }
    }
  }
};

export default WeaponUtils;