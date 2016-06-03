
function isDef(v) 			{ return v !== undefined; }
function isNull(v) 			{ return v === null; }
function isDefAndNotNull(v) { return vl != null; }

// Helper to provides requestAnimationFrame in a cross browser way.
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( callback, 1000 / 60 );
		};
	} )();
}

// http://stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas/6551032#6551032
function GetRelativePosition(target, x,y) {
	//this section is from http://www.quirksmode.org/js/events_properties.html
	// jQuery normalizes the pageX and pageY
	// pageX,Y are the mouse positions relative to the document
	// offset() returns the position of the element relative to the document
	var offset = $(target).offset();
	var x = x - offset.left;
	var y = y - offset.top;

	return {"x": x, "y": y};
}

// Assorted Drawing utilities

function MakeColor(r,g,b) {
	return "rgb("+Math.floor(Clamp(r, 0, 255))+","+Math.floor(Clamp(g, 0, 255))+","+Math.floor(Clamp(b, 0, 255))+")";
}

// Assorted math utilities

function Pow2(v) {
	return v*v;
}

function Lerp(a,b,t) {
	return a+(b-a)*t;
}

function Clamp(v,a,b) {
	return Math.max(a,Math.min(v,b));
}

function RandomInt(v) {
	return Math.floor(Math.random()*v);
}

function RandomIntRange(a,b) {
	return Math.floor(Math.random()*(b-a)+a);
}

function RandomFloat(v) {
	return Math.random()*v;
}

function RandomFloatRange(a,b) {
	return Math.random()*(b-a)+a;
}

function RandomColor(min, max) {
	return MakeColor(RandomIntRange(min, max), RandomIntRange(min, max), RandomIntRange(min, max));
}
