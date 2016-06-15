//vector2.js

var Vector2 = function(x, y)
{
	this.x = 0;
	this.y = 0;
	
	if(x != undefined)
	{
		this.x = x;
	}
	if(y != undefined)
	{
		this.y = y;
	}
	
	this.copy = function()
	{
		return new Vector2(this.x, this.y);
	}
	this.set = function(newX, newY)
	{
		this.x = newX;
		this.y = newY;
	};
	this.magnitude = function()
	{
		return Math.sqrt(this.dot());
	};
	this.normalize = function()
	{
		var mag = this.magnitude();
		if(mag == 0) return;
		
		this.x /= mag;
		this.y /= mag;
	};
	this.normalized = function()
	{
		var normCpy = this.copy();
		normCpy.normalize();
		return normCpy;
	};
	this.add = function(v2)
	{
		this.x += v2.x;
		this.y += v2.y;
	};
	this.subtract = function(v2)
	{
		this.x -= v2.x;
		this.y -= v2.y;
	};
	this.multiplyScalar = function(num)
	{
		this.x *= num;
		this.y *= num;
	};
	this.rotateDirection = function(angle)
	{
		var s = Math.sin(angle);
		var c = Math.cos(angle);
		
		var dirX = (this.x * c) - (this.y * s);
		var dirY = (this.x * s) + (this.y * c);
		
		this.set(dirX, dirY);
	};
	this.reverse = function()
	{
		this.set(-this.x, -this.y);
	};
	this.dot = function(v2)
	{
		return this.x*this.x + this.y*this.y;
	};
	this.angle = function()
	{
		return Math.atan2(this.y, this.x);
	};
	//Assumes that both vectors are normalized.
	this.angleBetween = function(v2)
	{
		return Math.acos(this.dot(v2));
	};
};
