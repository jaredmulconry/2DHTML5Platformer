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
