const startText = document.getElementById("startText");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");
const player1ScoreElement = document.getElementById("player1Score");
const timerElement = document.getElementById("timer");
const lossSound = document.getElementById("lossSound");
const wallSound = document.getElementById("wallSound");
const paddleSound = document.getElementById("paddleSound");
const bgMusic = document.getElementById("bgMusic");

// Game Variables
let gameRunning = false;
let keysPressed = {};
let paddleSpeed = 0;
let paddle1Y = 150;
let paddle2Y = 150;
let ballX = 290;
let ballSpeedX = 2;
let ballY = 190;
let ballSpeedY = 2;
let player1Score = 0;
let gameTime = 0;

// Game Constants
const paddleAcceleration = 1;
const maxPaddleSpeed = 5;
const paddleDeceleration = 1;
const gameHeight = 400;
const gameWidth = 600;

// Event listener for keydown events
document.addEventListener("keydown", function (e) {
  if (e.key === " ") {
    // Check if space bar is pressed
    if (!gameRunning) {
      startGame();
    }
  }
});

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Touch events for mobile support
document.addEventListener("touchstart", function (e) {
  if (!gameRunning) {
    startGame();
  }
});

document.addEventListener("touchmove", function (e) {
  e.preventDefault(); // Prevent default touch behavior
  movePaddle1(e);
});

// Unmute audio on user interaction (e.g., click)
document.addEventListener("click", function () {
  bgMusic.muted = false;
  bgMusic.play();
});

function startGame() {
  gameRunning = true;
  startText.style.display = "none";
  gameTime = 0; // Reset game time
  updateTimer();
  gameLoop();
}

function gameLoop() {
  if (gameRunning) {
    updatePaddle();
    moveBall();
    setTimeout(gameLoop, 8);
  }
}

function handleKeyDown(e) {
  keysPressed[e.key] = true;
}

function handleKeyUp(e) {
  keysPressed[e.key] = false;
}

function movePaddle1(e) {
  const touchY = e.touches[0].clientY; // Get vertical position of touch relative to viewport
  const paddleHeight = paddle1.clientHeight;

  paddle1Y = Math.max(
    0,
    Math.min(touchY - paddleHeight / 2, gameHeight - paddleHeight)
  );

  paddle1.style.top = paddle1Y + "px";
}

function updatePaddle() {
  if (keysPressed["ArrowUp"]) {
    paddleSpeed = Math.max(paddleSpeed - paddleAcceleration, -maxPaddleSpeed);
  } else if (keysPressed["ArrowDown"]) {
    paddleSpeed = Math.min(paddleSpeed + paddleAcceleration, maxPaddleSpeed);
  } else {
    if (paddleSpeed > 0) {
      paddleSpeed = Math.max(paddleSpeed - paddleDeceleration, 0);
    } else if (paddleSpeed < 0) {
      paddleSpeed = Math.min(paddleSpeed + paddleDeceleration, 0);
    }
  }

  paddle1Y += paddleSpeed;

  if (paddle1Y < 0) {
    paddle1Y = 0;
  }

  if (paddle1Y > gameHeight - paddle1.clientHeight) {
    paddle1Y = gameHeight - paddle1.clientHeight;
  }
  paddle1.style.top = paddle1Y + "px";

  // Simple AI for paddle2
  paddle2Y += (ballY - (paddle2Y + paddle2.clientHeight / 2)) * 0.05;
  paddle2.style.top = paddle2Y + "px";
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Wall collision
  if (ballY >= gameHeight - ball.clientHeight || ballY <= 0) {
    ballSpeedY = -ballSpeedY;
    playSound(wallSound);
  }

  // Paddle 1 collision
  if (
    ballX <= paddle1.clientWidth &&
    ballY >= paddle1Y &&
    ballY <= paddle1Y + paddle1.clientHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(paddleSound);
    player1Score++;
    updateScoreboard();
  }

  // Paddle 2 collision
  if (
    ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth &&
    ballY >= paddle2Y &&
    ballY <= paddle2Y + paddle2.clientHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(paddleSound);
  }

  // Out of gameArea collision
  if (ballX <= 0 || ballX >= gameWidth - ball.clientWidth) {
    playSound(lossSound);
    resetBall();
    resetScoreboard();
    pauseGame();
  }

  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

function updateScoreboard() {
  player1ScoreElement.textContent = player1Score;
}

function resetScoreboard() {
  player1Score = 0;
  player1ScoreElement.textContent = player1Score;
}

function resetBall() {
  ballX = gameWidth / 2 - ball.clientWidth / 2;
  ballY = gameHeight / 2 - ball.clientHeight / 2;
  ballSpeedX = Math.random() > 0.5 ? 2 : -2;
  ballSpeedY = Math.random() > 0.5 ? 2 : -2;
}

function pauseGame() {
  gameRunning = false;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function updateTimer() {
  if (gameRunning) {
    gameTime++;
    timerElement.textContent = gameTime;
    setTimeout(updateTimer, 1000);
  }
}
