//Set up for Gate
function Gate(game) {
    Entity.call(this, game);

    this.game = game;
    this.type = GATE;
    this.life = 100;

    this.x = 0;
    this.y = 0;
    this.dx = 50;
    this.dy = 50;

    this.gate = new Animation(ASSET_MANAGER.getAsset("./img/left_gate.png"), 0, 0, 70, 100, 1, 1, true, false);
}

Gate.prototype = new Entity();
Gate.prototype.constructor = Gate;

Gate.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        //if the monster is enterring the gate, then the total life minus 1
        if (ent.isEnemy() && Entity.prototype.collide.call(this, ent)) {
            //this.live -= ent.health;  //remain life = current life - monster's health
            this.life -= 1;

            ent.removeFromWorld = true;     //remove monster out of entity

            console.log("Gate :" + this.life);

            document.getElementById('grenade_explosion_sound').play();
            //Game over when total life equals 0
            if (this.life == 0) {
                this.game.gameover = true;
                console.log("game over");
            }
        }
    }
    document.getElementById('live').innerHTML = "LIVE: " + this.life;
};

Gate.prototype.draw = function (ctx) {
    this.gate.drawFrame(this.game.clockTick, ctx, this.x - this.dx, this.y - this.dy);
    Entity.prototype.draw.call(this);
};