(function() {
  if (typeof Mario === 'undefined')
    window.Mario = {};

  var Sprite = Mario.Sprite = function(img, pos, size, speed, frames, once) {
    this.pos = pos;
    this.size = size;
    this.speed = speed;
    this._index = 0;
    this.img = img;
    this.once = once;
    this.frames = frames;
    
    // Simplified pixel handling - remove pixel ratio calculations
    // that can cause subpixel rendering issues
    this.scale = 1;
  }

  Sprite.prototype.update = function(dt, gameTime) {
    if (gameTime && gameTime == this.lastUpdated) return;
    this._index += this.speed * dt;
    if (gameTime) this.lastUpdated = gameTime;
  }

  Sprite.prototype.setFrame = function(frame) {
    this._index = frame;
  }

  Sprite.prototype.render = function(ctx, posx, posy, vX, vY) {
    var frame;

    if (this.speed > 0) {
      var max = this.frames.length;
      var idx = Math.floor(this._index);
      frame = this.frames[idx % max];

      if (this.once && idx >= max) {
        this.done = true;
        return;
      }
    } else {
      frame = 0;
    }

    // Calculate source rectangle
    var srcX = this.pos[0] + (frame * this.size[0]);
    var srcY = this.pos[1];
    
    // Simplified position calculation - use floor to ensure pixel alignment
    var destX = Math.floor(posx - vX);
    var destY = Math.floor(posy - vY);

    // Ensure we're drawing at exact pixel boundaries
    ctx.imageSmoothingEnabled = false;
    
    // Draw the sprite with exact pixel alignment
    ctx.drawImage(
      resources.get(this.img),
      Math.floor(srcX), Math.floor(srcY),        // Source position
      this.size[0], this.size[1],                // Source size
      destX, destY,                              // Destination position
      Math.ceil(this.size[0]), Math.ceil(this.size[1])  // Destination size
    );
    
    ctx.imageSmoothingEnabled = true;
  }
})();