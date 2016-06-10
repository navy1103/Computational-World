
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)

function Tools(game, image) {
    Entity.call(this, game);
    this.game = game;

    this.toolImage = new Animation(image, 0, 0, 60, 38, 1, 1, true, false);
    
}

//Monter object is inherited from Entity Object
Tools.prototype = new Entity();
Tools.prototype.constructor = Tools;

Tools.prototype.update = function () {
    Entity.prototype.move.call(this);    
    Entity.prototype.update.call(this);
}

Tools.prototype.draw = function (ctx) {
    if (this.game.mouse && destroy === 1) {
        var x = this.game.row * 100;
        var y = this.game.col * 100;
        this.toolImage.drawFrame(this.game.clockTick, ctx, x + 15, y + 30);
    }      
}

function SellTower(game, image) {
    Entity.call(this, game);
    this.game = game;
    this.toolImage = new Animation(image, 0, 0, 50, 50, .1, 10, true, false);
}

//Monter object is inherited from Entity Object
SellTower.prototype = new Entity();
SellTower.prototype.constructor = SellTower;

SellTower.prototype.update = function () {
    Entity.prototype.move.call(this);
    Entity.prototype.update.call(this);
}

SellTower.prototype.draw = function (ctx) { 
    if (this.game.mouse && destroy === 2) {
        var x = this.game.row * 100;
        var y = this.game.col * 100;
        this.toolImage.drawFrame(this.game.clockTick, ctx, x + 25, y + 25);
    }

}

