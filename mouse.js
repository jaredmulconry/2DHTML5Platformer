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
			if(typeof(this.privateState.buttonState[i]) == 'undefined')
			{
				this.privateState.buttonPreviousState[i] = false;
				this.privateState.buttonState[i] = false;
			}
			else
			{
				this.privateState.buttonPreviousState[i] = 
					this.privateState.buttonState[i];
			}
			
		}			
	};
	
	this.getMouseDown = function(i)
	{
		if(typeof(this.privateState.buttonState[i]) == 'undefined')
			return false;
		return this.privateState.buttonState[i];
	};
	this.getMouseWasDown = function(i)
	{
		if(typeof(this.privateState.buttonPreviousState[i]) == 'undefined')
			return false;
		return this.privateState.buttonPreviousState[i];
	};
	
	this.getMousePos = function()
	{
		return this.privateState.mousePos.copy();
	};
};