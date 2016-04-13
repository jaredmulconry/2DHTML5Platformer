var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var player = new Player();
var keyboard = new Keyboard();
var bullets = [];
var firingRate = 0.3;
var firingTimer = 0;
var enemies = [];
var enemySpawnRate = 3;
var enemySpawnTimer = 0;

function bulletsEnemiesCollide()
{
	for(var i = 0; i < enemies.length; ++i)
	{
		for(var j = 0; j < bullets.length; ++j)
		{
			if(intersects(enemies[i].position.x, enemies[i].position.y,
							enemies[i].width, enemies[i].height,
							bullets[j].position.x, bullets[j].position.y,
							bullets[j].width, bullets[j].height))
			{
				enemies.splice(i, 1);
				bullets.splice(j, 1);
				break;
			}
		}
	}
}

function run()
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	var deltaTime = getDeltaTime();
	
	firingTimer -= deltaTime;
	if(firingTimer <= 0 && keyboard.isKeyDown(keyboard.KEY_SPACE))
	{
		bullets.push(new Bullet());
		firingTimer = firingRate;
	}
	for(var i = 0; i < bullets.length; ++i)
	{
		bullets[i].update(deltaTime);
		bullets[i].draw();
	}
	
	player.update(deltaTime);
	player.draw();
	
	enemySpawnTimer -= deltaTime;
	if(enemySpawnTimer <= 0)
	{
		enemies.push(new Enemy());
		enemySpawnTimer = enemySpawnRate;
	}
	for(var i = 0; i < enemies.length; ++i)
	{
		enemies[i].update(deltaTime);
		enemies[i].draw();
	}
	
	bulletsEnemiesCollide();
	
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}
	
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}


//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
