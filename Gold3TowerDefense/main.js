var chooseTower = null;
var spawn = null;
var soundOn = true;
// the "main" code begins here
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/monster1.png");
ASSET_MANAGER.queueDownload("./img/monster2.png");
ASSET_MANAGER.queueDownload("./img/monster3.png");
ASSET_MANAGER.queueDownload("./img/monster4.png");
ASSET_MANAGER.queueDownload("./img/behemot.png");
ASSET_MANAGER.queueDownload("./img/dragon.png");
ASSET_MANAGER.queueDownload("./img/flydragon.png");

ASSET_MANAGER.queueDownload("./img/grasstile.jpg");
ASSET_MANAGER.queueDownload("./img/roadtile.jpg");
ASSET_MANAGER.queueDownload("./img/castle.png");
ASSET_MANAGER.queueDownload("./img/tree.png");

ASSET_MANAGER.queueDownload("./img/castle_7.png");
ASSET_MANAGER.queueDownload("./img/title.png");

ASSET_MANAGER.queueDownload("./img/tower1.png");
ASSET_MANAGER.queueDownload("./img/tower2.png");
ASSET_MANAGER.queueDownload("./img/tower3.png");
ASSET_MANAGER.queueDownload("./img/arrow.png");
ASSET_MANAGER.queueDownload("./img/bullet.png");
ASSET_MANAGER.queueDownload("./img/missile1.png");
ASSET_MANAGER.queueDownload("./img/missile2.png");
ASSET_MANAGER.queueDownload("./img/blowup.png");

ASSET_MANAGER.queueDownload("./img/axe.png");
ASSET_MANAGER.queueDownload("./img/coins.png");
ASSET_MANAGER.queueDownload("./img/sound_image.png");
ASSET_MANAGER.queueDownload("./img/mute_sound_image.png");

var gameEngine = null;

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

function mute() {
    if (soundOn) {
        document.getElementById("mp5_smg_sound").volume = 0.0;
        document.getElementById("grenade_explosion_sound").volume = 0.0;
        document.getElementById("missile_sound").volume = 0.0;
        document.getElementById("gameover").volume = 0.0;
        document.getElementById("bow").volume = 0.0;
        document.getElementById("win").volume = 0.0;
        soundOn = false;
        document.getElementById("sound_setting").src = "img/sound_image.png";
    } else {
        document.getElementById("mp5_smg_sound").volume = 0.5;
        document.getElementById("grenade_explosion_sound").volume = .5;
        document.getElementById("missile_sound").volume = .7;
        document.getElementById("gameover").volume = 1.0;
        document.getElementById("bow").volume = .7;
        document.getElementById("win").volume = 1.0;
        soundOn = true;
        document.getElementById("sound_setting").src = "img/mute_sound_image.png";
    }
}

// function unmute() {

// }

function nextlevel(num) {
    display_game();    

    console.log("current level " + num);

    chooseTower = null;
    destroy = null;
    window.clearInterval(spawn);

    
    var map = new Script(gameEngine, num);

    console.log("entity: " + gameEngine.entities.length);
    
    gameEngine.gameStart = true;    
   
    gameEngine.entities = [];
    gameEngine.enemyList = [];
    gameEngine.towers = [];
    gameEngine.gameWon = null;
    gameEngine.gameover = null;
    gameEngine.level = num;
    gameEngine.finishedRound = null;

    //to show the tower as begin
    gameEngine.addEntity(new Tower(gameEngine));
    gameEngine.addEntity(new Tower2(gameEngine));
    gameEngine.addEntity(new Tower3(gameEngine));
    gameEngine.addEntity(new Tools(gameEngine, ASSET_MANAGER.getAsset("./img/axe.png")));
    gameEngine.addEntity(new SellTower(gameEngine, ASSET_MANAGER.getAsset("./img/coins.png")));
    
    

    // each object is one wave, id: 1 - monster 1, 2 - monster 2, 3 - monster 3, 0 - no monster, -1 all waves ended
    var script = [];

    if (num === 1){
        script = level_1;
    } else if (num === 2) {
        script = level_2;
    } else if (num === 3) {
        script = level_3;
    } else if (num === 4) {
        script = level_4;
    }
        

    var count = 0;
    var monsterNumber = 0;
    var min = script[count].number; 

    spawn = window.setInterval(function () {
        var curentWave = script[count];

        // take care of current wave
        if (curentWave.id === -1) {
            window.clearInterval(spawn);
            gameEngine.finishedRound = true;
        }
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
            } else if (nextMonster === 5) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Fly Dragon";
            } else if (nextMonster === 6) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Behemot";
            } else if (nextMonster === 7) {
                document.getElementById("wave").innerHTML = nextMonsterCount + " - Black Dragon";
            }
        } else {
            document.getElementById("wave").innerHTML = "Game Ending";
        }
  
        console.log(curentWave.id);
        //count++;
        if (monsterNumber < curentWave.number && curentWave.id === 0) {
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 1) {
            // (parameters in this order) game, image, width, duration, frame, speed, health, damage, worth, radius, health-bar-margin, x-y offset
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster1.png"), 70, 70, .25, 3, 1.2, 15, 2, 2, 27, 20, 35));
            monsterNumber++;
        }
        else if (monsterNumber < curentWave.number && curentWave.id === 2) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster2.png"), 70, 70, .25, 8, 1.3, 50, 3, 4, 30, 40, 35));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 3) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster3.png"), 70, 70, .15, 8, 1.6, 125, 4, 6, 32, 40, 35));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 4) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/monster4.png"), 70, 70, .15, 8, 1.8, 180, 5, 8, 32, 40, 35));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 5) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/flydragon.png"), 117.5, 117.5, .15, 4, 2, 210, 6, 10, 32, 40, 60));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 6) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/behemot.png"), 96, 96, .15, 3, 2, 230, 7, 12, 32, 40, 47));
            monsterNumber++;
        } else if (monsterNumber < curentWave.number && curentWave.id === 7) {
            gameEngine.addEntity(new Monster(gameEngine, ASSET_MANAGER.getAsset("./img/dragon.png"), 96, 96, .15, 4, 2, 250, 8, 14, 32, 40, 48));
            monsterNumber++;
        } else {
            count++;
            monsterNumber = 0;
            if (script[count].id !== -1) {
                if(script[count].id !== 0)
                    min = script[count].number + script[count + 1].number;
                else 
                    min = script[count].number;
            }            
        }
        document.getElementById("min").innerHTML = min;       
        min--;
    }, 1000);
}

