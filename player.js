//player.js

var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_MAX = 6;

var SPRITE_SHEET_COLUMNS = 12;
var SPRITE_SHEET_ROWS = 8;
var SPRITE_WIDTH = 165;
var SPRITE_HEIGHT = 126;
var SPRITE_TIME_STEP = 0.05;

var Player = function() {
	this.sprite = new Sprite("ChuckNorris.png");
	this.sprite.buildAnimation(SPRITE_SHEET_COLUMNS,
							   SPRITE_SHEET_ROWS,
							   SPRITE_WIDTH,
							   SPRITE_HEIGHT,
							   SPRITE_TIME_STEP,
				[0, 1, 2, 3, 4, 5, 6, 7]);
	this.sprite.buildAnimation(SPRITE_SHEET_COLUMNS,
							   SPRITE_SHEET_ROWS,
							   SPRITE_WIDTH,
							   SPRITE_HEIGHT,
							   SPRITE_TIME_STEP,
				[8, 9, 10, 11, 12]);
	this.sprite.buildAnimation(SPRITE_SHEET_COLUMNS,
							   SPRITE_SHEET_ROWS,
							   SPRITE_WIDTH,
							   SPRITE_HEIGHT,
							   SPRITE_TIME_STEP,
				[13, 14, 15, 16, 17, 18, 19, 
				 20, 21, 22, 23, 24, 25, 26]);
	this.sprite.buildAnimation(SPRITE_SHEET_COLUMNS,
							   SPRITE_SHEET_ROWS,
							   SPRITE_WIDTH,
							   SPRITE_HEIGHT,
							   SPRITE_TIME_STEP,
				[52, 53, 54, 55, 56, 57, 58, 59]);
	this.sprite.buildAnimation(SPRITE_SHEET_COLUMNS,
							   SPRITE_SHEET_ROWS,
							   SPRITE_WIDTH,
							   SPRITE_HEIGHT,
							   SPRITE_TIME_STEP,
				[60, 61, 62, 63, 64]);
	this.sprite.buildAnimation(SPRITE_SHEET_COLUMNS,
							   SPRITE_SHEET_ROWS,
							   SPRITE_WIDTH,
							   SPRITE_HEIGHT,
							   SPRITE_TIME_STEP,
				[65, 66, 67, 68, 69, 70, 71,
				 72, 73, 74, 75, 76, 77, 78]);
	
	this.offset = new Vector2(SPRITE_WIDTH/4, SPRITE_HEIGHT/4);
	
	for(var i = 0; i < ANIM_MAX; ++i)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}
	
	this.sprite.setLoop(true);
	
	this.position = new Vector2(9 * TILE, 4 * TILE);
	this.velocity = new Vector2();
	this.gunOffset = new Vector2(64, 36);
	this.width = SPRITE_WIDTH;
	this.height = SPRITE_HEIGHT;
	
	this.falling = true;
	this.jumping = false;
	
	this.direction = LEFT;
};
Player.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
	var left = false;
	var right = false;
	var jump = false;
	
	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
	var falling = this.falling;
	var ddx = 0;
	var ddy = GRAVITY;
	
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
	{
		left = true;
		this.direction = LEFT;
		if(this.sprite.currentAnimation != ANIM_WALK_LEFT &&
				this.jumping == false)
			this.sprite.setAnimation(ANIM_WALK_LEFT);
	}
	else if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true)
	{
		right = true;
		this.direction = RIGHT;
		if(this.sprite.currentAnimation != ANIM_WALK_RIGHT &&
				this.jumping == false)
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
	}
	else
	{
		if(this.jumping == false && this.falling == false)
		{
			if(this.direction == LEFT)
			{
				if(this.sprite.currentAnimation != ANIM_IDLE_LEFT)
				{
					this.sprite.setAnimation(ANIM_IDLE_LEFT);
				}
			}
			else
			{
				if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
				{
					this.sprite.setAnimation(ANIM_IDLE_RIGHT);
				}
			}
		}
	}
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		jump = true;
	}
	
	if(jump && !this.jumping && !falling)
	{
		ddy = ddy - JUMP;
		this.jumping = true;
		if(this.direction == LEFT && 
		   this.sprite.currentAnimation != ANIM_JUMP_LEFT)
		{
			this.sprite.setAnimation(ANIM_JUMP_LEFT);
		}
		else if(this.direction == RIGHT && 
		   this.sprite.currentAnimation != ANIM_JUMP_RIGHT)
		{
			this.sprite.setAnimation(ANIM_JUMP_RIGHT);
		}
	}
	
	if(left)
		ddx = ddx - ACCEL;
	else if(wasleft)
		ddx = ddx + FRICTION;
	
	if(right)
		ddx = ddx + ACCEL;
	else if(wasright)
		ddx = ddx - FRICTION;
	
	this.velocity.set(bound(this.velocity.x + deltaTime * ddx, -MAXDX, MAXDX),
					  bound(this.velocity.y + deltaTime * ddy, -MAXDY, MAXDY));
	this.position.set(Math.round(this.position.x + deltaTime * this.velocity.x),
					  Math.round(this.position.y + deltaTime * this.velocity.y));
	
	if((wasleft && this.velocity.x > 0) ||
	   (wasright && this.velocity.x < 0))
	{
		this.velocity.x = 0;
	}
	
	var position = this.position.copy();
	position.add(this.offset);
	
	var tx = pixelToTile(position.x);
	var ty = pixelToTile(position.y);
	var platformsLayer = GetLayerIndexByName(level1.layers, LAYER_PLATFORMS);
	
	if(this.velocity.y < 0)
	{
		var tx = pixelToTile(this.position.x + this.offset.x);
		var ty = pixelToTile(this.position.y + this.offset.y);
		if(cellAtTileCoord(platformsLayer, tx, ty))
		{
			this.velocity.y = 0;
			this.position.y = ty * TILE + TILE - this.offset.y;
		}
	}
	else if(this.velocity.y > 0)
	{
		var tx = pixelToTile(this.position.x + this.offset.x);
		var ty = pixelToTile(this.position.y + this.offset.y);
		if(cellAtTileCoord(platformsLayer, tx, ty))
		{
			this.jumping = false;
			this.falling = false;
			this.velocity.y = 0;
			this.position.y = ty * TILE - 1 - this.offset.y;
		}
	}
	if(this.velocity.x < 0)
	{
		var tx = pixelToTile(this.position.x + this.offset.x);
		var ty = pixelToTile(this.position.y + this.offset.y);
		if(cellAtTileCoord(platformsLayer, tx, ty))
		{
			this.velocity.x = 0;
			this.position.x = tx * TILE + TILE - this.offset.x;
		}
	}
	else if(this.velocity.x > 0)
	{
		var tx = pixelToTile(this.position.x + this.offset.x);
		var ty = pixelToTile(this.position.y + this.offset.y);
		if(cellAtTileCoord(platformsLayer, tx, ty))
		{
			this.velocity.x = 0;
			this.position.x = tx * TILE - 1 - this.offset.x;
		}
	}
	
}
Player.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x, this.position.y);
}







