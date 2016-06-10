//Set up for Gate
function Gate(game) {
    Entity.call(this, game);

    this.game = game;
    this.type = GATE;
    this.life = 100;
    this.maxLife = 100;

    this.x = 0;
    this.y = 0;
    this.dx = 70;
    this.dy = 70;

    this.gate = new Animation(ASSET_MANAGER.getAsset("./img/castle_7.png"), 0, 0, 120, 130, 1, 1, true, false);
}

Gate.prototype = new Entity();
Gate.prototype.constructor = Gate;

Gate.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var entity = this.game.entities[i];
        //if the monster is enterring the gate, then the total life minus enemy's damage
        if (entity.isEnemy() && Entity.prototype.collide.call(this, entity)) {
            this.life -= entity.damage;

            entity.removeFromWorld = true;     //remove monster out of entity

            console.log("Gate :" + this.life);

            document.getElementById('grenade_explosion_sound').play();
            //Game over when total life equals 0
            if (this.life <= 0) {
                this.game.gameover = true;
                console.log("game over");
            }
        }
    }
    // document.getElementById('live').innerHTML = "LIVE: " + this.life;
    var health = document.getElementById("health");
    health.value = (this.life / this.maxLife) * 100;
};

Gate.prototype.draw = function (ctx) {
    this.gate.drawFrame(this.game.clockTick, ctx, this.x - this.dx, this.y - this.dy);
    //Entity.prototype.draw.call(this);
};