var chooseTower = null;

// the "main" code begins here
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/monster1.png");
ASSET_MANAGER.queueDownload("./img/monster2.png");
ASSET_MANAGER.queueDownload("./img/monster3.png");
ASSET_MANAGER.queueDownload("./img/monster4.png");

ASSET_MANAGER.queueDownload("./img/grasstile.jpg");
ASSET_MANAGER.queueDownload("./img/roadtile.jpg");
ASSET_MANAGER.queueDownload("./img/left_gate.png");
ASSET_MANAGER.queueDownload("./img/tree.png");

ASSET_MANAGER.queueDownload("./img/tower1.png");
ASSET_MANAGER.queueDownload("./img/tower2.png");
ASSET_MANAGER.queueDownload("./img/tower3.png");
ASSET_MANAGER.queueDownload("./img/arrow.png");
ASSET_MANAGER.queueDownload("./img/bullet.png");
ASSET_MANAGER.queueDownload("./img/missile1.png");
ASSET_MANAGER.queueDownload("./img/missile2.png");
ASSET_MANAGER.queueDownload("./img/blowup.png");

var spawn = null;

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
   
    gameEngine = new GameEngine();
    //var script = new Script(gameEngine, 1);
    ////to show the tower as begin
    //gameEngine.addEntity(new Tower(gameEngine));
    //gameEngine.addEntity(new Tower2(gameEngine));

    gameEngine.init(ctx);
    gameEngine.start();

});

function display_game() {
    document.getElementById("top_canvas").style.visibility = 'visible';
    document.getElementById("towers_section").style.visibility = 'visible';
}

function level_1() {
    display_game();
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    gameEngine = new GameEngine();
    var script = new Script(gameEngine, 1);
    //to show the tower as begin
    gameEngine.addEntity(new Tower(gameEngine));
    gameEngine.addEntity(new Tower2(gameEngine));
    gameEngine.addEntity(new Tower3(gameEngine));
    gameEngine.gameStart = true;
    gameEngine.level = 1;
    gameEngine.init(ctx);
    gameEngine.start();
    // each object is one wave, id: 1 - monster 1, 2 - monster 2, 3 - monster 3, 0 - no monster, -1 all waves ended
    var script = [
       { id: 0, number: 5 },
        { id: 1, number: 1 },
                       
        { id: -1, number: 0 }        
    ];

    var count = 0;
    var monsterNumber = 0;
    var min = script[count].number;    
    var preMon = count;

    spawn = window.setInterval(function () {
        var curentWave = script[count];

        // display next wave information
        var nextWave = script[count + 1];

        if (nextWave && nextWave.id !== -1) {
            if (nextWave.id === 0) {                
                nextWave = script[count + 2];
            }
            var nextMonster = nextWave.id;
            var nextMonsterCount = nextWave.number;
            if (nextMonster === 1) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Little Dragons";
            } else if (nextMonster === 2) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Pumpkin Zombies";
            } else if (nextMonster === 3) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Warrior Dudes";
            } else if (nextMonster === 4) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Red Wing Dudes";
            }
        } else {
            document.getElementById("wave").innerHTML = "Game Ending";
        }

        // take care of current wave
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
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster1.png"), 70, .25, 3, 1.2, 15, 2, 1, 27, 20));
            monsterNumber++;
        }
        else if (monsterNumber < curentWave.number && curentWave.id === 2) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster2.png"), 70, .25, 8, 1.3, 50, 3, 5, 30, 40));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 3) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster3.png"), 70, .15, 8, 1.6, 125, 5, 7, 32, 40));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 4) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster4.png"), 70, .15, 8, 1.8, 180, 7, 10, 32, 40));
            monsterNumber++;
        } else {
            count++;
            monsterNumber = 0;
            if (script[count].id !== 0 && script[count].id !== -1 && script[count + 1].id !== -1) {
                min = script[count].number + script[count + 1].number;
            } else {
                min = script[count].number;
            }
        }
        document.getElementById("min").innerHTML = min;
        min--;
        
    }, 1000);
}

function level_2() {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    gameEngine = new GameEngine();
    var script = new Script(gameEngine, 2);
    //to show the tower as begin
    gameEngine.addEntity(new Tower(gameEngine));
    gameEngine.addEntity(new Tower2(gameEngine));
    gameEngine.gameStart = true;
    gameEngine.level = 2;
    gameEngine.init(ctx);
    gameEngine.start();
    
    // each object is one wave, id: 1 - monster 1, 2 - monster 2, 3 - monster 3, 0 - no monster, -1 all waves ended
    var script = [
        { id: 0, number: 15 },
        { id: 1, number: 15 },
        { id: 0, number: 15 },
        { id: 1, number: 15 },
        { id: 0, number: 15 },
        { id: 1, number: 10 },
        { id: 2, number: 5 },
        { id: 0, number: 8 },        
        { id: 1, number: 5 },
        { id: 0, number: 7 },
        { id: 2, number: 5 },
        { id: 0, number: 6 },
        { id: 3, number: 5 },
        { id: 0, number: 5 },
        { id: 2, number: 10 },
        { id: 0, number: 4 },
        { id: 3, number: 5 },
        { id: 0, number: 3 },
        { id: 3, number: 5 },
        { id: 0, number: 2 },
        { id: 4, number: 15 },
        { id: 0, number: 3 },
        { id: 2, number: 10 },
        { id: 0, number: 2 },
        { id: 3, number: 15 },
        { id: 0, number: 1 },
        { id: 4, number: 15 },
        { id: -1, number: 0 }
    ];

    var count = 0;
    var monsterNumber = 0;

    spawn = window.setInterval(function () {
        var curentWave = script[count];

        // display next wave information
        var nextWave = script[count + 1];
        if (nextWave && nextWave.id !== -1) {
            if (nextWave.id === 0) {
                nextWave = script[count + 2];
            }
            var nextMonster = nextWave.id;
            var nextMonsterCount = nextWave.number;
            if (nextMonster === 1) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Little Dragons";
            } else if (nextMonster === 2) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Pumpkin Zombies";
            } else if (nextMonster === 3) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Warrior Dudes";
            } else if (nextMonster === 4) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Red Wing Dudes";
            }
        } else {
            document.getElementById("wave").innerHTML = "Game Ending";
        }

        // take care of current wave
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
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster1.png"), 70, .25, 3, 1.2, 10, 2, 2, 27, 20));
            monsterNumber++;
        }
        else if (monsterNumber < curentWave.number && curentWave.id === 2) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster2.png"), 70, .25, 8, 1.3, 50, 3, 5, 30, 40));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 3) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster3.png"), 70, .15, 8, 1.6, 125, 5, 7, 32, 40));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 4) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster4.png"), 70, .15, 8, 1.8, 180, 7, 10, 32, 40));
            monsterNumber++;
        } else {
            count++;
            monsterNumber = 0;
        }

    }, 1000);
}