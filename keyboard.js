
var Keyboard = function() {
	var self = this;
	window.addEventListener('keydown', function(evt) { self.onKeyDown(evt);}, false);
	window.addEventListener('keyup', function(evt) { self.onKeyUp(evt); }, false);
	this.keys = new Array();
	this.prevKeys = [];
	// Key constants. Go here for a list of key codes: 
	// https://developer.mozilla.org/en-US/docs/DOM/KeyboardEvent
	this.KEY_SPACE = 32;
	this.KEY_LEFT = 37;
	this.KEY_UP = 38;
	this.KEY_RIGHT = 39;
	this.KEY_DOWN = 40;
	this.KEY_A = 65;
	this.KEY_D = 68;
	this.KEY_S = 83;
	this.KEY_W = 87;
	this.KEY_SHIFT = 16;
};

Keyboard.prototype.onKeyDown = function(evt)
{
	this.keys[evt.keyCode] = true;
};
Keyboard.prototype.onKeyUp = function(evt)
{
	this.keys[evt.keyCode] = false;
};
Keyboard.prototype.isKeyDown = function(keyCode)
{
	if(typeof(this.keys[keyCode]) == 'undefined')
		return false;
	return this.keys[keyCode];
};
Keyboard.prototype.wasKeyDown = function(i)
{
	if(typeof(this.prevKeys[i]) == 'undefined')
		return false;
	return this.prevKeys[i];
};
Keyboard.prototype.updateState = function()
{
	for(var i = 0; i < this.keys.length; ++i)
	{
		if(typeof(this.keys[i]) == 'undefined')
		{
			this.prevKeys[i] = false;
			this.keys[i] = false;
		}
		else
		{
			this.prevKeys[i] = this.keys[i];
		}
	}			
};

