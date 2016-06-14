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

var LAYER_COUNT = level1.layers.length;
var MAP = {tw: level1.width, th: level1.height};
var TILE = level1.tilewidth;

var levelImages = LoadLevelImages(level1);

var LAYER_BACKGROUND = "Background";
var LAYER_PLATFORMS = "GameTiles";

var METER = TILE;
var GRAVITY = METER * 9.8 * 6;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;
var JUMP = METER * 1500;

function drawTileLayer(ctx, level, layer)
{
	var offsetx = layer.offsetx || 0;
	var offsety = layer.offsety || 0;
	ctx.save();
	ctx.globalAlpha = layer.opacity;
	
	var useParallax = layer.properties !== undefined &&
						layer.properties.parallaxfactor !== undefined;
	if(useParallax)
	{
		offsetx += viewOffset.x * layer.properties.parallaxfactor;
		offsety += viewOffset.y * layer.properties.parallaxfactor;
	}
	
	var idx = 0;
	for(var y = 0;
			y < layer.height;
			++y)
	{
		for(var x = 0;
				x < layer.width;
				++x, ++idx)
		{
			if(layer.data[idx] == 0) continue;
			var tilesetData = GetTileset(level.tilesets, layer.data[idx]);
			var tileset = tilesetData.tileSet;
			var tileIndex = tilesetData.correctedIndex;
			var tileWidth = tileset.tilewidth;
			var padding = tileset.margin;
			var spacing = tileset.spacing;
			var columns = tileset.columns;
			var rows = tileset.tilecount / columns;
			var img = levelImages[tileset.image];
			
			var sx = padding + (tileIndex % columns) * (tileWidth + spacing);
			var sy = padding + Math.floor(tileIndex / rows) * (tileWidth + spacing);
			ctx.drawImage(img, sx, sy, tileWidth, tileWidth, 
										x * TILE + offsetx, y * TILE + offsety, 
										tileWidth+1, tileWidth+1);
		}
	}
	
	ctx.restore();
}
function drawImageLayer(ctx, level, layer)
{
	
}
function drawObjectGroup(ctx, level, layer)
{
	
}

function drawMap(ctx)
{
	for(var layerIdx = 0;
			layerIdx < LAYER_COUNT;
			++layerIdx)
	{
		var currentLayer = level1.layers[layerIdx];
		if(currentLayer.visible == false) continue;
		
		switch(currentLayer.type)
		{
			case "tilelayer":
				drawTileLayer(ctx, level1, currentLayer);
			break;
			case "imagelayer":
				drawImageLayer(ctx, level1, currentLayer);
			break;
			case "objectgroup":
				drawObjectGroup(ctx, level1, currentLayer);
			break;
			default:
				alert("Unrecognisable layer type: " + currentLayer.type);
			break;
		}
	}
}

var cells = [];
function initialize() 
{
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; ++layerIdx)
	{
		var currentLayer = level1.layers[layerIdx];
		if(currentLayer.type != "tilelayer") continue;
		cells[layerIdx] = [];
		var idx = 0;
		
		for(var y = 0; y < currentLayer.height; ++y)
		{
			cells[layerIdx][y] = [];
			for(var x = 0; x < currentLayer.width; ++x)
			{
				if(currentLayer.data[idx] != 0)
				{
					cells[layerIdx][y][x] = 1;
				}
				else if(cells[layerIdx][y][x] != 1)
				{
					cells[layerIdx][y][x] = 0;
				}
				++idx;
			}
		}
	}
}

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var player = new Player();
var keyboard = new Keyboard();
var mouse = new Mouse();
var viewOffset = new Vector2();
var viewScale = new Vector2(0.75, 0.75);

var GameStates = {
	SPLASH : "SplashScreen",
	GAME : "GameScreen",
	WIN : "WinScreen",
	GAMEOVER : "GameOverScreen"
};

var state = GameStates.SPLASH;

function runSplash(deltaTime)
{
	state = GameStates.GAME;
}
function runGame(deltaTime)
{
	context.save();
	if(player.position.x >= viewOffset.x + canvas.width/(2 * viewScale.x))
	{
		viewOffset.x = player.position.x - canvas.width/(2 * viewScale.x);
	}
	context.scale(viewScale.x, viewScale.y);
	context.translate(-viewOffset.x, -viewOffset.y);
	drawMap(context);
	
	player.update(deltaTime);
	player.draw();
	
	context.restore();
}
function runWin(deltaTime)
{
	
}
function runGameOver(deltaTime)
{
	
}

function run()
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	var deltaTime = getDeltaTime();
	
	if(mouse.getMouseDown(0) 
		&& !mouse.getMouseWasDown(0))
	{
		console.log(mouse.getMousePos());
	}
	
	
	switch(state)
	{
		case GameStates.SPLASH:
			runSplash(deltaTime);
		break;
		case GameStates.GAME:
			runGame(deltaTime);
		break;
		case GameStates.WIN:
			runWin(deltaTime);
		break;
		case GameStates.GAMEOVER:
			runGameOver(deltaTime);
		break;
		default:
			alert("You've hit an invalid state: " + state);
		break;
	}
	
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}
	
	mouse.updateState();
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}

initialize();
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
