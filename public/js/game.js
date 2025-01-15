var requestAnimFrame = (function(){
  return window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback){
      window.setTimeout(callback, 1000 / 60);
    };
})();

var dialog;

let score = 0;
const COIN_POINTS = 10;

var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');

canvas.style.imageRendering = "pixelated";
canvas.style.imageRendering = "-moz-crisp-edges";
canvas.style.imageRendering = "-webkit-crisp-edges";
var updateables = [];
var fireballs = [];
var player = new Mario.Player([0,0]);

canvas.width = 1750;
canvas.height = 750;
ctx.scale(3,3);
document.body.appendChild(canvas);

var vX = 0,
    vY = 0,
    vWidth = 256,
    vHeight = 240;

resources.load([
  'sprites/player.png',
  'sprites/enemy.png',
  'sprites/tiles.png',
  'sprites/playerl.png',
  'sprites/items.png',
  'sprites/enemyr.png',
]);

resources.onReady(init);
var level;
var sounds;
var music;

var lastTime;
function init() {
  music = {
    overworld: { play: function(){}, pause: function(){} },
    underground: { play: function(){}, pause: function(){} },
    clear: { play: function(){}, pause: function(){} },
    death: { play: function(){}, pause: function(){} }
  };
  
  sounds = {
    smallJump: new Audio('sounds/jump-small.wav'),
    bigJump: new Audio('sounds/jump-super.wav'),
    breakBlock: new Audio('sounds/breakblock.wav'),
    bump: new Audio('sounds/bump.wav'),
    coin: new Audio('sounds/coin.wav'),
    fireball: new Audio('sounds/fireball.wav'),
    flagpole: new Audio('sounds/flagpole.wav'),
    kick: new Audio('sounds/kick.wav'),
    pipe: new Audio('sounds/pipe.wav'),
    itemAppear: new Audio('sounds/itemAppear.wav'),
    powerup: new Audio('sounds/powerup.wav'),
    stomp: new Audio('sounds/stomp.wav')
  };


  Mario.oneone();
  lastTime = Date.now();
  main();
}

var gameTime = 0;

function main() {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;

  update(dt);
  render();

  lastTime = now;
  requestAnimFrame(main);
}

function update(dt) {
  gameTime += dt;

  handleInput(dt);
  updateEntities(dt, gameTime);
  checkCollisions();
}

function handleInput(dt) {
  if (player.piping || player.dying || player.noInput) return; //don't accept input

  if (input.isDown('RUN')){
    player.run();
  } else {
    player.noRun();
  }
  if (input.isDown('JUMP')) {
    player.jump();
  } else {
    player.noJump();
  }

  if (input.isDown('DOWN')) {
    player.crouch();
  } else {
    player.noCrouch();
  }

  if (input.isDown('LEFT')) {
    player.moveLeft();
  }
  else if (input.isDown('RIGHT')) {
    player.moveRight();
  } else {
    player.noWalk();
  }
}

var input = {
  pressedKeys: {},
  
  pressKey: function(key) {
      this.pressedKeys[key] = true;
  },
  
  releaseKey: function(key) {
      delete this.pressedKeys[key];
  },
  
  isDown: function(key) {
      return this.pressedKeys[key];
  }
};

var keyMap = {
  37: 'LEFT',    // Left arrow
  39: 'RIGHT',   // Right arrow
  38: 'JUMP',    // Up arrow
  32: 'JUMP',    // Space
  88: 'JUMP',    // X
  90: 'RUN',     // Z
  16: 'RUN'      // Shift
};

// Add this to your game.js

// Tilt control configuration
const TILT_CONTROLS = {
  enabled: false,
  sensitivity: 3.5,
  deadzone: 1, // Minimum tilt angle to respond to
  calibration: {
      x: 0,
      y: 0,
      z: 0
  }
};

// Function to calibrate the initial position
function calibrateTiltControls() {
  window.addEventListener('deviceorientation', function(e) {
      TILT_CONTROLS.calibration.x = e.beta;  // Forward/back tilt
      TILT_CONTROLS.calibration.y = e.gamma; // Left/right tilt
      TILT_CONTROLS.enabled = true;
  }, { once: true });
}

