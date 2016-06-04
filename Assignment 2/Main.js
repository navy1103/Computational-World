
// Global vars
canvas = null;
ctx = null;

var mainGame = null;
// pause the game
var pause = false;

var save = false;
var load = false;

function startGame() {
    GameLoopManager.stop();
    var test = function () {
        // All done, go!
        InputManager.reset();
        GameLoopManager.run(function (elapsed) { mainGame.Tick(elapsed); });
    }();
}

$(document).ready(function () {
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");

    InputManager.connect(document, canvas);

    mainGame = new Game();	

    startGame();

    var socket = io.connect("http://76.28.150.193:8888");	
    /*
    ID = 0: game score, time, and level
    ID = 1: the explosion - x, y, size, speed
    ID = 2: the enemies color, enemies bullets' color
    ID = 3: enemies' bullets
    ID = 4: the player
    ID = 5: player's bullets
    */

    //save function
    //var saveButton = document.createElement("Button");
    //saveButton.innerHTML = "Save";
    //var body = document.getElementsByTagName("body")[0];
    //body.appendChild(saveButton);

    //saveButton.addEventListener("click", function () {
    document.getElementById("save").onclick = function save() {
        pause = true;
        console.log("save button clicked");
        var saveList = [];

        //store game score, time, and level
        //Id = 1, score, time, level
        saveList.push({ id: 1, score: mainGame.score, time: mainGame.time, level: mainGame.level });

        //store all the explosions on the screen
        //ID = 2, x, y, size, speed
        for (var i = 0; i < mainGame.explosions.explosion.length; i++) {
            var temp = mainGame.explosions.explosion[i];
            saveList.push({ id: 2, x: temp.x, y: temp.y, size: temp.size, speed: temp.speed });
        }

        //store enemies color
        //ID = 2, enemies_color, bullet color
        //saveList.push({ id: 2, enemies_color: mainGame.enemies.color, ebullet_color: mainGame.enemyBullets.color, player_bullet: mainGame.playerBullets.color });

        //store all enemies
        //ID = 3, x, y, size, life, speed, a, b, t, refire
        for (var i = 0; i < mainGame.enemies.enemies.length; i++) {
            var temp = mainGame.enemies.enemies[i];
            saveList.push({ id: 3, x: temp.x, y: temp.y, size: temp.size, speed: temp.speed, life: temp.life, a: temp.a, b: temp.b, t: temp.t });
        }

        //store all enemies' bullets
        //ID = 4, x, y, dx, dy, size, life, speed, angle
        for (var i = 0; i < mainGame.enemyBullets.bullets.length; i++) {
            var temp = mainGame.enemyBullets.bullets[i];
            saveList.push({ id: 4, x: temp.x, y: temp.y, size: temp.size, life: temp.life, speed: temp.speed, angle: temp.angle });
        }

        //store player ID = 5
        saveList.push({ id: 5, x: mainGame.player.x, y: mainGame.player.y, life: mainGame.player.life });

        //store all players' bullets
        //ID = 6, x, y, dx, dy, size, life, speed, angle
        for (var i = 0; i < mainGame.playerBullets.bullets.length; i++) {
            var temp = mainGame.playerBullets.bullets[i];
            saveList.push({ id: 6, x: temp.x, y: temp.y, size: temp.size, life: temp.life, speed: temp.speed, angle: temp.angle });
        }

        console.log(saveList.length);
        //console.log(entitiesList);
        socket.emit("save", { studentname: "Navy Nguyen", statename: "airplane", data: saveList });
        //});
    };

    //load function
	//var loadButton = document.createElement("Button");
	//loadButton.innerHTML = "Load";
	//var body = document.getElementsByTagName("body")[0];
	//body.appendChild(loadButton);
    //loadButton.addEventListener("click", function () {
    document.getElementById("load").onclick = function load() {
        console.log("load button clicked");

        pause = true;
        socket.emit("load", { studentname: "Navy Nguyen", statename: "airplane" });

        mainGame.explosions = new Explosions();
        mainGame.enemies.enemies = [];
        mainGame.enemyBullets.bullets = [];
        mainGame.playerBullets.bullets = [];;

        socket.on("load", function (data) {
            var obj = data.data;
            console.log("load object length: " + obj.length);

            for (var i = 0; i < obj.length; i++) {
                var temp = obj[i];
                switch (temp.id) {
                    case 1:
                        mainGame.score = temp.score;
                        mainGame.time = temp.time;
                        mainGame.level = temp.level;
                        break;
                    case 2:
                        mainGame.explosions.Add(temp.x, temp.y, temp.size, temp.speed);
                        break;
                        //case 2:
                        //    mainGame.enemies = new Enemies(temp.enemies_color);
                        //    mainGame.enemyBullets = new Bullets(temp.ebullet_color);
                        //    mainGame.playerBullets = new Bullets(temp.player_bullet);
                        //    break;
                    case 3:
                        mainGame.enemies.Add(temp.x, temp.y, temp.size, temp.speed, temp.life, temp.a, temp.b, temp.t);
                        break;
                    case 4:
                        mainGame.enemyBullets.Add(temp.x, temp.y, temp.size, temp.speed, temp.life, temp.angle);
                        break;
                    case 5:
                        mainGame.player = new Player(temp.x, temp.y, temp.life);
                        break;
                    case 6:
                        mainGame.playerBullets.Add(temp.x, temp.y, temp.size, temp.speed, temp.life, temp.angle);
                        break;
                }
            }

        });

    };
});