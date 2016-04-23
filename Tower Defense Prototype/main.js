var chooseTower = null;
var NUM_BLOCK = 8;
var BLOCK_W = 100;
var BLOCK_H = 100;


//Set up for animations object with / without frame that are reversed
function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    //Check is to continue draw image or not
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;     //'return' is the interrupting function
                    //A function immediately stops at the point where return is called
    }

    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

//Define Background Object
function Background(game, tile, gate) {    
    this.tile = tile;
    this.gate = gate;        
};

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.drawGrid = function (ctx) {
    for (var i = 1; i < NUM_BLOCK; i++) {        
        for (var j = 1; j < NUM_BLOCK; j++) {
            ctx.beginPath();
            ctx.moveTo(i * BLOCK_W, 0);
            ctx.lineTo(i * BLOCK_W, NUM_BLOCK * BLOCK_H);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, j * BLOCK_H);
            ctx.lineTo(NUM_BLOCK * BLOCK_W, j * BLOCK_H);
            ctx.stroke();
        }
    }

}

Background.prototype.update = function () {}

//The fixed 2d array map
var map = [ [0, 1, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 0, 1, 0],
            [0, 0, 0, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 1, 1, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0]];

Background.prototype.draw = function (ctx) {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (map[i][j] === 1) {
                ctx.fillStyle = "SaddleBrown";
                ctx.fillRect(i * 100, j * 100, 100, 100);                
            }

            //2 is a tower
            if (map[i][j] === 0 || map[i][j] === 2) {
                ctx.drawImage(this.tile, i * 100, j * 100);
            }

            if (i === 0 && j === 6) ctx.drawImage(this.gate, i * 100, j * 100);
        }
    }

    if (chooseTower) {
        //console.log("Tower is chosen!");
        this.drawGrid(ctx);
    }
}


//Set up for tower
function Tower(game) {
    this.tower = new Animation(ASSET_MANAGER.getAsset("./img/tower.png"), 0, 0, 100, 100, 1, 1, true, false); 

    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
}

Tower.prototype = new Entity();
Tower.prototype.constructor = Tower;
Tower.prototype.update = function () { };

Tower.prototype.draw = function (ctx) {
    //draw the tower from the map
    for (var i = 0; i < NUM_BLOCK; i++) {
        for (var j = 0; j < NUM_BLOCK; j++) {
            if (map[i][j] === 2) {
                this.tower.drawFrame(this.game.clockTick, ctx, i * BLOCK_W, j * BLOCK_H);                
            }
        }
    }    

    //draw the shadow of the towel
    if (chooseTower) {
        ctx.save();
        ctx.globalAlpha = 0.5;

        var x = this.game.row;
        var y = this.game.col;

        //check mouse out of bound
        //if((x < 0) || (y < 0) || (x > 7) || (y > 7)) return;

        if (((x || y) < 0) || ((x || y) > 7)) return;
        //console.log(this.game.mouse);        

        if (map[x][y] === 0) {
            ctx.drawImage(ASSET_MANAGER.getAsset("./img/tower.png"), x * BLOCK_W, y * BLOCK_H, BLOCK_W, BLOCK_H);
        } else {
            this.ctx.fillStyle = '#F44336';
            this.ctx.fillRect(x * BLOCK_W, y * BLOCK_H, BLOCK_W, BLOCK_H);
        }
    }

    Entity.prototype.draw.call(this);
};

//Set up for monster
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
function Monster(game, image) {
    this.monsterDown = new Animation(image, 0, 0, 51, 51, 0.1, 3, true, false);
    this.monsterLeft = new Animation(image, 0, 51, 51, 51, 0.1, 3, true, false);
    this.monsterRight = new Animation(image, 0, 102, 51, 51, 0.1, 3, true, false);
    this.monsterUp = new Animation(image, 0, 153, 51, 51, 0.1, 3, true, false);
    
    //with different speed we have different finish line
    this.speed = 100;

    //four ways
    this.left = false;
    this.right = true;
    this.up = false;
    this.down = false;

    //The coordination of the monster when they turn
    this.preY = 0;
    this.preX = 0;    
    
    Entity.call(this, game, 0, 100);
}

//Monter object is inherited from Entity Object
Monster.prototype = new Entity();
Monster.prototype.constructor = Monster;

