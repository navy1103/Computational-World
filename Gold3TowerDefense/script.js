//Set up for Script
//Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
function Script(game, stage) {
    this.game = game;
	this.currentStage = stage;
	//this.maxStage = 3; //<-- maximum stage
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
	        // map.array = [ //G=Grass, R=Road, S=Start point, E=end point, P = tree, K = Rock 
	        //          ['K', 'S', 'K', 'K', 'G', 'G', 'G', 'K'],
	        //          ['G', 'R', 'K', 'R', 'R', 'R', 'R', 'G'],
	        //          ['G', 'R', 'G', 'R', 'G', 'G', 'R', 'G'],
	        //          ['G', 'R', 'G', 'R', 'G', 'G', 'R', 'G'],
	        //          ['G', 'R', 'G', 'R', 'G', 'K', 'R', 'G'],
	        //          ['G', 'R', 'R', 'R', 'G', 'K', 'R', 'G'],
	        //          ['K', 'G', 'G', 'G', 'G', 'G', 'R', 'G'],
	        // ['K', 'E', 'R', 'R', 'R', 'R', 'R', 'K']];
	        map.array = [ //G=Grass, R=Road, S=Start point, E=end point, P = tree, K = Rock 
                ['G', 'S', 'G', 'G', 'G', 'G', 'G', 'G'],
                ['G', 'R', 'G', 'R', 'R', 'R', 'R', 'G'],
                ['G', 'R', 'G', 'R', 'G', 'G', 'R', 'G'],
                ['G', 'R', 'G', 'R', 'G', 'G', 'R', 'G'],
                ['G', 'R', 'G', 'R', 'G', 'G', 'R', 'G'],
                ['G', 'R', 'R', 'R', 'G', 'G', 'R', 'G'],
                ['G', 'G', 'G', 'G', 'G', 'G', 'R', 'G'],
                ['G', 'E', 'R', 'R', 'R', 'R', 'R', 'G']];
	        map.startDirection = SOUTH;

	        // randomly generate trees
	        generateTree();
	        break;

	    case 2:
	        // create the map
	        map.mapSize = 8;
	        map.tile = ASSET_MANAGER.getAsset("./img/grass.jpg");
	        
	        map.array = [ //G=Grass, R=Road, S=Start point, E=end point, P = tree, K = Rock 
             ['G', 'G', 'R', 'R', 'R', 'G', 'G', 'G'],
             ['S', 'R', 'R', 'G', 'R', 'G', 'G', 'G'],
             ['G', 'G', 'G', 'G', 'R', 'G', 'G', 'G'],
             ['G', 'G', 'G', 'G', 'R', 'G', 'G', 'G'],
             ['G', 'G', 'R', 'R', 'R', 'G', 'R', 'E'],
             ['G', 'G', 'R', 'G', 'G', 'G', 'R', 'G'],
             ['G', 'G', 'R', 'R', 'R', 'G', 'R', 'G'],
             ['G', 'G', 'G', 'G', 'R', 'R', 'R', 'G']];
	        map.startDirection = WEST;

	        // randomly generate trees
	        generateTree();
	        break;

	    case 3:
	        // create the map
	        map.mapSize = 8;
	        map.tile = ASSET_MANAGER.getAsset("./img/grass.jpg");

	        map.array = [ //G=Grass, R=Road, S=Start point, E=end point, P = tree, K = Rock 
             ['E', 'G', 'R', 'R', 'R', 'G', 'G', 'G'],
             ['R', 'G', 'R', 'G', 'R', 'R', 'R', 'G'],
             ['R', 'R', 'R', 'G', 'G', 'G', 'R', 'R'],
             ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'R'],
             ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'R'],
             ['G', 'G', 'G', 'G', 'R', 'R', 'R', 'R'],
             ['S', 'R', 'R', 'R', 'R', 'G', 'G', 'G'],
             ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G']];
	        map.startDirection = EAST;

	        // randomly generate trees
	        generateTree();
	        break;

	    case 4:
	        // create the map
	        map.mapSize = 8;
	        map.tile = ASSET_MANAGER.getAsset("./img/grass.jpg");

	        map.array = [ //G=Grass, R=Road, S=Start point, E=end point, P = tree, K = Rock 
             ['R', 'R', 'R', 'R', 'G', 'G', 'G', 'G'],
             ['R', 'G', 'G', 'R', 'G', 'G', 'R', 'S'],
             ['R', 'G', 'G', 'R', 'G', 'G', 'R', 'G'],
             ['R', 'G', 'R', 'R', 'G', 'G', 'R', 'G'],
             ['R', 'G', 'R', 'G', 'G', 'G', 'R', 'G'],
             ['R', 'G', 'R', 'G', 'R', 'R', 'R', 'G'],
             ['R', 'G', 'R', 'G', 'R', 'G', 'G', 'G'],
             ['E', 'G', 'R', 'R', 'R', 'G', 'G', 'G']];
	        map.startDirection = EAST;

	        // randomly generate trees
	        generateTree();
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
	//this.game.enemyList = enemyList; //load enemy list
	this.game.timer = new Timer(); //reset game time to 0
	//this.game.gameWon = false;

	document.getElementById("money").innerHTML = MONEY;

	function generateTree() {
	    for (var i = 0; i < map.array.length; i++) {
	        var currentArray = map.array[i];
	        for (var j = 0; j < currentArray.length; j++) {
	            if (currentArray[j] === 'G') {
	                var rand = Math.random();
	                if (rand < 0.15) {
	                    map.array[i][j] = 'K';
	                }
	            }
	        }
	    }
	}
};


