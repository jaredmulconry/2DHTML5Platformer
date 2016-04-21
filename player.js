
var Player = function() {
	this.image = document.createElement("img");
	this.position = new Vector2(canvas.width/2, canvas.height/2);
	this.gunOffset = new Vector2(64, 36);
	this.width = 0;
	this.height = 0;
	this.rotation = 0;
	this.moveSpeed = 128;
	
	this.image.src = "hero.png";
	SetupImageEvents(this, this.image);
};
Player.prototype.update = function(deltaTime)
{
	var moveDirection = new Vector2();
	if(keyboard.isKeyDown(keyboard.KEY_W))
	{
		moveDirection.y -= 1;
	}
	if(keyboard.isKeyDown(keyboard.KEY_S))
	{
		moveDirection.y += 1;
	}
	if(keyboard.isKeyDown(keyboard.KEY_A))
	{
		moveDirection.x -= 1;
	}
	if(keyboard.isKeyDown(keyboard.KEY_D))
	{
		moveDirection.x += 1;
	}
	if(moveDirection.magnitude() != 0)
	{
		moveDirection.normalize();
	}
	
	moveDirection.multiplyScalar(this.moveSpeed * deltaTime);
	this.position.add(moveDirection);
}
Player.prototype.draw = function()
{
	DrawImage(context, this.image, this.position.x, this.position.y, this.rotation);
}