Monster.prototype.update = function () {
    //current coordination of frame
    var currentX = Math.floor(this.x / BLOCK_W);
    var currentY = Math.floor(this.y / BLOCK_H);

    //console.log("Current X = " + this.x + " Current Y = " + this.y);
    //console.log("map[" + currentX + "][" + currentY +"]");

    /*At the time monster wants to change its direction, we store the current position in variable preX or preY
    We use preX and preY variable to compare with the position after monster changed its direction to help 
    monster move on the new direction*/
    if (this.right) {
        if (this.preX !== currentX) {
            if (map[currentX][currentY - 1] === 1) { //ready to change direction from right to up
                this.right = false;
                this.up = true;
                this.preY = currentY;
            } else if (map[currentX][currentY + 1] === 1) {   //ready to change direction from right to down
                this.right = false;
                this.down = true;
                this.preY = currentY;
            } else {
                this.x += this.game.clockTick * this.speed;
            }
        } else {
            this.x += this.game.clockTick * this.speed;
        }
    }

    
   else if (this.left) {
        if (currentX < 0) {     //Monsters are gone into dungeon on the left of canvas
            if (this.monsterLeft.isDone()) {
                this.monsterLeft.elapsedTime = 0;
                this.monsterRight.elapsedTime = 0;
                this.monsterUp.elapsedTime = 0;
                this.monsterRight.elapsedTime = 0;                
            }
            this.left = false;
        } else 
        if (currentX === 0 && currentY === 7) { //the finish line at map[0][7]
            this.x -= this.game.clockTick * this.speed;            
        } else if (this.preX != currentX) {
            if (map[currentX][currentY - 1] === 1) { //ready to change direction from left to up
                this.left = false;
                this.up = true;
                this.preY = currentY;
            } else if (map[currentX][currentY + 1] === 1) {   //ready to change direction from left to down
                this.left = false;
                this.down = true;
                this.preY = currentY;
            } else {
                this.x -= this.game.clockTick * this.speed;
            }
        } else {
            this.x -= this.game.clockTick * this.speed;
        }

        if(currentX <= 0) {
            if (this.monsterLeft.isDone()) this.monsterLeft.elapsedTime = 0;
        }
    }

   else if (this.up) {
        if (this.preY !== currentY) {
                if (map[currentX - 1][currentY] === 1) { //ready to change direction from up to left
                    if (this.y - (currentY * 100) < 1) {
                        this.up = false;
                        this.left = true;
                        this.preX = currentX;
                    } else {
                        this.y -= this.game.clockTick * this.speed;
                    }
                } else if (map[currentX + 1][currentY] === 1) {   //ready to change direction from up to right
                    if (this.y - (currentY * 100) < 4) {
                        this.up = false;
                        this.right = true;
                        this.preX = currentX;
                    } else {
                        this.y -= this.game.clockTick * this.speed;
                    }
                } else {
                    this.y -= this.game.clockTick * this.speed;
                }
        } else {
            this.y -= this.game.clockTick * this.speed;
        }
     } 
    
  else  if (this.down) {
        if(this.preY !== currentY) {
            if (map[currentX - 1][currentY] === 1) { //ready to change direction from down to left
                this.down = false;
                this.left = true;                
                this.preX = currentX;
            } else if (currentX !== 7 && map[currentX + 1][currentY] === 1) {   //ready to change direction down up to right
                this.down = false;
                this.right = true;                
                this.preX = currentX;
            } else {
                this.y += this.game.clockTick * this.speed;
            }
        } else {
            this.y += this.game.clockTick * this.speed;
        }
  }
    
    Entity.prototype.update.call(this);
}

Monster.prototype.draw = function (ctx) {
    if (this.right) {
        this.monsterRight.drawFrame(this.game.clockTick, ctx, this.x +25 , this.y + 25);
    }

    if (this.left) {
        this.monsterLeft.drawFrame(this.game.clockTick, ctx, this.x + 25, this.y + 25);
    }

    if (this.up) {
        this.monsterUp.drawFrame(this.game.clockTick, ctx, this.x + 25, this.y + 25);
    }

    if (this.down) {
        this.monsterDown.drawFrame(this.game.clockTick, ctx, this.x + 25, this.y + 25);
    } 

    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/monster.png");
ASSET_MANAGER.queueDownload("./img/grass.jpg");
ASSET_MANAGER.queueDownload("./img/left_gate.png");
ASSET_MANAGER.queueDownload("./img/tower.png");



ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/grass.jpg"), ASSET_MANAGER.getAsset("./img/left_gate.png"));
    var monster = new Monster(gameEngine); 

    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(bg);
    //gameEngine.addEntity(monster);

    var image = ASSET_MANAGER.getAsset("./img/monster.png");

    //Adding fix tower    
    gameEngine.addEntity(new Tower(gameEngine));

    
    //Generate the monster every 500 miliseconds
    var generate = window.setInterval(spawn, 500);    

    var monsterNum = 0;
    function spawn() {
        gameEngine.addEntity(new Monster(gameEngine, image));
        monsterNum += 1;

        //Monster = 10
        if (monsterNum === 10) {
            window.clearInterval(generate);
            lvl++;
        }
    }

    //Respawn monster
    var level = window.setInterval(repeatSpawn, 8000);
    var lvl = 0;

    function repeatSpawn() {
        generate = window.setInterval(spawn, 500);
        monsterNum = 0;       

        if (lvl === 1) {
            window.clearInterval(level);
        }
    }

    

    if (lvl === 2) window.clearTimeout(repeat);
});
