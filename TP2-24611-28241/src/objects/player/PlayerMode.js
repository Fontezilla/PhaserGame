export default class PlayerMode {
  constructor(initial = 'fists') {
    this.set(initial);
  }

  set(modeName) {
    switch (modeName) {
      case 'fists':
        this.name = 'fists';
        break;

      case 'light':
      case 'light-armed':
        this.name = 'light-armed';
        break;

      case 'heavy':
      case 'heavy-armed':
        this.name = 'heavy-armed';
        break;

      default:
        console.warn(`[PlayerMode] Modo desconhecido: '${modeName}'. A usar 'fists'.`);
        this.name = 'fists';
        break;
    }
  }

  is(name)            { return this.name === name; }
  isFists()           { return this.is('fists'); }
  isLight()           { return this.is('light-armed'); }
  isHeavy()           { return this.is('heavy-armed'); }
  isArmed()           { return this.isLight() || this.isHeavy(); }
  allowsDoubleJump()  { return this.isFists(); }
  allowsInvulnerability() { return this.isFists(); }

  getMovementSpeed() {
    if (this.isFists()) return 200;
    if (this.isLight()) return 125;
    if (this.isHeavy()) return 90;
    return 120;
  }
}