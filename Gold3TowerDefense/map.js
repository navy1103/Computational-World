//Define Map Object
function Map(game) {    
    this.game = game; 
	this.grassTile = ASSET_MANAGER.getAsset("./img/grasstile.jpg");
	this.roadTile = ASSET_MANAGER.getAsset("./img/roadtile.jpg");

	this.tree = new Animation(ASSET_MANAGER.getAsset("./img/tree.png"), 0, 0, 100, 100, 1, 1, true, false);

	this.array = new Array([]);
	this.startX = 0;
	this.startY = 0;
	this.mapSize = 0;
	this.startDirection = null; 
};

Map.prototype = new Entity();
Map.prototype.constructor = Map;

Map.prototype.drawGrid = function (ctx) {
    //console.log("draw grid");
    for (var i = 1; i < this.mapSize; i++) {        
        for (var j = 1; j < this.mapSize; j++) {
            ctx.beginPath();
            ctx.moveTo(i * BLOCK_SIZE, 0);
            ctx.lineTo(i * BLOCK_SIZE, this.mapSize * BLOCK_SIZE);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, j * BLOCK_SIZE);
            ctx.lineTo(this.mapSize * BLOCK_SIZE, j * BLOCK_SIZE);
            ctx.stroke();
        }
    }
}

Map.prototype.update = function () {}

Map.prototype.draw = function (ctx) {
    for (var x = 0; x < this.mapSize; x++) {
        for (var y = 0; y < this.mapSize; y++) {            
            if (this.array[y][x] === ROAD) { //road
                ctx.drawImage(this.roadTile, x * BLOCK_SIZE, y * BLOCK_SIZE);                         
            } else { //grass
				ctx.drawImage(this.grassTile, x * BLOCK_SIZE, y * BLOCK_SIZE);           
            }            
        }
    }

    //draw the Tree and Rock from the map
    for (var x = 0; x < this.game.map.mapSize; x++) {
        for (var y = 0; y < this.game.map.mapSize; y++) {
            if (this.game.map.array[y][x] === TREE) {
                this.tree.drawFrame(this.game.clockTick, ctx, x * BLOCK_SIZE, y * BLOCK_SIZE);
            }            
        }
    }

    if (chooseTower === 1 || chooseTower === 2 || chooseTower === 3 || destroy === 1 || destroy === 2) {
        //console.log("Tower is chosen!");
        this.drawGrid(ctx);
    }
   
}