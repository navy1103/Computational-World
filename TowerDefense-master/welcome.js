// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

//Game Engine Object is to take the input from the player and transfer to game
function Welcome() {
    this.entities = [];
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.atStart = false;
}

//The init function is to set up the canvas of the web browser which you can draw images on it
//The parameter ctx is the canvas 
Welcome.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.startInput();
}

//Starting the game
Welcome.prototype.start = function () {
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

//The startInput method is to get the input from player such as keyboard and mouse
Welcome.prototype.startInput = function () {
    //Get (x, y)
    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        return { x: x, y: y };
    }

    var that = this;

    this.ctx.canvas.addEventListener("click", function (e) {
        that.click = getXandY(e);
        //click on start to start the gamge
        if (that.atStart) {
            level_2();
        }
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        that.mouse = getXandY(e);
        if (that.mouse.x >= 350 && that.mouse.x <= 450 && that.mouse.y >= 400 && that.mouse.y <= 450) {
            that.atStart = true;
        } else {
            that.atStart = false;
        }
    }, false);
}

//Add another Entity into entities array
Welcome.prototype.addEntity = function (entity) {
    this.entities.push(entity);
}


Welcome.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    
    var context = this.ctx;
    context.beginPath();
    context.rect(200, 0, 400, 800);
    context.stroke();
    context.fill();
    if (this.atStart) {
        context.beginPath();
        context.font = "bold 50px Arial";
        context.fillStyle = "#FFFFFF";
        context.fillText("START", 320, 450);
        context.closePath();
    } else {
        context.beginPath();
        context.font = "bold 30px Arial";
        context.fillStyle = "#FFFFFF";
        context.fillText("START", 350, 450);
        context.closePath();
    }

    this.ctx.restore();
}

Welcome.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
}

Welcome.prototype.loop = function () {
    this.update();
    this.draw();
    this.click = null;
}
