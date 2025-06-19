// Weapon.js
export default class Weapon {
  constructor(data) {
    this.name = data.name;
    this.type = data.type; // 'melee' ou 'ranged'
    this.damage = data.damage ?? 0;
    this.range = data.range ?? 0;
    this.cooldown = data.cooldown ?? 500;
    this.knockback = data.knockback ?? 0;
    this.projectileSpeed = data.projectileSpeed ?? 0;
    this.bulletSprite = data.bulletSprite ?? null;
    this.muzzleSprite = data.muzzleSprite ?? null;
    this.ammoCapacity = data.ammoCapacity ?? Infinity;
    this.reloadTime = data.reloadTime ?? 0;
    this.mode = data.mode ?? 'default';
  }

  isMelee() {
    return this.type === 'melee';
  }

  isRanged() {
    return this.type === 'ranged';
  }

  needsReload() {
    return Number.isFinite(this.ammoCapacity);
  }

  effectiveDamage(modifier = 1) {
    return this.damage * modifier;
  }
}