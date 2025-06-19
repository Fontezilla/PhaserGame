import Phaser from 'phaser';
import StartScene from './scenes/StartScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';
import MapVoteScene from './scenes/MapVoteScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import gameData from './data/gameData.js';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: gameData.globalConfig.gravityY },
      debug: false
    }
  },
  scene: [StartScene, PreloadScene, MapVoteScene, GameScene, GameOverScene]
};

new Phaser.Game(config);