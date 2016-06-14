//Mouse.js

var Mouse = function()
{
	var self = this;
	document.onmousemove = function(evt){self.privateState.onMove(evt);};
	window.onmousedown = function(evt){self.privateState.onButtonDown(evt);};
	window.onmouseup = function(evt){self.privateState.onButtonUp(evt);};
	
	this.privateState = {
		onMove: function(e)
		{
			var rect = canvas.getBoundingClientRect();
			this.mousePos.set(e.clientX - rect.left, 
								e.clientY - rect.top);
		},
		onButtonDown: function(e)
		{
			this.buttonState[e.button] = true;
		},
		onButtonUp: function(e)
		{
			this.buttonState[e.button] = false;
		},
		mousePos: new Vector2(),
		buttonState: [],
		buttonPreviousState: [false, false, false],
	};
	
	
	
	this.updateState = function()
	{
		for(var i = 0; i < this.privateState.buttonState.length; ++i)
		{
			this.privateState.buttonPreviousState[i] = 
				this.privateState.buttonState[i];
		}			
	};
	
	this.getMouseDown = function(i)
	{
		return this.privateState.buttonState[i];
	};
	this.getMouseWasDown = function(i)
	{
		return this.privateState.buttonPreviousState[i];
	};
	
	this.getMousePos = function()
	{
		return this.privateState.mousePos.copy();
	};
};