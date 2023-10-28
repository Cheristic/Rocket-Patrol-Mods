/*
Ethan Heffan
Raw Patrol
18 hours

Mods:
1-pt | New background DONE
3-pt | Display time DONE
5-pt | New enemy Spaceship DONE
5-pt | New add time per successful hit mechanism
3-pt | Custom God Tier | New player object that shoots rockets and can still move after firing DONE
3-pt | Custom God Tier | Combo multiplier that resets on missed hits DONE


Citations:
-Wario google images
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 0}
        }
    },
    scene: [ Menu, Play ] 
};

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;