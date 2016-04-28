var HealthBar = function()
{
	this.position = new Vector2();
	this.images = [];
	this.images[0] = document.createElement("img");
	this.images[0].src = "fullHealthImage.png";
	this.images[1] = document.createElement("img");
	this.images[1].src = "75%healthImage.png";
	//etc...
	this.currentImage = this.images[0];
	
	this.UpdateHealth = function(health)
	{
		if(health < 75)
		{
			this.currentImage = this.images[1];
		}
	};
	this.draw = function()
	{
		DrawImage(context, this.currentImage,
				this.position.x, this.position.y, 0);
	}
};