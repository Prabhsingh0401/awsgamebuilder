(function () {
  if (typeof Mario === 'undefined') window.Mario = {};

  var blockFacts = [
    "The Indian Constitution is the longest written constitution in the world, with 448 articles across 25 parts.",
    "It took the Constituent Assembly almost 3 years (2 years, 11 months, and 18 days) to draft the Indian Constitution.",
    "Dr. B.R. Ambedkar is considered the 'Father of the Indian Constitution' for his pivotal role in its drafting.",
    "The Constitution was handwritten by Prem Behari Narain Raizada in both Hindi and English.",
    "The Indian Constitution came into effect on January 26, 1950, a date chosen to honor the Purna Swaraj resolution of 1930.",
    "The original handwritten copies of the Constitution are preserved in helium-filled cases in the Parliament Library.",
    "The Indian Constitution incorporates elements from the constitutions of various countries, including the U.S., U.K., and Ireland.",
    "The Preamble of the Constitution begins with the words 'We, the people of India,' signifying its democratic foundation."
  ];
  

  // Block Constructor
  var Block = (Mario.Block = function (options) {
    this.item = options.item;
    this.usedSprite = options.usedSprite;
    this.bounceSprite = options.bounceSprite;
    this.breakable = options.breakable;
    this.dialog = options.dialog;

    Mario.Entity.call(this, {
      pos: options.pos,
      sprite: options.sprite,
      hitbox: [0, 0, 16, 16],
    });

    this.standing = true;
  });

  Mario.Util.inherits(Block, Mario.Floor);

  // Block breaking logic
  Block.prototype.break = function () {
    if (!this.breakable) return;

    sounds.breakBlock.play();
    new Mario.Rubble().spawn(this.pos);

    // Show styled dialog box with a random fact
    if (dialog && typeof dialog.show === "function") {
      var fact = blockFacts[Math.floor(Math.random() * blockFacts.length)];
      dialog.show(fact, {
        x: this.pos[0],
        y: this.pos[1] - 20,
        duration: 2000, // Dialog visible for 2 seconds
      });
    }

    var x = this.pos[0] / 16,
      y = this.pos[1] / 16;
    delete level.blocks[y][x];
  };

  // Block bouncing logic when hit
  Block.prototype.bonk = function (power) {
    sounds.bump.play();
    if (power > 0 && this.breakable) {
      this.break();
    } else if (this.standing) {
      this.standing = false;
      if (this.item) {
        this.item.spawn();
        this.item = null;
      }
      this.opos = [];
      this.opos[0] = this.pos[0];
      this.opos[1] = this.pos[1];
      if (this.bounceSprite) {
        this.osprite = this.sprite;
        this.sprite = this.bounceSprite;
      } else {
        this.sprite = this.usedSprite;
      }

      this.vel[1] = -2;
    }
  };

  // Update block state
  Block.prototype.update = function (dt, gameTime) {
    if (!this.standing) {
      if (this.pos[1] < this.opos[1] - 8) {
        this.vel[1] = 2;
      }
      if (this.pos[1] > this.opos[1]) {
        this.vel[1] = 0;
        this.pos = this.opos;
        if (this.osprite) {
          this.sprite = this.osprite;
        }
        this.standing = true;
      }
    } else {
      if (this.sprite === this.usedSprite) {
        var x = this.pos[0] / 16,
          y = this.pos[1] / 16;
        level.statics[y][x] = new Mario.Floor(this.pos, this.usedSprite);
        delete level.blocks[y][x];
      }
    }

    this.pos[1] += this.vel[1];
    this.sprite.update(dt, gameTime);
  };

// Dialog box handler
var dialog = {
  show: function (text, options) {
      var dialogBox = document.createElement("div");
      dialogBox.innerText = text;
      dialogBox.className = "dialog-box";

      // Position the dialog box in the center of viewport
      dialogBox.style.position = "fixed"; // Changed from absolute to fixed
      dialogBox.style.left = "50%";
      dialogBox.style.top = "20%";
      dialogBox.style.transform = "translate(-50%, -50%)";
      dialogBox.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      dialogBox.style.color = "white";
      dialogBox.style.padding = "20px";
      dialogBox.style.borderRadius = "8px";
      dialogBox.style.zIndex = "1000";
      dialogBox.style.maxWidth = "300px";
      dialogBox.style.textAlign = "center";

      // Append to the body instead of game container for viewport-relative positioning
      document.body.appendChild(dialogBox);

      // Remove dialog after the duration
      setTimeout(function () {
          document.body.removeChild(dialogBox);
      }, options.duration);
  }
};

})();
