//Define Map Object
function Map(game) {    
    this.game = game; 
	this.tile = ASSET_MANAGER.getAsset("./img/grass.jpg"); //default tile
	            
	this.array = new Array([]);
	this.startX = 0;
	this.startY = 0;
	this.mapSize = 0;
	this.startDirection = null; 
};

Map.prototype = new Entity();
Map.prototype.constructor = Map;

Map.prototype.drawGrid = function (ctx) {
    console.log("draw grid");
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
                ctx.fillStyle = "SaddleBrown";
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);                
            } else { //grass
				ctx.drawImage(this.tile, x * BLOCK_SIZE, y * BLOCK_SIZE);           
            }            
        }
    }

    if (chooseTower === 1 || chooseTower === 2) {
        //console.log("Tower is chosen!");
        this.drawGrid(ctx);

    }
   
}