// Handle device orientation
function handleTiltControls(e) {
  if (!TILT_CONTROLS.enabled) return;

  // Get tilt angles
  let forwardTilt = e.beta - TILT_CONTROLS.calibration.x;  // Forward/back tilt
  let sideTilt = e.gamma - TILT_CONTROLS.calibration.y;    // Left/right tilt

  // Apply deadzone
  if (Math.abs(sideTilt) < TILT_CONTROLS.deadzone) {
      sideTilt = 0;
  }

  // Handle left/right movement
  if (sideTilt > TILT_CONTROLS.deadzone) {
      input.pressKey('RIGHT');
      input.releaseKey('LEFT');
  } else if (sideTilt < -TILT_CONTROLS.deadzone) {
      input.pressKey('LEFT');
      input.releaseKey('RIGHT');
  } else {
      input.releaseKey('LEFT');
      input.releaseKey('RIGHT');
  }

  // Handle jump with forward tilt
  if (forwardTilt < -TILT_CONTROLS.deadzone) {
      input.pressKey('JUMP');
  } else {
      input.releaseKey('JUMP');
  }
}

function addTiltControlToggle() {
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '📱 Tilt Controls';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.top = '10px';
  toggleBtn.style.right = '10px';
  toggleBtn.style.padding = '10px';
  toggleBtn.style.zIndex = '1000';
  toggleBtn.style.border = 'none';
  toggleBtn.style.borderRadius = '5px';
  toggleBtn.style.cursor = 'pointer';

  toggleBtn.addEventListener('click', function() {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof DeviceOrientationEvent.requestPermission === 'function') {
          // iOS 13+ requires permission
          DeviceOrientationEvent.requestPermission()
              .then(permissionState => {
                  if (permissionState === 'granted') {
                      enableTiltControls();
                  }
              })
              .catch(console.error);
      } else {
          // Other devices
          enableTiltControls();
      }
  });

  document.body.appendChild(toggleBtn);
}

function enableTiltControls() {
  // First calibrate the initial position
  calibrateTiltControls();
  window.addEventListener('deviceorientation', handleTiltControls);
  let lastX = 0;
  let lastY = 0;
  const FILTER_FACTOR = 0.2;
  TILT_CONTROLS.sensitivity = 2.5; // Increase or decrease this value
  TILT_CONTROLS.deadzone = 3; // Increase or decrease this value


  window.addEventListener('deviceorientation', function(e) {
      // Smooth out the values
      lastX = lastX * (1 - FILTER_FACTOR) + e.gamma * FILTER_FACTOR;
      lastY = lastY * (1 - FILTER_FACTOR) + e.beta * FILTER_FACTOR;
      
      handleTiltControls({
          gamma: lastX,
          beta: lastY
      });
  });
}

if (window.DeviceOrientationEvent) {
  if ('ontouchstart' in window) {
      addTiltControlToggle();
  }
}

var input = {
  pressedKeys: {},
  tiltEnabled: false,
  
  pressKey: function(key) {
      this.pressedKeys[key] = true;
  },
  
  releaseKey: function(key) {
      delete this.pressedKeys[key];
  },
  
  isDown: function(key) {
      return this.pressedKeys[key];
  },

  enableTiltControls: function() {
      this.tiltEnabled = true;
      calibrateTiltControls();
  },

  disableTiltControls: function() {
      this.tiltEnabled = false;
      window.removeEventListener('deviceorientation', handleTiltControls);
  }
};

const style = document.createElement('style');
style.textContent = `
  @media (orientation: portrait) {
      .tilt-toggle {
          top: 20px !important;
      }
  }
  @media (orientation: landscape) {
      .tilt-toggle {
          top: 10px !important;
          transform: scale(0.8);
      }
  }
`;
document.head.appendChild(style);

document.addEventListener('keydown', function(event) {
  var key = keyMap[event.keyCode];
  if (key) {
      event.preventDefault();
      input.pressKey(key);
  }
});

document.addEventListener('keyup', function(event) {
  var key = keyMap[event.keyCode];
  if (key) {
      event.preventDefault();
      input.releaseKey(key);
  }
});


function updateEntities(dt, gameTime) {
  player.update(dt, vX);
  updateables.forEach(function(ent) {
    ent.update(dt, gameTime);
  });

  if (player.exiting) {
    if (player.pos[0] > vX + 96)
      vX = player.pos[0] - 96;
  } else if (level.scrolling && player.pos[0] > vX + 80) {
    vX = player.pos[0] - 80;
  }

  if (player.powering.length !== 0 || player.dying) { return; }
  
  level.items.forEach(function(ent) {
    ent.update(dt);
  });

  level.enemies.forEach(function(ent) {
    ent.update(dt, vX);
  });

  
  level.pipes.forEach(function(pipe) {
    pipe.update(dt);
  });
}

