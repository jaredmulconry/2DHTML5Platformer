//bullet.js

var Bullet = function()
{
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.position.add(player.gunOffset);
	this.position.add(player.position);
	this.velocity = new Vector2(1, 0);
	this.width = 0;
	this.height = 0;
	this.speed = 256;
	this.rotation = player.rotation;
	
	this.velocity.rotateDirection(this.rotation);
	this.velocity.multiplyScalar(this.speed);
	
	this.image.src = "bullet.png";
	SetupImageEvents(this, this.image);
};
Bullet.prototype.update = function(deltaTime)
{
	var posChange = this.velocity.copy();
	posChange.multiplyScalar(deltaTime);
	this.position.add(posChange);
};
Bullet.prototype.draw = function()
{
	DrawImage(context, this.image, this.position.x, this.position.y, this.rotation);
}