import mapData from '../data/mapData.js';

const MapUtils = {
  preloadMapAssets(scene) {
    console.log('[MapUtils] Iniciando preload de todos os mapas...');

    const pendingMapLoads = [];

    for (const mapKey in mapData) {
      const config = mapData[mapKey];
      if (!config) continue;

      const basePath = `./src/assets/maps/${config.path}/`;
      const tilemapKey = config.key;

      scene.load.tilemapTiledJSON(tilemapKey, `${basePath}${tilemapKey}.tmj`);

      const tilesets = config.tilesets || [
        { key: config.tilesetKey, name: config.tilesetName }
      ];

      for (const { key, name } of tilesets) {
        scene.load.image(key, `${basePath}${key}.png`);
        console.log(`[MapUtils] Tileset carregado: ${key} (${name})`);
      }

      pendingMapLoads.push(
        fetch(`${basePath}${tilemapKey}.tmj`)
          .then(res => res.json())
          .then(json => {
            const imagelayers = json.layers?.filter(l => l.type === 'imagelayer' && l.image);
            for (const layer of imagelayers) {
              const imgName = layer.image.replace(/^.*[\\/]/, ''); // ← AQUI
              const nameWithoutExt = imgName.replace(/\.(png|jpg|jpeg)$/i, '');
              const key = `${tilemapKey}_${nameWithoutExt}`;
              const imgPath = `${basePath}${imgName}`; // ← E AQUI

              console.log(`  → Background layer: ${layer.name} (key: "${key}", path: ${imgPath})`);
              scene.load.image(key, imgPath);
            }
          })
          .catch(err =>
            console.warn(`[MapUtils] Erro ao carregar ${tilemapKey}.tmj para extrair imagelayers`, err)
          )
      );
    }

    Promise.all(pendingMapLoads).then(() => {
      scene.load.once('complete', () => {
        console.log('[MapUtils] Preload completo.');
      });
      scene.load.start();
    });
  }
};

export default MapUtils;