function checkCollisions() {
  if (player.powering.length !== 0 || player.dying) { return; }
  player.checkCollisions();

  level.items.forEach(function(item) {
    item.checkCollisions();
    // If this is a coin and it's being collected, call updateScore
    if (item.isCoin && item.isCollected) {  // adjust these property names based on your implementation
        updateScore();
    }
});
  level.enemies.forEach(function(ent) {
    ent.checkCollisions();
  });
  
  
  level.pipes.forEach(function(pipe) {
    pipe.checkCollisions();
  });
}

function render() {
  updateables = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = level.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for(var i = 0; i < 15; i++) {
    for (var j = Math.floor(vX / 16) - 1; j < Math.floor(vX / 16) + 50; j++){
      if (level.scenery[i][j]) {
        renderEntity(level.scenery[i][j]);
      }
    }
  }

  // Render items
  level.items.forEach(function(item) {
    renderEntity(item);
  });

  // Render enemies
  level.enemies.forEach(function(enemy) {
    renderEntity(enemy);
  });

  // Render fireballs
  fireballs.forEach(function(fireball) {
    renderEntity(fireball);
  });

  // Render static objects and blocks
  for(var i = 0; i < 15; i++) {
    for (var j = Math.floor(vX / 16) - 1; j < Math.floor(vX / 16) + 50; j++){
      if (level.statics[i][j]) {
        renderEntity(level.statics[i][j]);
      }
      if (level.blocks[i][j]) {
        renderEntity(level.blocks[i][j]);
        updateables.push(level.blocks[i][j]);
      }
    }
  }

  if (player.invincibility % 2 === 0) {
    renderEntity(player);
  }

  // Render pipes
  level.pipes.forEach(function(pipe) {
    renderEntity(pipe);
  });

  // Render dialog if active
  if (dialog && dialog.active) {
    dialog.draw(ctx);
  }
}

function renderEntity(entity) {
  entity.render(ctx, vX, vY);
}


document.addEventListener('keydown', function(e) {
  if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen();
  }
});

function addTouchControls() {
  var touchControls = document.createElement('div');
  touchControls.id = 'touch-controls';
  touchControls.style.position = 'absolute';
  touchControls.style.bottom = '30px';
  touchControls.style.left = '20px';
  touchControls.style.right = '20px';
  touchControls.style.display = 'flex';
  touchControls.style.justifyContent = 'space-between';
  touchControls.style.zIndex = '1000';
  touchControls.style.marginTop = '50px';
  var leftBtn = createTouchButton('←');
  var rightBtn = createTouchButton('→');
  var jumpBtn = createTouchButton('↑');
  
  leftBtn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      input.pressKey('LEFT');
  });
  leftBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      input.releaseKey('LEFT');
  });

  rightBtn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      input.pressKey('RIGHT');
  });
  rightBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      input.releaseKey('RIGHT');
  });

  jumpBtn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      input.pressKey('JUMP');
  });
  jumpBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      input.releaseKey('JUMP');
  });

  touchControls.appendChild(leftBtn);
  touchControls.appendChild(rightBtn);
  touchControls.appendChild(jumpBtn);

  document.body.appendChild(touchControls);
}

function addScoreDisplay() {
  const scoreDisplay = document.createElement('div');
  scoreDisplay.id = 'score';
  scoreDisplay.textContent = 'Score: 0';
  scoreDisplay.style.position = 'fixed';
  scoreDisplay.style.top = '20px';
  scoreDisplay.style.left = '20px';
  scoreDisplay.style.color = '#fff';
  scoreDisplay.style.fontSize = '24px';
  scoreDisplay.style.fontWeight = 'bold';
  scoreDisplay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
  scoreDisplay.style.zIndex = '1000';
  document.body.appendChild(scoreDisplay);
}

  
function updateScore() {
  score += COIN_POINTS;
  const scoreDisplay = document.getElementById('score');
  if (scoreDisplay) {
      scoreDisplay.textContent = `Score: ${score}`;
  }
}

function createTouchButton(text) {
  var button = document.createElement('button');
  button.textContent = text;
  button.style.padding = '10px';
  button.style.margin = '5px';
  button.style.backgroundColor = 'rgba(255, 255, 255, 0.66)';
  button.style.border = 'none';
  button.style.borderRadius = '50%';
  button.style.width = '60px';
  button.style.height = '60px';
  button.style.fontSize = '20px';
  return button;
}

if ('ontouchstart' in window) {
  addTouchControls();
}