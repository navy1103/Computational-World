//Set up for tower
function Tower(game, x, y) {  
    Entity.call(this, game);
    this.name = 'B';
    this.game = game;
    this.type = BULLET;

    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;

    this.fireFrequency = 10; //every 10 turns, fires a bullet
    this.fireCounter = this.fireFrequency;
    this.range = 200;    
    this.hit = 1; //default - can be upgraded

    this.tower = new Animation(ASSET_MANAGER.getAsset("./img/tower1.png"), 0, 0, 100, 100, 1, 1, true, false);
}

Tower.prototype = new Entity();
Tower.prototype.constructor = Tower;

Tower.prototype.update = function () {   
    if (this.fireCounter === 0) {
        var i = 0;
        var fired = false;
        while (i < this.game.entities.length && !fired) {
            var ent = this.game.entities[i];
            if (ent.isEnemy() && !ent.removeFromWorld && Entity.prototype.inRange.call(this, ent)) {
                var bullet = new TowerBullet(this.game, this.x, this.y, this.hit, ent.x, ent.y);
                this.game.addTower(bullet);
                fired = true;
                document.getElementById('mp5_smg_sound').play();
            }
            i++;
        }
        this.fireCounter = this.fireFrequency;
    } else {
        this.fireCounter -= 1;
    }
    Entity.prototype.update.call(this);
};

Tower.prototype.draw = function (ctx) {

    this.tower.drawFrame(this.game.clockTick, ctx, this.x - this.dx, this.y - this.dy);

    //draw the tower from the map
    //for (var y = 0; y < this.game.map.mapSize; y++) {
    //    for (var x = 0; x < this.game.map.mapSize; x++) {
    //        if (this.game.map.array[x][y] === GRASS) {
    //            this.tower.drawFrame(this.game.clockTick, ctx, x * BLOCK_SIZE, y * BLOCK_SIZE);
    //        }
    //    }
    //}

    //draw the shadow of the towel
    if (this.game.mouse && chooseTower === 2) {
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
            this.game.ctx.drawImage(ASSET_MANAGER.getAsset("./img/tower1.png"), x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

            this.game.ctx.beginPath();
            this.game.ctx.strokeStyle = "white";
            this.game.ctx.arc(x * BLOCK_SIZE + 50, y * BLOCK_SIZE + 50, this.range, 0, Math.PI * 2, false);
            this.game.ctx.stroke();
            this.game.ctx.closePath();
            //this.tower.drawFrame(this.game.clockTick, ctx, x * BLOCK_SIZE - y * BLOCK_SIZE, this.y - this.dy);
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

function TowerBullet(game, x, y, hit, targetX, targetY) {
    Entity.call(this, game);

    this.game = game;
    this.type = BULLET;

    this.x = x + 50;
    this.y = y + 50;
    this.dx = -5;
    this.dy = -5;

    this.hit = hit;
    this.radius = 3;
    this.direction = { x: 0, y: 0 };
    this.direction.x = (targetX - this.x);  //length
    this.direction.y = (targetY - this.y);  //height 

    var speed = 6;
    var distance = Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y);

    this.direction.x = this.direction.x * speed / distance;
    this.direction.y = this.direction.y * speed / distance;

    this.elapsed = 1;
    this.bullet = new Animation(ASSET_MANAGER.getAsset("./img/bullet.png"), 0, 0, 10, 10, 0.02, 2, true, false)
}

TowerBullet.prototype = new Entity();
TowerBullet.prototype.constructor = TowerBullet;

TowerBullet.prototype.update = function () {
    if (this.x < 0 || this.x > this.game.surfaceWidth || this.y < 0 || this.y > this.game.surfaceHeight) {
        this.removeFromWorld = true;
    }
  
    for (var i = 0; i < this.game.entities.length; i++) {
        var entity = this.game.entities[i];
        if (entity.isEnemy() &&  Entity.prototype.collide.call(this, entity)) {
            entity.health -= this.hit;
            this.removeFromWorld = true;
            if (entity.health <= 0) {
                entity.removeFromWorld = true;
                MONEY += entity.worth;
                document.getElementById("money").innerHTML = MONEY;
            }
        }
    }

    this.x += this.elapsed * this.direction.x
    this.y += this.elapsed * this.direction.y;

    Entity.prototype.update.call(this);
}

TowerBullet.prototype.draw = function (ctx) {
    //this.bullet.drawFrame(this.game.clockTick, ctx, this.x - this.dx, this.y - this.dy);
    this.bullet.drawFrame(this.game.clockTick, ctx, this.x + this.dx, this.y + this.dy);
    //Entity.prototype.draw.call(this);
}
