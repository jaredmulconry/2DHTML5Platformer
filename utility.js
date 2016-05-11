//utility.js

function SetupImageEvents(object, img)
{
	img.onload = function() {
		object.width = img.width;
		object.height = img.height;
	};
	img.onerror = function() {
		console.log("Failed to load image at path " + this.src);
	};
}
function IsImageOk(img)
{
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}
function DrawImage(ctx, img, x, y, rot, scaleX, scaleY)
{
	if(!IsImageOk(img)) return;
	ctx.save();
		ctx.translate(x, y);
		ctx.scale(scaleX || 1, scaleY || 1);
		ctx.rotate(rot);
		ctx.drawImage(img, -img.width/2, -img.height/2);
	ctx.restore();
}
function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
	if(y2 + h2/2 < y1 - h1/2 ||
		x2 + w2/2 < x1 - w1/2 ||
		x2 - w2/2 > x1 + w1/2 ||
		y2 - h2/2 > y1 + h1/2)
	{
		return false
	}
	return true;
}
function rand(floor, ceil)
{
	//return Math.floor((Math.random() * (ceil-floor)) + floor);
	return Math.random() * (ceil-floor) + floor;
}

function cellAtPixelCoord(layer, x, y)
{
	if(x < 0 || x > SCREEN_WIDTH)
		return 1;
	if(y > SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
}
function cellAtTileCoord(layer, tx, ty)
{
	if(tx < 0 || tx >= MAP.tw)
		return 1;
	if(ty < 0 || ty >= MAP.th)
		return 1;
	return cells[layer][ty][tx];
}
function tileToPixel(tile)
{
	return tile * TILE;
}
function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
}
function bound(value, min, max)
{
	if(value < min)
		return min;
	if(value > max)
		return max;
	return value;
}

function LoadLevelImages(level)
{
	var levelImages = {};
	if(level === undefined) return undefined;
	for(var i = 0; i < level1.tilesets.length; ++i)
	{
		var src = level1.tilesets[i].image;
		if(levelImages[src] !== undefined) continue;
		
		var img = document.createElement("img");
		img.src = src;
		levelImages[src] = img;
	}
	for(var i = 0; i < level1.layers.length; ++i)
	{
		if(level1.layers[i].type != "imagelayer") continue;
		var src = level1.layers[i].image;
		if(levelImages[src] !== undefined) continue;
		
		var img = document.createElement("img");
		img.src = src;
		levelImages[src] = img;
		
	}
	
	return levelImages;
}

function GetTileset(tilesets, tileIndex)
{	
	var tileSet;
	var correctedIndex = tileIndex;
	
	if(tileIndex >= 0)
	{
		for(var i = 0; i < tilesets.length; ++i)
		{
			var tSet = tilesets[i];
			if(tileIndex >= tSet.firstgid && 
				tileIndex < tSet.firstgid + tSet.tilecount)
			{
				tileSet = tSet;
				correctedIndex -= tSet.firstgid;
				break;
			}
		}
	}
	if(tileSet === undefined) return undefined;
	
	return {tileSet, correctedIndex};
}

function GetLayerIndexByName(layers, name)
{
	if(layers === undefined || name === undefined) return undefined;
	
	var layer = -1;
	for(var i = 0; i < layers.length; ++i)
	{
		if(layers[i].name === name)
		{
			layer = i;
			break;
		}
	}
	
	return layer;
}