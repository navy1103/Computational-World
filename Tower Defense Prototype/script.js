//Set up for Script
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
function Script(game) {
    this.game = game;
	this.currentStage = 1;
	this.maxStage = 1; //<-- maximum stage
	this.loadStage();	
};

Script.prototype.loadStage = function () {
    var map = new Map(this.game);
    var gate = new Gate(this.game);
	var enemyList = [];
	switch (this.currentStage) {
	    case 1:
            // create the map
			map.mapSize = 8;
			map.tile = ASSET_MANAGER.getAsset("./img/grass.jpg"); 
			// map.array = [ //G=Grass, R=Road, S=Start point, E=end point, 
			// ['G', 'S', 'G', 'G', 'G', 'G', 'G', 'G'],
   //          ['G', 'R', 'G', 'G', 'G', 'G', 'G', 'G'],
   //          ['G', 'R', 'R', 'R', 'R', 'R', 'R', 'G'],
   //          ['G', 'G', 'G', 'G', 'G', 'G', 'R', 'G'],
   //          ['G', 'R', 'R', 'R', 'R', 'G', 'R', 'G'],
   //          ['G', 'R', 'G', 'G', 'R', 'G', 'R', 'G'],
   //          ['G', 'R', 'G', 'G', 'R', 'G', 'R', 'G'],
   //          ['G', 'E', 'G', 'G', 'R', 'R', 'R', 'G']];
   map.array = [ //G=Grass, R=Road, S=Start point, E=end point, P = tree, K = Rock 
            ['K', 'S', 'K', 'K', 'G', 'G', 'G', 'K'],
            ['G', 'R', 'K', 'R', 'R', 'R', 'R', 'G'],
            ['G', 'R', 'G', 'R', 'G', 'G', 'R', 'G'],
            ['G', 'R', 'G', 'R', 'G', 'G', 'R', 'G'],
            ['G', 'R', 'G', 'R', 'G', 'K', 'R', 'G'],
            ['G', 'R', 'R', 'R', 'G', 'K', 'R', 'G'],
            ['K', 'G', 'G', 'G', 'G', 'G', 'R', 'G'],
            ['K', 'E', 'R', 'R', 'R', 'R', 'R', 'K']];
			map.startDirection = SOUTH;

	        // create some towers for defending
			//this.game.addTower(new Tower(this.game, 200, 100));
			//this.game.addTower(new Tower(this.game, 50, 350));
			//this.game.addTower(new Tower2(this.game, 650, 150));
			//this.game.addTower(new Tower2(this.game, 300, 500));

	        // create the enemy list;            
			//enemyList.push(new IncomingEnemy(1, ENEMY_MONSTER));
			//enemyList.push(new IncomingEnemy(1.5, ENEMY_MONSTER));
			//enemyList.push(new IncomingEnemy(2, ENEMY_MONSTER));
			//enemyList.push(new IncomingEnemy(3, ENEMY_MONSTER));
			//enemyList.push(new IncomingEnemy(5, ENEMY_MONSTER));

			//for (var i = 1; i < 52; i++) {
			//    enemyList.push(new IncomingEnemy(i, ENEMY_MONSTER));
			//}
            break;			
	}
	
    // this part of code calculates the startting point (X,Y) and the puts the gate into the map automatically based on the letter 'E' on the map(ending point)
	for (var y = 0; y < map.mapSize; y++) {
		for (var x = 0; x < map.mapSize; x++) {
			if (map.array[x][y] == 'S') {
				map.startX = y * BLOCK_SIZE + BLOCK_SIZE / 2;
				map.startY = x * BLOCK_SIZE + BLOCK_SIZE / 2;
				map.array[x][y] = 'R';
			}
			if (map.array[x][y] == 'E') {
				gate.x = y * BLOCK_SIZE + BLOCK_SIZE / 2;
				gate.y = x * BLOCK_SIZE + BLOCK_SIZE / 2;
				map.array[x][y] = 'R';
			}
		}
	}

	this.game.map = map; //load map
	this.game.gate = gate; //load gate
	this.game.enemyList = enemyList; //load enemy list
	this.game.timer = new Timer(); //reset game time to 0
	this.game.gameWon = false;

	document.getElementById("money").innerHTML = "Current Money: $" + MONEY;
};
