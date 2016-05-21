var chooseTower = null;

// the "main" code begins here
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/monster1.png");
ASSET_MANAGER.queueDownload("./img/monster2.png");
ASSET_MANAGER.queueDownload("./img/monster3.png");

ASSET_MANAGER.queueDownload("./img/grasstile.jpg");
ASSET_MANAGER.queueDownload("./img/roadtile.jpg");
ASSET_MANAGER.queueDownload("./img/left_gate.png");
ASSET_MANAGER.queueDownload("./img/tree.png");

ASSET_MANAGER.queueDownload("./img/tower1.png");
ASSET_MANAGER.queueDownload("./img/tower2.png");
ASSET_MANAGER.queueDownload("./img/bullet.png");
ASSET_MANAGER.queueDownload("./img/missile1.png");
ASSET_MANAGER.queueDownload("./img/missile2.png");
ASSET_MANAGER.queueDownload("./img/blowup.png");



ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
   
    var gameEngine = new GameEngine();
    //to show the tower as begin
    gameEngine.addEntity(new Tower(gameEngine));
    gameEngine.addEntity(new Tower2(gameEngine));

    var script = new Script(gameEngine); 

    gameEngine.init(ctx);
    gameEngine.start();

    // each object is one wave, id: 1 - monster 1, 2 - monster 2, 3 - monster 3, 0 - no monster, -1 all waves ended
    var script = [
        { id: 1, number: 10 }, 
        { id: 0, number: 10 }, 
        { id: 1, number: 10 }, 
        { id: 2, number: 5 },
        { id: 0, number: 10 },
        { id: 1, number: 5 },
        { id: 2, number: 10 },
        { id: 3, number: 5 },
        { id: 0, number: 10 },
        { id: 2, number: 10 },
        { id: 3, number: 5 },
        { id: 0, number: 10},
        { id: 2, number: 5},
        { id: 3, number: 15},
        { id: 0, number: 10},
        { id: 1, number: 10},
        { id: 2, number: 15},
        { id: 3, number: 15},
        { id: -1, number: 0}
        ];
    
    var count = 0;
    var monsterNumber = 0;

    var spawn = window.setInterval(function () {
        var curentWave = script[count];

        if (curentWave.id === -1) {
            clearInterval(spawn);
            gameEngine.finishedRound = true;
        }
        
        console.log(curentWave.id);
        //count++;
        if (monsterNumber < curentWave.number && curentWave.id === 0) {
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 1) {
            // (parameters in this order) game, image, width, duration, frame, speed, health, damage, worth, radius, health-bar-margin
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster1.png"), 70, .25, 3, 1.2, 15, 2, 2, 27, 20));
            monsterNumber++;
        }
        else if (monsterNumber < curentWave.number && curentWave.id === 2) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster2.png"), 70, .25, 8, 1.3, 50, 3, 5, 30, 40));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 3) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster3.png"), 70, .15, 8, 1.6, 125, 5, 10, 32, 40));
            monsterNumber++;
        } else {
            count++;
            monsterNumber = 0;
        }       

    }, 1000);
        
    //Generate the monster every 500 miliseconds
    //var generate = window.setInterval(spawn, 1000);
    //var monsterNum = 0;
    //function spawn() {
    //    //gameEngine.addEntity(new Monster(gameEngine, monsterDown, monsterLeft, monsterRight, monsterUp));
    //    gameEngine.addEntity(new Monster(gameEngine, monster2, 56, .25, 4));
    //    monsterNum += 1;

    //    //Monster = 10
    //    if (monsterNum === 10) {
    //        window.clearInterval(generate);
    //        lvl++;
    //    }
    //}

    ////Respawn monster
    //var level = window.setInterval(repeatSpawn, 120000);
    //var lvl = 0;

    //function repeatSpawn() {
    //    generate = window.setInterval(spawn, 1000);
    //    monsterNum = 0;

    //    if (lvl === 1) {
    //        window.clearInterval(level);
    //    }
    //}

    //if (lvl === 2) window.clearTimeout(repeat);
});
