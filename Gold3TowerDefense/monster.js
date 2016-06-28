//Set up for monster
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)

function Monster(game, image, width, height, duration, frame, speed, health, damage, worth, radius, healthBarMargin, dx) {
//function Monster(game) { 
    Entity.call(this, game);

    this.game = game;
    this.type = ENEMY;
    this.worth = worth;
    this.maxHealth = health;
    this.health = health;
    this.damage = damage; // damage to main gate
    this.healthBarMargin = healthBarMargin;
        
    this.x = this.game.map.startX;
    this.y = this.game.map.startY;

    this.width = width;

    this.dx = dx;
    this.dy = dx;

    this.speed = speed;
    this.direction = this.game.map.direction;
    this.radius = radius;

    this.monsterDown = new Animation(image, 0, 0, width, height, duration, frame, true, false);
    this.monsterLeft = new Animation(image, 0, width, width, height, duration, frame, true, false);
    this.monsterRight = new Animation(image, 0, width * 2, width, height, duration, frame, true, false);
    this.monsterUp = new Animation(image, 0, width * 3, width, height, duration, frame, true, false);
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

    // draw health bar
    var context = this.game.ctx;
    context.beginPath();
    context.fillStyle= "#FF0000";
    context.fillRect(this.x - 16, this.y - this.healthBarMargin, ((this.health / this.maxHealth) * 25), 2);
    context.closePath();

    //if (this.game.showOutlines) {
    //   this.game.ctx.beginPath();
    //   this.game.ctx.strokeStyle = "white";
    //   this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    //   this.game.ctx.stroke();
    //   this.game.ctx.closePath();
    //}
}

