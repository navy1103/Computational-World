//Set up for monster
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)

function Tools(game, image, width, height, task) {
//function Monster(game) { 
    Entity.call(this, game);

    this.game = game;
    if(task === 1)
        this.toolImage = new Animation(image, 0, 0, width, height, 1, 1, true, false);
    else
        this.toolImage = new Animation(image, 0, 0, width / 10, height, .2, 10, true, false);
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

