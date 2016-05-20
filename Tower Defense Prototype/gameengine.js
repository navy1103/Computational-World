// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

//Define Timer object
function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

//Date.now() method returns the milliseconds elapsed since 1 January 1970 00:00:00 UTC up until now as a Number
Timer.prototype.tick = function () {
    var wallCurrent = Date.now();   
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

//The enemy will come in time
function IncomingEnemy(time, type) {
    this.appearAt = time; // in millisecond
    this.enemyType = type;
}

//---------------------------------------------------------------------------------------------------------------------------
//Define GameEngine Object
function GameEngine() {
    this.entities = []; //for emenies only
    this.enemyList = []; //the list of enemies will come (when does this enemy comes and who is it?)
    this.towers = []; //for towers, our bullets
    this.map = new Map(this); //default map
	this.gate = new Gate(this);    

	this.test = [new Tower(this, 0, 0), new Tower2(this, 100, 100)];

	this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.stageStartTime = 0;

    this.row = 0; //for putting a tower onto the map
    this.col = 0; //for putting a tower onto the map

    this.gameWon = false;
    this.gameover = false;
    this.gamePause = false;
}

//Game initialized
GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
}

//Game started
GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

//Game's starting input
GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    //Get (x, y) at the current mouse position
    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        x = Math.floor(x / BLOCK_SIZE);
        y = Math.floor(y / BLOCK_SIZE);

        return { x: x, y: y };
    }

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(getXandY(e));
        that.mouse = getXandY(e);

        that.row = getXandY(e).x;
        that.col = getXandY(e).y;
        
    }, false);

    this.ctx.canvas.addEventListener("click", function (e) {        
        that.click = getXandY(e);

        //that.row = getXandY(e).x;
        //that.col = getXandY(e).y;
        that.row = getXandY(e).y;
        that.col = getXandY(e).x;
    }, false);

    //Cancel click
    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        chooseTower = null;
        e.preventDefault();
    }, false);

    //Showing the range of the towers
    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (e.keyCode === 17) that.showOutlines = true;        
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (e.keyCode === 17) that.showOutlines = false;
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    //console.log('added entity');
    this.entities.push(entity);
}

//Add new towel into the towers array which holds all of towels
GameEngine.prototype.addTower = function (tower) {
    //console.log('added tower');
    this.towers.push(tower);
}

//Draw the whole game with all components
GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
	
    this.map.draw(this.ctx);    //map
    this.gate.draw(this.ctx);   //gate

    if (this.towers.length !== 0) {
        for (var i = 0; i < this.towers.length; i++) {  //towers
            this.towers[i].draw(this.ctx);
        }
    }
    
    for (var i = 0; i < this.entities.length; i++) {    //monsters
        this.entities[i].draw(this.ctx);
    }

    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    //count enemies
    if (this.enemyList.length === 0 && this.entities.length === 2) {
        this.gameWon = true;
        console.log("Contratulation! You won this stage!");
    }

    //add a new enemy from the script based on time
    if (this.enemyList.length > 0 && this.timer.gameTime > this.enemyList[0].appearAt) {
        var enemy = null;
        switch (this.enemyList[0].enemyType) {
            case ENEMY_MONSTER:
                //enemy = new Monster(this, this);
                enemy = new Monster(this);
                break;
        }
        this.entities.push(enemy);  //add monster into the game
        this.enemyList.splice(0, 1); //remove the first entity from the enemyList array
    }
    
    //update every entity - enemies
    var entitiesCount = this.entities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];   
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    //update every tower or bullet
    for (var i = 0; i < this.towers.length; i++) {
        if (!this.towers[i].removeFromWorld) {
            this.towers[i].update();
        }
    }

    //update the gate
    this.gate.update();

    //remove dead entity ?????
    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
    
    //remove dead towers and/or bullets
    for (var i = this.towers.length - 1; i >= 0; --i) {
        if (this.towers[i].removeFromWorld) {
            this.towers.splice(i, 1);
        }
    }

    //Erase the grid from background
    if (this.click) {
        if (this.map.array[this.col][this.row] === GRASS) {
            //this.map.array[this.row][this.col] = TOWER;

            if (chooseTower === 1) {
                if (MONEY >= 10) {
                    this.map.array[this.col][this.row] = TOWER;
                    this.towers.push(new Tower(this, this.row * 100, this.col * 100));
                    MONEY -= 10;
                    document.getElementById("money").innerHTML = MONEY;
                }
                //this.map.array[this.col][this.row] = TOWER;
                //this.towers.push(new Tower(this, this.row * 100, this.col * 100));                
                //console.log("x = " + this.row + "y = " + this.col + " " + this.map.array[this.col][this.row]);
            }

            if (chooseTower === 2) {
                if (MONEY >= 20) {
                    this.map.array[this.col][this.row] = TOWER;
                    this.towers.push(new Tower2(this, this.row * 100, this.col * 100));
                    MONEY -= 20;
                    document.getElementById("money").innerHTML = MONEY;
                }

                //this.map.array[this.col][this.row] = TOWER;
                //this.towers.push(new Tower2(this, this.row * 100, this.col * 100));
                //console.log("x = " + this.row + "y = " + this.col + " " + this.map.array[this.col][this.row]);
            }
        }
        chooseTower = null;
    }

}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.click = null;
}

