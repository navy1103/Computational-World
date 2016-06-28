//Set up for Tower2
function Tower2(game, x, y) {
    Entity.call(this, game);
    this.name = 'C';
    this.game = game;
    this.type = BULLET;

    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;

    this.fireFrequency = 300; //every 300 turns, fires a Missile
    this.fireCounter = 130;
    this.range = 400;    
    this.hit = 40; //default - can be upgraded

    this.tower = new Animation(ASSET_MANAGER.getAsset("./img/tower2.png"), 0, 0, 100, 100, 1, 1, true, false);
}

Tower2.prototype = new Entity();
Tower2.prototype.constructor = Tower2;

Tower2.prototype.update = function () {
    if (this.fireCounter <= 0) {
        var i = 0;
        var fired = false;
        while (i < this.game.entities.length && !fired) {
            var entity = this.game.entities[i];
            if (entity.isEnemy() && !entity.removeFromWorld && Entity.prototype.inRange.call(this, entity)) {
                var missile = new Tower2Missile(this.game, this.x, this.y, this.hit, entity);
                this.game.addTower(missile);
                fired = true;
                document.getElementById('missile_sound').play();
            }
            i++;
        }
        this.fireCounter = this.fireFrequency + Math.random() * this.fireFrequency / 5; //<--- random here so that every tower launchs a missile seperately (not at the same time)
    } else {
        this.fireCounter -= 1;
    }
    Entity.prototype.update.call(this);
};

