const gameData = {
  playerControls: {
    player1: {
      left: 'A',
      right: 'D',
      up: 'W',
      down: 'S',
      jump: 'SPACE',
      attack: 'F',
      pick: 'Q'
    },
    player2: {
      left: 'LEFT',
      right: 'RIGHT',
      up: 'UP',
      down: 'DOWN',
      jump: 'NUMPAD_EIGHT',
      attack: 'NUMPAD_NINE',
      pick: 'NUMPAD_SEVEN'
    }
  },

  globalConfig: {
    gravityY: 1000,
    jumpForce: 430,
    multiplierDouble: 0.8,
    debugMode: false,
    maxPlayers: 2
  }
};

export default gameData;
