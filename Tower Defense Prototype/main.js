var chooseTower = null;

// the "main" code begins here
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/monster.png");
ASSET_MANAGER.queueDownload("./img/grass.jpg");
ASSET_MANAGER.queueDownload("./img/left_gate.png");
ASSET_MANAGER.queueDownload("./img/tower1.png");
ASSET_MANAGER.queueDownload("./img/tower2.png");
ASSET_MANAGER.queueDownload("./img/bullet.png");
ASSET_MANAGER.queueDownload("./img/missile1.png");
ASSET_MANAGER.queueDownload("./img/missile2.png");
ASSET_MANAGER.queueDownload("./img/blowup.png");
ASSET_MANAGER.queueDownload("./img/monster2.png");
ASSET_MANAGER.queueDownload("./img/monster3.png");



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

    var script = [{ id: 1, number: 5 }, { id: 0, number: 10 }, { id: 2, number: 5 }, { id: 3, number: 10 }, { id: -1, number: 0 }];
    
    var count = 0;
    var monsterNumber = 0;

    var spawn = window.setInterval(function () {
        var curentWave = script[count];

        if (curentWave.id === -1) {
            clearInterval(spawn);
        }
        
        console.log(curentWave.id);
        //count++;
        if (monsterNumber < curentWave.number && curentWave.id === 0) {
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 1) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster.png"), 51, .1, 3, 1, 10));
            monsterNumber++;
        }
        else if (monsterNumber < curentWave.number && curentWave.id === 2) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster2.png"), 56, .25, 4, 1, 15));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 3) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster3.png"), 70, .05, 8, 2, 30));
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
