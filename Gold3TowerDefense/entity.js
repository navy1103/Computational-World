var chooseTower = null;
var GATE = 1;
var ENEMY = 2;
var TOWER = 4;
var BULLET = 8;

var NORTH = 1;
var SOUTH = 2;
var EAST = 3;
var WEST = 4;

var NUM_BLOCK = 8;
var BLOCK_SIZE = 100;


var GRASS = 'G';
var ROAD = 'R';
var TOWER = 'T';
var TREE = 'K';

var ENEMY_MONSTER = 1;

var MONEY = 20; //default money
var TOWER_ONE_COST = 10;
var TOWER_TWO_COST = 12;
var TOWER_THREE_COST = 20;

var destroy = null;
function Entity(game) {
    this.game = game;
    this.x = 0; //default
    this.y = 0; //default
    this.speed = 0; //default
    this.type = 0; //default

    this.direction = SOUTH; //default
    this.whereAmIFrom = NORTH; //default - I'm from NORTH to SOUTH
    this.radius = 10; //default
    this.range = 1; //default for towers

    this.lastBlockX = Math.floor(this.x / BLOCK_SIZE);
    this.lastBlockY = Math.floor(this.y / BLOCK_SIZE);

    this.removeFromWorld = false;
}

//Boolean functions to check what is this
Entity.prototype.isGate = function () {
    return (this.type & GATE) != 0;
};

Entity.prototype.isEnemy = function () {
    return (this.type & ENEMY) != 0;
};

Entity.prototype.isTower = function () {
    return (this.type & TOWER) != 0;
};

Entity.prototype.isBullet = function () {
    return (this.type & BULLET) != 0;
};

//There is a collision between 2 objects, isn't it?
Entity.prototype.collide = function (other) {
    var dx = Math.abs(this.x - other.x);
    var dy = Math.abs(this.y - other.y);
    var d = Math.sqrt(dx * dx + dy * dy);
    return d < (this.radius + other.radius);
}

Entity.prototype.inRange = function (other) { //a tower needs to check that an enemy is in range or not 
    var dx = Math.abs(this.x - other.x);
    var dy = Math.abs(this.y - other.y);
    var d = Math.sqrt(dx * dx + dy * dy);
    return d < this.range;
}

Entity.prototype.update = function () {
    if (this.click) {
        if (this.map.array[this.row][this.col] === GRASS) {
            this.map.array[this.row][this.col] = TOWER;

            if (chooseTower === 1) this.game.addTower(new Tower(this.game, this.row * BLOCK_SIZE, this.col * BLOCK_SIZE));
            if (chooseTower === 2) this.game.addTower(new Tower2(this.game, this.row * BLOCK_SIZE, this.col * BLOCK_SIZE));

        }
        // this.click = null;
        chooseTower = null;
    }
}

