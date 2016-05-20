//Set up for monster
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)

function Monster(game, image, width, duration, frame, speed, health) {
//function Monster(game) { 
    Entity.call(this, game);

    this.game = game;
    this.type = ENEMY;
    this.health = health;
        
    this.x = this.game.map.startX;
    this.y = this.game.map.startY;

    this.dx = 25;
    this.dy = 25;

    this.speed = speed;
    this.direction = this.game.map.direction;
    this.radius = 20;

    this.monsterDown = new Animation(image, 0, 0, width, width, duration, frame, true, false);
    this.monsterLeft = new Animation(image, 0, width, width, width, duration, frame, true, false);
    this.monsterRight = new Animation(image, 0, width * 2, width, width, duration, frame, true, false);
    this.monsterUp = new Animation(image, 0, width * 3, width, width, duration, frame, true, false);

    //this.monsterDown = down;
    //this.monsterLeft = left;
    //this.monsterRight = right;
    //this.monsterUp = up;
}

//Monter object is inherited from Entity Object
Monster.prototype = new Entity();
Monster.prototype.constructor = Monster;

Monster.prototype.update = function () {
    Entity.prototype.move.call(this);    
    Entity.prototype.update.call(this);
}

Monster.prototype.draw = function (ctx) {
    switch (this.direction) {
        case EAST:
            this.monsterRight.drawFrame(this.game.clockTick, ctx, this.x - this.dx, this.y - this.dy);
            break;
        case WEST:
            this.monsterLeft.drawFrame(this.game.clockTick, ctx, this.x - this.dx, this.y - this.dy);
            break;
        case NORTH:
            this.monsterUp.drawFrame(this.game.clockTick, ctx, this.x - this.dx, this.y - this.dy);
            break;
        case SOUTH:
            this.monsterDown.drawFrame(this.game.clockTick, ctx, this.x - this.dx, this.y - this.dy);
            break;
    }

    //if (this.game.showOutlines) {
    //    this.game.ctx.beginPath();
    //    this.game.ctx.strokeStyle = "white";
    //    this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    //    this.game.ctx.stroke();
    //    this.game.ctx.closePath();
    //}
}