InputManager = new function()
{
    this.reset = function ()
    {	    
	    this.mouseDown = false;
	    this.mouseClick = false;
	    this.deltaX = 0;
	    this.deltaY = 0;
	}
	
    this.reset();
	this.lastMouseX = 0;
	this.lastMouseY = 0;
	
	this.handleKeyDown = function (event) {	

		if (event.keyCode === 27 && !pause) {
		    pause = true;
		} else {
		    pause = false;
		}
	}

    
	this.handleMouseMove = function (event)
	{
		var newPos = GetRelativePosition(canvas, event.pageX, event.pageY);

		this.deltaX = newPos.x - this.lastMouseX;
		this.deltaY = newPos.y - this.lastMouseY;

		this.lastMouseX = newPos.x;
		this.lastMouseY = newPos.y;
	}
	

	this.connect = function(document, canvas)
	{
	    var bindThis = this;
		$(document).keydown  (function(event) { bindThis.handleKeyDown.call(bindThis, event); });
		//$(document).keyup    (function(event) { bindThis.handleKeyUp.call(bindThis, event); });
		$(document).mousemove(function(event) { bindThis.handleMouseMove.call(bindThis, event); });
	}
	
}