var level_1 = [
       { id: 0, number: 5 },
       { id: 1, number: 10 },
       { id: 0, number: 10 },
       { id: 1, number: 15 },
       { id: 0, number: 10 },
       { id: 1, number: 10 },
       { id: 2, number: 5 },
       { id: 0, number: 10 },
       { id: 2, number: 15 },
       { id: 0, number: 10 },
       { id: 2, number: 10 },
       { id: 2, number: 10 },
       { id: 3, number: 5 },
       { id: 4, number: 2 },
       { id: -1, number: 0 }
];

var level_2 = [
        { id: 0, number: 5 },
        { id: 1, number: 10 },
        { id: 0, number: 10 },
        { id: 1, number: 15 },        
        { id: 0, number: 10 },
        { id: 2, number: 5 },
        { id: 0, number: 10 },
        { id: 1, number: 10 },
        { id: 0, number: 10 },
        { id: 2, number: 5 },
        { id: 0, number: 10 },
        { id: 2, number: 10 },
        { id: 0, number: 10 },
        { id: 3, number: 5 },
        { id: 0, number: 10 },
        { id: 4, number: 10 },
        { id: 0, number: 10 },
        { id: 1, number: 5 },
        { id: 2, number: 5 },
        { id: 0, number: 5 },
        { id: 3, number: 5 },
        { id: 0, number: 5 },
        { id: 4, number: 5 },
        { id: 0, number: 5 },
        { id: 5, number: 5 },
        { id: -1, number: 0 }
];

var level_3 = [
        { id: 0, number: 5 },
        { id: 1, number: 10 },
        { id: 0, number: 10 },
        { id: 1, number: 5 },
        { id: 0, number: 5 },
        { id: 2, number: 5 },
        { id: 0, number: 10 },
        { id: 2, number: 5 },
        { id: 0, number: 10 },
        { id: 2, number: 7 },
        { id: 0, number: 3 },
        { id: 1, number: 5 },
        { id: 0, number: 10 },
        { id: 2, number: 10 },
        { id: 0, number: 10 },
        { id: 3, number: 5 },
        { id: 0, number: 5 },
        { id: 2, number: 5 },
        { id: 0, number: 10 },
        { id: 3, number: 7 },
        { id: 0, number: 10 },
        { id: 4, number: 5 },
        { id: 0, number: 10 },
        { id: 5, number: 5 },
        { id: 0, number: 10 },
        { id: 5, number: 5 },
        { id: 0, number: 5 },
        { id: 6, number: 5 },
        { id: 0, number: 5 },
        { id: 7, number: 3 },
        { id: -1, number: 0 }
];

var level_4 = [
        { id: 0, number: 5 },
        { id: 1, number: 10 },
        { id: 0, number: 10 },
        { id: 1, number: 5 },
        { id: 0, number: 10 },
        { id: 2, number: 5 },
        { id: 0, number: 10 },
        { id: 2, number: 5 },
        { id: 0, number: 10 }, // 
        { id: 3, number: 3 },
        { id: 0, number: 10 },
        { id: 3, number: 5 },
        { id: 0, number: 10 }, //
        { id: 2, number: 10 },
        { id: 0, number: 10 },
        { id: 3, number: 5 },
        { id: 0, number: 10 },
        { id: 4, number: 3 },
        { id: 0, number: 10 },
        { id: 5, number: 3 },
        { id: 0, number: 7 },
        { id: 4, number: 5 },
        { id: 0, number: 10 },
        { id: 5, number: 10 },
        { id: 0, number: 10 },
        { id: 5, number: 5 },
        { id: 6, number: 5 },
        { id: 0, number: 10 },
        { id: 5, number: 5 },
        { id: 6, number: 5 },
        { id: 7, number: 5 },
        { id: 0, number: 10 },
        { id: 5, number: 5 },
        { id: 4, number: 5 },
        { id: 5, number: 20 },
        { id: 6, number: 10 },
        { id: 7, number: 30 },
        { id: -1, number: 0 }
];