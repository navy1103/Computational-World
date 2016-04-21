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
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
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

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 100;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,400,800,400);
    Entity.prototype.draw.call(this);
}

//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
function Unicorn(game) {    
    //attact animation with flame
    this.attact = new Animation(ASSET_MANAGER.getAsset("./img/zero.png"), 0, 80, 88, 140, .05, 1, false, false);
    this.attact1 = new Animation(ASSET_MANAGER.getAsset("./img/zero.png"), 88, 80, 93, 140, .05, 5, false, false);
    this.attact2 = new Animation(ASSET_MANAGER.getAsset("./img/zero.png"), 560, 80, 93, 140, .05, 3, false, false);
    this.attact3 = new Animation(ASSET_MANAGER.getAsset("./img/zero.png"), 0, 240, 93, 140, .05, 3, false, false);

    //animation stands
    this.stand = new Animation(ASSET_MANAGER.getAsset("./img/zero.png"), 186, 240, 85, 140, .1, 1, true, false);

    //flame animation
    this.flame = new Animation(ASSET_MANAGER.getAsset("./img/flame.png"), 58, 0, 43, 138, .4, 2, false, true);
    this.flame1 = new Animation(ASSET_MANAGER.getAsset("./img/flame.png"), 0, 0, 29, 138, .4, 2, false, true);

    //animation is running
    this.run = new Animation(ASSET_MANAGER.getAsset("./img/zero.png"), 106, 650, 53, 65, .1, 5, true, false);
    //this.run1 = new Animation(ASSET_MANAGER.getAsset("./img/zero.png"), 377, 650, 53, 65, .3, 2, true, false);
    //this.run2 = new Animation(ASSET_MANAGER.getAsset("./img/zero.png"), 377, 650, 53, 65, .3, 2, true, false);

    //animation is jump
    this.jump = new Animation(ASSET_MANAGER.getAsset("./img/zero.png"), 646, 320, 57.5, 65, .4, 3, false, true);
    this.jumping = false;
    
    this.speed = 100;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, 0, 400);
}

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.update = function () {    
    //When pressing Enter key, the character will swing the sword
    if (this.game.attactMode) {
        this.anotherAction = false;
        if (this.flame1.isDone()) {
            this.attact.elapsedTime = 0;
            this.attact1.elapsedTime = 0;
            this.attact2.elapsedTime = 0;
            this.attact3.elapsedTime = 0;
            this.flame.elapsedTime = 0;
            this.flame1.elapsedTime = 0;
            this.game.attactMode = false;
        }
    }

    if (!this.game.moveUp && !this.game.moveDown && !this.game.moveLeft && !this.game.moveRight) {
        if (this.run.isDone()) {
            this.run.elapsedTime = 0;
        }
    }

    //When pressing arrow keys or A, S, D, W
    if (this.game.moveUp) {
        this.y >= 380 ? this.y -= (this.game.clockTick * this.speed) : this.y        
    }

    if (this.game.moveDown) {
        (this.y + this.run.frameHeight) < 780 ? this.y += (this.game.clockTick * this.speed) : this.y;
        //this.y += (this.game.clockTick * this.speed);
    }

    if (this.game.moveLeft && this.x > 10) {
        this.x -= this.game.clockTick * this.speed;
    }

    if (this.game.moveRight && this.x + this.run.frameWidth < 790) {
        this.x += this.game.clockTick * this.speed;
    }

    //When pressing space key, the character will jump up.
    if (this.game.space) {
        if (this.y >= 350) {
            if (!this.jumping) {
                this.jumping = true;
                this.ground = this.y;
            }
        }
    }
    
    if (this.jumping) {
        if (this.jump.isDone()) {
            this.jump.elapsedTime = 0;
            this.jumping = false;
            this.anotherAction = true;
        }
        var jumpDistance = this.jump.elapsedTime / this.jump.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight*(-3 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) { 
    if(this.jumping){
        this.jump.drawFrame(this.game.clockTick, ctx, this.x + 10, this.y);        
    } else if (this.game.attactMode) {
        this.attact.drawFrame(this.game.clockTick, ctx, this.x + 20, this.y);
        if (this.attact.isDone()) {        
            this.attact1.drawFrame(this.game.clockTick, ctx, this.x + 20, this.y);
            if (this.attact1.isDone()) {            
                this.attact2.drawFrame(this.game.clockTick, ctx, this.x + 20, this.y);
                if (this.attact2.isDone()) {                
                    this.attact3.drawFrame(this.game.clockTick, ctx, this.x + 20, this.y);
                    if (this.attact3.isDone()) {                       
                        this.stand.drawFrame(this.game.clockTick, ctx, this.x, this.y);
                        this.flame.drawFrame(this.game.clockTick, ctx, this.x + 100, this.y + 10);
                        this.flame.drawFrame(this.game.clockTick, ctx, this.x + 120, this.y + 10);
                        this.flame.drawFrame(this.game.clockTick, ctx, this.x + 140, this.y + 10);
                        if (this.flame.isDone()) {
                            this.flame1.drawFrame(this.game.clockTick, ctx, this.x + 110, this.y + 10);
                            this.flame1.drawFrame(this.game.clockTick, ctx, this.x + 120, this.y + 10);
                            this.flame1.drawFrame(this.game.clockTick, ctx, this.x + 130, this.y + 10);
                        }
                    }
                }
            }
        }
    } else if (this.game.moveUp || this.game.moveDown || this.game.moveLeft || this.game.moveRight) {
        this.run.drawFrame(this.game.clockTick, ctx, this.x, this.y + 80);
    } else {
        this.stand.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }    
     
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/ken_right.png");
ASSET_MANAGER.queueDownload("./img/zero.png");
ASSET_MANAGER.queueDownload("./img/flame.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var unicorn = new Unicorn(gameEngine);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(unicorn);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
