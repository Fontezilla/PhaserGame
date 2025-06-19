export default class PlayerAnimations {
  constructor (player) {
    this.player  = player;
    this.sprite  = player.sprite;
    this.current = null;
  }

  update () {
    const body   = this.sprite.body;
    if (!body || !this.sprite.active) return;

    let animKey;
    if (this.player.isAttacking) {
      animKey = 'attack';
    } else if (!body.onFloor()) {
      animKey = this.player.hasDoubleJumped ? 'doublejump' : 'jump';
    } else if (Math.abs(body.velocity.x) > 20) {
      animKey = 'run';
    } else {
      animKey = 'idle';
    }

    const fullKey =
      `player-${this.player.characterKey}-${this.player.PlayerMode.name}-${animKey}`;

    this.playIfChanged(fullKey);
  }

  playIfChanged (key) {
    if (this.current === key) return;

    this.sprite.anims.play(key, true);
    this.current = key;
  }

  reset () {
    this.current = null;
  }

  forcePlay (animKey) {
    const key =
      `player-${this.player.characterKey}-${this.player.PlayerMode.name}-${animKey}`;
    this.sprite.anims.play(key, true);
    this.current = key;
  }
}
