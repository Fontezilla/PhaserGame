import playerData from "../data/playerData.js";

const frameSize = 48;

const PlayerUtils = {
  preloadPlayerAssets(scene) {
    console.log('[DEBUG] Início do preload de assets dos jogadores');

    for (const playerId in playerData) {
      const player = playerData[playerId];

      for (const modeKey in player.modes) {
        const mode = player.modes[modeKey];
        const basePath = `./src/assets/characters/${playerId}/${mode.localization}`;

        for (const animKey in mode.animations) {
          const anim = mode.animations[animKey];

          if (!anim.file) {
            console.warn(`[AVISO] Animação '${animKey}' de '${playerId}-${modeKey}' sem 'file' definido.`);
            continue;
          }

          const spriteKey = `player-${playerId}-${modeKey}-${animKey}`;
          const spritePath = `${basePath}/${anim.file}.png`;

          console.log(`[DEBUG] Pré-carregar: ${spriteKey} → ${spritePath}`);

          scene.load.spritesheet(spriteKey, spritePath, {
            frameWidth: frameSize,
            frameHeight: frameSize
          });
        }

        const armCfg = mode.armConfig;
        if (armCfg) {
          if (armCfg.defaultSprite) {
            const arm1Key = `player-${playerId}-${modeKey}-arm`;
            const arm1Path = `./src/assets/characters/${playerId}/arms/${armCfg.defaultSprite}.png`;
            console.log(`[DEBUG] Carregar braço: ${arm1Key} → ${arm1Path}`);
            scene.load.image(arm1Key, arm1Path);
          }

          if (armCfg.defaultSpritePrimary && armCfg.defaultSpriteSecondary) {
            const arm1Key = `player-${playerId}-${modeKey}-arm`;
            const arm2Key = `player-${playerId}-${modeKey}-arm2`;
            const arm1Path = `./src/assets/characters/${playerId}/arms/${armCfg.defaultSpritePrimary}.png`;
            const arm2Path = `./src/assets/characters/${playerId}/arms/${armCfg.defaultSpriteSecondary}.png`;
            console.log(`[DEBUG] Carregar braços prim/seg: ${arm1Key}, ${arm2Key}`);
            scene.load.image(arm1Key, arm1Path);
            scene.load.image(arm2Key, arm2Path);
          }
        }
      }
    }

    console.log('[DEBUG] Preload concluído');
  },

  registerPlayerAnims(scene) {
    console.log('[DEBUG] Registo de animações iniciado');

    for (const playerId in playerData) {
      const player = playerData[playerId];

      for (const modeKey in player.modes) {
        const mode = player.modes[modeKey];

        for (const animKey in mode.animations) {
          const anim = mode.animations[animKey];
          const spriteKey = `player-${playerId}-${modeKey}-${animKey}`;

          if (!scene.anims.exists(spriteKey)) {
            console.log(`[DEBUG] Criar animação: ${spriteKey} (${anim.frames} frames)`);
            try {
              scene.anims.create({
                key: spriteKey,
                frames: scene.anims.generateFrameNumbers(spriteKey, {
                  start: 0,
                  end: anim.frames - 1,
                }),
                frameRate: anim.frameRate,
                repeat: anim.repeat
              });
            } catch (e) {
              console.error(`[ERRO] Falha ao criar animação '${spriteKey}':`, e);
            }
          } else {
            console.log(`[INFO] Animação já existente: ${spriteKey}`);
          }
        }
      }
    }

    console.log('[DEBUG] Registo de animações concluído');
  }
};

export default PlayerUtils;