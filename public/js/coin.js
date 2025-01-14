(function() {
  if (typeof Mario === 'undefined')
  window.Mario = {};

  var Coin = Mario.Coin = function(pos, sprite) {
    Mario.Entity.call(this, {
      pos: pos,
      sprite: sprite,
      hitbox: [0,0,16,16]
    });
    this.idx = level.items.length
  }

  Mario.Util.inherits(Coin, Mario.Entity);

  Coin.prototype.isPlayerCollided = function() {
    var hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    var hpos2 = [player.pos[0] + player.hitbox[0], player.pos[1] + player.hitbox[1]];

    if (!(hpos1[0] > hpos2[0]+player.hitbox[2] || (hpos1[0]+this.hitbox[2] < hpos2[0]))) {
      if (!(hpos1[1] > hpos2[1]+player.hitbox[3] || (hpos1[1]+this.hitbox[3] < hpos2[1]))) {
        this.collect();
      }
    }
  }

  Coin.prototype.render = function(ctx, vX, vY) {
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  }

  Coin.prototype.update = function(dt) {
    this.sprite.update(dt);
  }

  Coin.prototype.checkCollisions = function() {
    this.isPlayerCollided();
  }

  Coin.prototype.collect = function() {
    sounds.coin.currentTime = 0.05;
    sounds.coin.play();
    player.coins += 1;
    score += 10; // Increment score when coin is collected
    delete level.items[this.idx];
  }

  // Render the score on the screen
  function renderScore(ctx) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
  }

  // Call renderScore in your game loop
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    level.render(ctx);
    player.render(ctx);
    renderScore(ctx); // Draw score
    requestAnimationFrame(gameLoop);
  }

  // Start the game loop
  gameLoop();
})();
