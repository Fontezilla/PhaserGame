const playerData = {
  "biker": {
    "name": "Biker",
    "health": 100,
    "speed": 200,
    "defaultMode": "fists",
    "modes": {
      "fists": {
        "mode": "integrated",
        "localization": "spritesheets-full",
        "animations": {
          "attack": {
            "file": "attack",
            "frames": 6,
            "frameRate": 10,
            "repeat": 0
          },
          "death": {
            "file": "death",
            "frames": 6,
            "frameRate": 8,
            "repeat": 0
          },
          "doublejump": {
            "file": "doublejump",
            "frames": 6,
            "frameRate": 12,
            "repeat": 0
          },
          "idle": {
            "file": "idle",
            "frames": 4,
            "frameRate": 4,
            "repeat": -1
          },
          "jump": {
            "file": "jump",
            "frames": 4,
            "frameRate": 10,
            "repeat": 0
          },
          "punch": {
            "file": "punch",
            "frames": 6,
            "frameRate": 14,
            "repeat": 0
          },
          "run": {
            "file": "run",
            "frames": 6,
            "frameRate": 16,
            "repeat": -1
          },
          "run-attack": {
            "file": "run-attack",
            "frames": 6,
            "frameRate": 12,
            "repeat": 0
          },
          "walk": {
            "file": "run",
            "frames": 6,
            "frameRate": 6,
            "repeat": -1
          }
        }
      },
      "light-armed": {
        "mode": "separated",
        "localization": "spritesheets-light",
        "animations": {
          "idle": {
            "file": "idle",
            "frames": 4,
            "frameRate": 4,
            "repeat": -1
          },
          "jump": {
            "file": "jump",
            "frames": 4,
            "frameRate": 10,
            "repeat": 0
          },
          "run": {
            "file": "run",
            "frames": 6,
            "frameRate": 16,
            "repeat": -1
          },
          "walk": {
            "file": "walk",
            "frames": 6,
            "frameRate": 16,
            "repeat": -1
          }
        },
        "armConfig": {
          "defaultSprite": "light-arm",
          "offset": {
            "x": -10,
            "y": 5
          },
          "pivot": {
            "x": -10,
            "y": 2
          }
        },
        "weaponOffset": { x: 0, y: 3 }
      },
      "heavy-armed": {
        "mode": "separated",
        "localization": "spritesheets-heavy",
        "animations": {
          "idle": {
            "file": "idle",
            "frames": 4,
            "frameRate": 4,
            "repeat": -1
          },
          "jump": {
            "file": "jump",
            "frames": 4,
            "frameRate": 10,
            "repeat": 0
          },
          "run": {
            "file": "run",
            "frames": 6,
            "frameRate": 16,
            "repeat": -1
          },
          "walk": {
            "file": "walk",
            "frames": 6,
            "frameRate": 16,
            "repeat": -1
          }
        },
        "armConfig": {
          "defaultSpritePrimary": "heavy-arm",
          "defaultSpriteSecondary": "heavy-arm-2",
          "offset": {
            "x": -10,
            "y": 5
          },
          "pivot": {
            "x": -10,
            "y": 2
          }
        },
        "weaponOffset": { x: 0, y: 3 }
      }
    }
  },
  "cyborg": {
    "name": "Cyborg",
    "health": 100,
    "speed": 250,
    "defaultMode": "fists",
    "modes": {
      "fists": {
        "mode": "integrated",
        "localization": "spritesheets-full",
        "animations": {
          "attack": {
            "file": "attack",
            "frames": 6,
            "frameRate": 10,
            "repeat": 0
          },
          "death": {
            "file": "death",
            "frames": 6,
            "frameRate": 7,
            "repeat": 0
          },
          "doublejump": {
            "file": "doublejump",
            "frames": 6,
            "frameRate": 11,
            "repeat": 0
          },
          "idle": {
            "file": "idle",
            "frames": 4,
            "frameRate": 3,
            "repeat": -1
          },
          "jump": {
            "file": "jump",
            "frames": 4,
            "frameRate": 9,
            "repeat": 0
          },
          "punch": {
            "file": "punch",
            "frames": 6,
            "frameRate": 12,
            "repeat": 0
          },
          "run": {
            "file": "run",
            "frames": 6,
            "frameRate": 13,
            "repeat": -1
          },
          "run-attack": {
            "file": "run-attack",
            "frames": 6,
            "frameRate": 10,
            "repeat": 0
          },
          "walk": {
            "file": "run",
            "frames": 6,
            "frameRate": 6,
            "repeat": -1
          }
        }
      },
      "light-armed": {
        "mode": "separated",
        "localization": "spritesheets-light",
        "animations": {
          "idle": {
            "file": "idle",
            "frames": 4,
            "frameRate": 3,
            "repeat": -1
          },
          "jump": {
            "file": "jump",
            "frames": 4,
            "frameRate": 9,
            "repeat": 0
          },
          "run": {
            "file": "run",
            "frames": 6,
            "frameRate": 13,
            "repeat": -1
          },
          "walk": {
            "file": "walk",
            "frames": 6,
            "frameRate": 11,
            "repeat": -1
          }
        },
        "armConfig": {
          "defaultSprite": "light-arm",
          "offset": {
            "x": -10,
            "y": 5
          },
          "pivot": {
            "x": -10,
            "y": 2
          }
        },
        "weaponOffset": { x: 0, y: 3 }
      },
      "heavy-armed": {
        "mode": "separated",
        "localization": "spritesheets-heavy",
        "animations": {
          "idle": {
            "file": "idle",
            "frames": 4,
            "frameRate": 3,
            "repeat": -1
          },
          "jump": {
            "file": "jump",
            "frames": 4,
            "frameRate": 9,
            "repeat": 0
          },
          "run": {
            "file": "run",
            "frames": 6,
            "frameRate": 13,
            "repeat": -1
          },
          "walk": {
            "file": "walk",
            "frames": 6,
            "frameRate": 11,
            "repeat": -1
          }
        },
        "armConfig": {
          "defaultSpritePrimary": "heavy-arm",
          "defaultSpriteSecondary": "heavy-arm-2",
          "offset": {
            "x": -10,
            "y": 5
          },
          "pivot": {
            "x": -10,
            "y": 2
          }
        },
        "weaponOffset": { x: 0, y: 3 }
      }
    }
  },
  "punk": {
    "name": "Punk",
    "health": 100,
    "speed": 250,
    "defaultMode": "fists",
    "modes": {
      "fists": {
        "mode": "integrated",
        "localization": "spritesheets-full",
        "animations": {
          "attack": {
            "file": "attack",
            "frames": 6,
            "frameRate": 14,
            "repeat": 0
          },
          "death": {
            "file": "death",
            "frames": 6,
            "frameRate": 9,
            "repeat": 0
          },
          "doublejump": {
            "file": "doublejump",
            "frames": 6,
            "frameRate": 14,
            "repeat": 0
          },
          "idle": {
            "file": "idle",
            "frames": 4,
            "frameRate": 6,
            "repeat": -1
          },
          "jump": {
            "file": "jump",
            "frames": 4,
            "frameRate": 11,
            "repeat": 0
          },
          "punch": {
            "file": "punch",
            "frames": 6,
            "frameRate": 16,
            "repeat": 0
          },
          "run": {
            "file": "run",
            "frames": 6,
            "frameRate": 18,
            "repeat": -1
          },
          "run-attack": {
            "file": "run-attack",
            "frames": 6,
            "frameRate": 14,
            "repeat": 0
          },
          "walk": {
            "file": "run",
            "frames": 6,
            "frameRate": 6,
            "repeat": -1
          }
        }
      },
      "light-armed": {
        "mode": "separated",
        "localization": "spritesheets-light",
        "animations": {
          "idle": {
            "file": "idle",
            "frames": 4,
            "frameRate": 6,
            "repeat": -1
          },
          "jump": {
            "file": "jump",
            "frames": 4,
            "frameRate": 11,
            "repeat": 0
          },
          "run": {
            "file": "run",
            "frames": 6,
            "frameRate": 18,
            "repeat": -1
          },
          "walk": {
            "file": "walk",
            "frames": 6,
            "frameRate": 16,
            "repeat": -1
          }
        },
        "armConfig": {
          "defaultSprite": "light-arm",
          "offset": {
            "x": -10,
            "y": 5
          },
          "pivot": {
            "x": -10,
            "y": 2
          }
        },
        "weaponOffset": { x: 0, y: 3 }
      },
      "heavy-armed": {
        "mode": "separated",
        "localization": "spritesheets-heavy",
        "animations": {
          "idle": {
            "file": "idle",
            "frames": 4,
            "frameRate": 6,
            "repeat": -1
          },
          "jump": {
            "file": "jump",
            "frames": 4,
            "frameRate": 11,
            "repeat": 0
          },
          "run": {
            "file": "run",
            "frames": 6,
            "frameRate": 18,
            "repeat": -1
          },
          "walk": {
            "file": "walk",
            "frames": 6,
            "frameRate": 16,
            "repeat": -1
          }
        },
        "armConfig": {
          "defaultSpritePrimary": "heavy-arm",
          "defaultSpriteSecondary": "heavy-arm-2",
          "offset": {
            "x": -10,
            "y": 5
          },
          "pivot": {
            "x": -10,
            "y": 2
          }
        },
        "weaponOffset": { x: 0, y: 3 }
      }
    }
  }
}

export default playerData;