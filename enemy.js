//enemy.js

var Enemy = function()
{
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.width = 0;
	this.height = 0;
	this.velocity = new Vector2();
	this.image.src = "rock_large.png";
};
Enemy.prototype.update = function(deltaTime)
{
	
};
Enemy.prototype.draw = function()
{
	DrawImage(context, this.image, this.x, 
				this.y, 0);
};







