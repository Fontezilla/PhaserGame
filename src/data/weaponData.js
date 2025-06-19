export default {
  fists: {
    name: "Fists",
    type: "melee",
    damage: 10,
    range: 20,
    cooldown: 400,
    knockback: 100,
    mode: "fists"
  },

  pistol: {
    name: "Pistol",
    type: "ranged",
    damage: 20,
    range: 600,
    cooldown: 500,
    projectileSpeed: 800,
    knockback: 0,
    bulletSprite: "pistol_bullet",
    muzzleSprite: "muzzle_1",
    ammoCapacity: 6,
    reloadTime: 1200,
    file:"pistol",
    mode: "light"
  },
};
