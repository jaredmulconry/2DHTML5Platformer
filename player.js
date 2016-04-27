
var Player = function() {
	this.image = document.createElement("img");
	this.position = new Vector2(9 * TILE, 0);
	this.velocity = new Vector2();
	this.gunOffset = new Vector2(64, 36);
	this.width = 0;
	this.height = 0;
	this.offset = new Vector2(0, -TILE/8.0);
	
	this.falling = true;
	this.jumping = false;
	
	this.image.src = "hero.png";
	SetupImageEvents(this, this.image);
};
Player.prototype.update = function(deltaTime)
{
	var left = false;
	var right = false;
	var jump = false;
	
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
	{
		left = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true)
	{
		right = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		jump = true;
	}
	
	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
	var falling = this.falling;
	var ddx = 0;
	var ddy = GRAVITY;
	
	if(left)
		ddx = ddx - ACCEL;
	else if(wasleft)
		ddx = ddx + FRICTION;
	
	if(right)
		ddx = ddx + ACCEL;
	else if(wasright)
		ddx = ddx - FRICTION;
	
	if(jump && !this.jumping && !falling)
	{
		ddy = ddy - JUMP;
		this.jumping = true;
	}
	
	this.position.set(Math.floor(this.position.x + deltaTime * this.velocity.x),
					  Math.floor(this.position.y + deltaTime * this.velocity.y));
	this.velocity.set(bound(this.velocity.x + deltaTime * ddx, -MAXDX, MAXDX),
					  bound(this.velocity.y + deltaTime * ddy, -MAXDY, MAXDY));
	
	if((wasleft && this.velocity.x > 0) ||
	   (wasright && this.velocity.x < 0))
	{
		this.velocity.x = 0;
	}
	
	var position = this.position.copy();
	position.add(this.offset);
	
	var tx = pixelToTile(position.x);
	var ty = pixelToTile(position.y);
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellleft = cellAtTileCoord(LAYER_PLATFORMS, tx - 1, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var cellup = cellAtTileCoord(LAYER_PLATFORMS, tx, ty - 1);
	
	if(this.velocity.y > 0)
	{
		if(celldown && !cell)
		{
			this.position.y = tileToPixel(ty) - this.offset.y;
			this.velocity.y = 0;
			this.falling = false;
			this.jumping = false;
		}
	}
	else if(this.velocity.y < 0)
	{
		if(cell && !celldown)
		{
			this.position.y = tileToPixel(ty + 1) - this.offset.y;
			this.velocity.y = 0;
		}
	}
	if(this.velocity.x > 0)
	{
		if(cellright && !cell)
		{
			this.position.x = tileToPixel(tx) - this.offset.x;
			this.velocity.x = 0;
		}
	}
	else if(this.velocity.x < 0)
	{
		if(cellleft && !cell)
		{
			this.position.x = tileToPixel(tx + 1) - this.offset.x;
			this.velocity.x = 0;
		}
	}
}
Player.prototype.draw = function()
{
	DrawImage(context, this.image, this.position.x, this.position.y, 0);
}







