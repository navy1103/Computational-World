/* Game class */
function Game () {
	// Init game variables	
	this.score = 0;
	this.time = 0;
	this.level = 1;

	// Init entities.
	this.starfield = new Starfield(canvas.width, canvas.height);
	this.explosions = new Explosions();
	this.enemies = new Enemies(MakeColor(255, 255, 0));
	this.enemyBullets = new Bullets(MakeColor(255, 0, 0));
	
	this.player = new Player(40, canvas.height / 2, 10);
	this.playerBullets = new Bullets(MakeColor(64, 255, 255));
}

Game.prototype.Tick = function(elapsed)
{
	//fps.update(elapsed);
	this.Update(elapsed);
	this.Draw(elapsed);
}

Game.prototype.Update = function (elapsed)
{    
	if (!pause)
	{
	    if (this.player.life > 0)
	        this.time += elapsed; // Player is alive, keep time ticking
	    else
	        pause = true;

		this.level = Math.floor(this.time / 30 + 1); // Increase level every 15 seconds

		// Create new enemy every 40 frames or so, with life equal to difficulty level.
		if (RandomInt(70) == 0)
			this.enemies.Add(canvas.width + 20, RandomFloat(canvas.height), 10, 170, this.level, RandomIntRange(2,9), RandomIntRange(2,9));

		// Update of game entities
		this.player.Update(elapsed);
		this.enemies.Update(elapsed);
		this.playerBullets.Update(elapsed);
		this.enemyBullets.Update(elapsed);

		// Use the mouse position to give stars and explosions a little variation in movement.
		var mx = Clamp(InputManager.lastMouseX, 0, canvas.width);
		var my = Clamp(InputManager.lastMouseY, 0, canvas.height);
		var sx = Lerp(25, 50, mx/canvas.width);
		var sy = Lerp(-10, 10, my/canvas.height);
		this.explosions.Update(elapsed, sx, sy);
		this.starfield.Update(elapsed, sx, sy);

		// Collision detection and response
		// Player vs enemy bullets
		var that = this;
		if (this.player.life > 0)
			this.enemyBullets.Collide(this.player.x, this.player.y, 3, function(s) {
			    that.player.life -= 1;
			    if (that.player.life > 0)
			        that.explosions.Add(s.x, s.y, 8, 3);
				else
				{
					// Player dies
			        that.explosions.Add(that.player.x, that.player.y, 24, 1);
				}
				s.life = 0; // Kill bullet
				return that.player.life > 0;
			});

	    // Enemies vs player bullets
		
		for (var e, i = 0; e = this.enemies.enemies[i]; ++i)
		{
			if (e.life > 0) {
				this.playerBullets.Collide(e.x, e.y, e.size, function(s) {
					e.life -= 1;
					if (e.life > 0)
					    that.explosions.Add(s.x, s.y, 8, 3);
					else
					{
						// Enemy dies
						that.score++;
						that.explosions.Add(e.x, e.y, 16, 2);
					}
					s.life = 0; // Kill bullet
					return e.life > 0;
				});
			}
		}
	}
}

Game.prototype.Draw = function(elapsed)
{
	// Clear the screen
	var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
	grad.addColorStop(0, '#000');
	grad.addColorStop(0.3, '#012');
	grad.addColorStop(0.6, '#001');
	grad.addColorStop(0.9, '#012');
	grad.addColorStop(1, '#000');
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw objects
	//ctx.drawImage(this.images['sun'], 600, 20);

	this.starfield.Draw(elapsed);
	this.explosions.Draw(elapsed);
	this.enemies.Draw(elapsed);
	this.playerBullets.Draw(elapsed);
	this.enemyBullets.Draw(elapsed);
	this.player.Draw(elapsed);
	
	// HUD
	ctx.textAlign = "left";
	ctx.fillStyle = "white";
	ctx.font = "20px sans-serif";
	ctx.fillText("Shields: " + this.player.life, 3, 20);
	ctx.textAlign = "center";
	ctx.fillText("Score: " + this.score, canvas.width / 2, 20);
	ctx.textAlign = "right";
	ctx.fillText("Level: " + this.level, canvas.width-3, 20);
	if (this.player.life <= 0)
	{
		ctx.textAlign = "center";
		ctx.fillStyle = "red";
		ctx.font = "60px sans-serif";
		ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
	}
}

/* Looping the game */

var GameLoopManager = new function () {
    this.lastTime = 0;
    this.gameTick = null;
    this.prevElapsed = 0;
    this.prevElapsed2 = 0;

    this.run = function (gameTick) {
        var prevTick = this.gameTick;
        this.gameTick = gameTick;
        if (this.lastTime == 0) {
            // Once started, the loop never stops.
            // But this function is called to change tick functions.
            // Avoid requesting multiple frames per frame.
            var bindThis = this;
            requestAnimationFrame(function () { bindThis.tick(); });
            this.lastTime = 0;
        }
    }

    this.stop = function () {
        this.run(null);
    }

    this.tick = function () {
        if (this.gameTick != null) {
            var bindThis = this;
            requestAnimationFrame(function () { bindThis.tick(); });
        }
        else {
            this.lastTime = 0;
            return;
        }
        var timeNow = Date.now();
        var elapsed = timeNow - this.lastTime;
        if (elapsed > 0) {
            if (this.lastTime != 0) {
                if (elapsed > 1000) // Cap max elapsed time to 1 second to avoid death spiral
                    elapsed = 1000;
                // Hackish fps smoothing
                var smoothElapsed = (elapsed + this.prevElapsed + this.prevElapsed2) / 3;
                this.gameTick(0.001 * smoothElapsed);
                this.prevElapsed2 = this.prevElapsed;
                this.prevElapsed = elapsed;
            }
            this.lastTime = timeNow;
        }
    }
}