Tower2.prototype.draw = function (ctx) {
    this.tower.drawFrame(this.game.clockTick, ctx, this.x - this.dx, this.y - this.dy);

    //draw the Tower2 from the map
    //for (var y = 0; y < this.game.map.mapSize; y++) {
    //    for (var x = 0; x < this.game.map.mapSize; x++) {
    //        if (this.game.map.array[x][y] === GRASS) {
    //            this.Tower2.drawFrame(this.game.clockTick, ctx, x * BLOCK_SIZE, y * BLOCK_SIZE);
    //        }
    //    }
    //}

    //draw the shadow of the towel
    if (chooseTower === 3) {
        //ctx.save();
        //ctx.globalAlpha = 0.5;
        this.game.showOutlines = true;
        var x = this.game.row;
        var y = this.game.col;

        //console.log(x || y);

        if (x < 0 || y < 0 || x > this.game.map.mapSize - 1 || y > this.game.map.mapSize - 1) {
            return;
        }

        if (this.game.map.array[y][x] === GRASS) {
            this.game.ctx.drawImage(ASSET_MANAGER.getAsset("./img/tower2.png"), x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            this.game.ctx.beginPath();
            this.game.ctx.strokeStyle = "white";
            this.game.ctx.arc(x * BLOCK_SIZE + 50, y * BLOCK_SIZE + 50, this.range, 0, Math.PI * 2, false);
            this.game.ctx.stroke();
            this.game.ctx.closePath();
        } else {
            this.game.ctx.fillStyle = '#F44336';
            this.game.ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }

    //Draw circle around the object       
    if (this.game.showOutlines) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "white";
        this.game.ctx.arc(this.x + 50, this.y + 50, this.range, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
};

//----------------------------------------------------------------------------------------------------

function Tower2Missile(game, x, y, hit, target) {
    Entity.call(this, game);
    this.game = game;
    this.type = BULLET;
    
    this.x = x + 50;
    this.y = y + 50;
    this.dx = 50;
    this.dy = 50;

    this.target = target;
    this.speed = 3;
    this.hit = hit;
    this.radius = 30;

    this.targetHit = false;

    this.elapsed = 1;
    this.nextPoint = { x: 0, y: 0 };
    this.nextPoint.x = (this.target.x - this.x);  //length
    this.nextPoint.y = (this.target.y - this.y);  //height 
    var distance = Math.sqrt(this.nextPoint.x * this.nextPoint.x + this.nextPoint.y * this.nextPoint.y);
    this.nextPoint.x = this.nextPoint.x * this.speed / distance;
    this.nextPoint.y = this.nextPoint.y * this.speed / distance;
    this.x += this.elapsed * this.nextPoint.x
    this.y += this.elapsed * this.nextPoint.y;

    this.animationCounter = 0; //turn 0 and then 1, and then back to 0 because we have 2 frames for the missile animation

    this.flies = ["./img/missile1.png", "./img/missile1.png", "./img/missile1.png", "./img/missile2.png", "./img/missile2.png", "./img/missile2.png"];
    this.missile = new Animation(ASSET_MANAGER.getAsset("./img/missile.png"), 0, 0, 100, 100, 0.05, 2, true, false);
    this.blowup = new Animation(ASSET_MANAGER.getAsset("./img/blowup.png"), 0, 0, 100, 100, 10, 4, false, false);
}

Tower2Missile.prototype = new Entity();
Tower2Missile.prototype.constructor = Tower2Missile;

Tower2Missile.prototype.update = function () {
    if (this.x < 0 || this.x > this.game.surfaceWidth || this.y < 0 || this.y > this.game.surfaceHeight) {
        this.removeFromWorld = true;
    }

    //hit any enemy that collides with this missile 
    for (var i = 0; i < this.game.entities.length; i++) {
        var entity = this.game.entities[i];
        if (entity.isEnemy() && Entity.prototype.collide.call(this, entity)) {
            entity.health -= this.hit;
            this.targetHit = true;
            this.lastEnemyX = this.target.x;
            this.lastEnemyY = this.target.y;
            document.getElementById('grenade_explosion_sound').play();
            this.blowup.drawFrame(this.game.clockTick, this.game.ctx, this.x - this.dx, this.y - this.dy);            
            if (entity.health <= 0) {
                entity.removeFromWorld = true;
                MONEY += entity.worth;
                document.getElementById("money").innerHTML = MONEY;
            }
        }
    }
    
    //search the new location of the target
    if (!this.removeFromWorld && (this.target == null || this.target.removeFromWorld)) {
       var newTarget = null;
        var minDistance = 99999; //just make it is bigger than all posible distance.
        for (var i = 0; i < this.game.entities.length; i++) {
            var entity = this.game.entities[i];
            if (entity.isEnemy() && !entity.removeFromWorld) {
                var d = Math.sqrt((this.x - entity.x) * (this.x - entity.x) + (this.y - entity.y) * (this.y - entity.y));
                if (d < minDistance) {
                    minDistance = d;
                    newTarget = entity;
                }
            }
        }
        if (newTarget != null) {
            this.target = newTarget;
        } else { //no more enemy
            this.removeFromWorld = true;
        }
    }

    this.nextPoint.x = (this.target.x - this.x);  //length
    this.nextPoint.y = (this.target.y - this.y);  //height 
    var distance = Math.sqrt(this.nextPoint.x * this.nextPoint.x + this.nextPoint.y * this.nextPoint.y);
    this.nextPoint.x = this.nextPoint.x * this.speed / distance;
    this.nextPoint.y = this.nextPoint.y * this.speed / distance;

    this.x += this.elapsed * this.nextPoint.x
    this.y += this.elapsed * this.nextPoint.y;
    var degree = Math.atan((this.target.x - this.x) / (this.y - this.target.y)) / Math.PI * 180;
    if (this.y < this.target.y) {
        degree += 180;
    }

    var TO_RADIANS = Math.PI / 180;
    var angle = degree * TO_RADIANS;
    this.animationCounter = (this.animationCounter + 1) % 6; //<----- total frames 
    var rotatedImage = this.rotateAndCache(ASSET_MANAGER.getAsset(this.flies[this.animationCounter]), angle);
    
    this.missile = new Animation(rotatedImage, 0, 0, 100, 100, 1, 2, true, false);

    Entity.prototype.update.call(this);
}

Tower2Missile.prototype.draw = function (ctx) {
    if (this.targetHit) {  
        this.blowup.drawFrame(this.game.clockTick, ctx, this.lastEnemyX - this.dx, this.lastEnemyY - this.dy);        
        this.removeFromWorld = true;
    } else {
        this.missile.drawFrame(this.game.clockTick, ctx, this.x - this.dx, this.y - this.dy);
    }
   
    //Entity.prototype.draw.call(this);
    //Draw circle around the object       
    //if (this.game.showOutlines) {
    //    this.game.ctx.beginPath();
    //    this.game.ctx.strokeStyle = "white";
    //    this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    //    this.game.ctx.stroke();
    //    this.game.ctx.closePath();
    //}
}