Entity.prototype.draw = function (ctx) {    
    if (this.game.showOutlines) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "white";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

//This function is used for monsters only
Entity.prototype.move = function () {
    //current coordination of frame
    var currentBlockX = Math.floor(this.x / BLOCK_SIZE);
    var currentBlockY = Math.floor(this.y / BLOCK_SIZE);

    var dx = 0;
    var dy = 0;  
    var d = this.speed;
    switch (this.direction) {
        case NORTH:
            //console.log("north " + this.whereAmIFrom);
            if (this.y <= currentBlockY * BLOCK_SIZE + BLOCK_SIZE / 2) { //passed the point
                if (this.whereAmIFrom != WEST && currentBlockX > 0 && this.game.map.array[currentBlockY][currentBlockX - 1] === ROAD) { //turn to WEST
                    this.direction = WEST;
                    this.whereAmIFrom = SOUTH;
                    this.y = currentBlockY * BLOCK_SIZE + BLOCK_SIZE / 2; //adjust the y
                    dx = -d;
                } else if (this.whereAmIFrom != EAST && currentBlockX < this.game.map.mapSize - 1 && this.game.map.array[currentBlockY][currentBlockX + 1] === ROAD) { //turn to EAST
                    this.direction = EAST;
                    this.whereAmIFrom = SOUTH;
                    this.y = currentBlockY * BLOCK_SIZE + BLOCK_SIZE / 2; //adjust the y
                    dx = d;
                } else if (this.whereAmIFrom != NORTH && currentBlockY > 0 && this.game.map.array[currentBlockY - 1][currentBlockX] === ROAD) { //still move to NORTH
                    dy = -d;
                }             
            } else {
                dy = -d;
                this.whereAmIFrom = SOUTH;
            }
            break;
        case SOUTH:
            //console.log("south " + this.whereAmIFrom);
            if (this.y >= currentBlockY * BLOCK_SIZE + BLOCK_SIZE / 2) { //passed the point           
                if (this.whereAmIFrom != WEST && currentBlockX > 0 && this.game.map.array[currentBlockY][currentBlockX - 1] === ROAD) { //turn to WEST                
                    this.direction = WEST;
                    this.whereAmIFrom = NORTH;
                    this.y = currentBlockY * BLOCK_SIZE + BLOCK_SIZE / 2; //adjust the y
                    dx = -d;
                } else if (this.whereAmIFrom != EAST && currentBlockX < this.game.map.mapSize - 1 && this.game.map.array[currentBlockY][currentBlockX + 1] === ROAD) { //turn to EAST             
                    this.direction = EAST;
                    this.whereAmIFrom = NORTH;
                    this.y = currentBlockY * BLOCK_SIZE + BLOCK_SIZE / 2; //adjust the y
                    dx = d;
                } else if (this.whereAmIFrom != SOUTH && currentBlockY < this.game.map.mapSize - 1 && this.game.map.array[currentBlockY + 1][currentBlockX] === ROAD) { //still move to SOUTH
                    dy = d;
                }
                
            } else {
                dy = d;
                this.whereAmIFrom = NORTH;
            }
            break;
        case EAST:
            //console.log("east " + this.whereAmIFrom);
            if (this.x >= currentBlockX * BLOCK_SIZE + BLOCK_SIZE / 2) { //passed the point
                if (this.whereAmIFrom != NORTH && currentBlockY > 0 && this.game.map.array[currentBlockY - 1][currentBlockX] === ROAD) { //turn to NORTH
                    this.direction = NORTH;
                    this.whereAmIFrom = WEST;
                    this.x = currentBlockX * BLOCK_SIZE + BLOCK_SIZE / 2; //adjust the x
                    dy = -d;
                } else if (this.whereAmIFrom != SOUTH && currentBlockY < this.game.map.mapSize - 1 && this.game.map.array[currentBlockY + 1][currentBlockX] === ROAD) { //turn to SOUTH
                    this.direction = SOUTH;
                    this.whereAmIFrom = WEST;
                    this.x = currentBlockX * BLOCK_SIZE + BLOCK_SIZE / 2; //adjust the x
                    dy = d;
                } else if (this.whereAmIFrom != EAST && currentBlockX < this.game.map.mapSize - 1 && this.game.map.array[currentBlockY][currentBlockX + 1] === ROAD) { //still move to EAST
                    dx = d;
                }
                
            } else {
                dx = d;
                this.whereAmIFrom = WEST;
            }
            break;
        case WEST:
            //console.log("west " + this.whereAmIFrom);
            if (this.x <= currentBlockX * BLOCK_SIZE + BLOCK_SIZE / 2) { //passed the point
                if (this.whereAmIFrom != NORTH && currentBlockY > 0 && this.game.map.array[currentBlockY - 1][currentBlockX] === ROAD) { //turn to NORTH
                    this.direction = NORTH;
                    this.whereAmIFrom = EAST;
                    this.x = currentBlockX * BLOCK_SIZE + BLOCK_SIZE / 2; //adjust the x
                    dy = -d;
                } else if (this.whereAmIFrom != SOUTH && currentBlockY < this.game.map.mapSize - 1 && this.game.map.array[currentBlockY + 1][currentBlockX] === ROAD) { //turn to SOUTH
                    this.direction = SOUTH;
                    this.whereAmIFrom = EAST;
                    this.x = currentBlockX * BLOCK_SIZE + BLOCK_SIZE / 2; //adjust the x
                    dy = d;
                } else if (this.whereAmIFrom != WEST && currentBlockX > 0 && this.game.map.array[currentBlockY][currentBlockX - 1] === ROAD) { //still move to WEST
                    dx = -d;
                }
                
            } else {
                dx = -d;
                this.whereAmIFrom = EAST;
            }
            break;
              
    }
    this.x += dx;
    this.y += dy;
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}
