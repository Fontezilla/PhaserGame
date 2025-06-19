const mapData = {
  IndustrialMap: {
    key: 'IndustrialMap',
    path: 'IndustrialMap',

    tilesets: [
      { key: 'IndustrialTiles', name: 'IndustrialTile' },
      { key: 'ObjectTiles', name: 'ObjectTile' }
    ],

    layers: {
      ground: "ground",
      wall: "wall",
      objects: "objects",
      background: {
        background_layer1: "1",
        background_layer2: "2.1",
        background_layer3: "3.1",
        background_layer4: "4.1",
        background_layer5: "5.1"
      }
    },

    collisionLayers: ['ground'],
    tileSize: 32,
    mapSize: { width: 40, height: 40 },
    backgroundScale: 1,
    spawnOffset: {
      spawn_1:{ x: 80, y: 440 },
      spawn_2:{ x: 1200, y: 440 }
    },
    parallaxFactors: {
      background_layer3: 0.3,
      background_layer4: 0.2,
      background_layer5: 0.1
    }
  }
};

export default mapData;
