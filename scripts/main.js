/*
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d");
*/

const canvas = $("#canvas");
const context = canvas[0].getContext("2d");

const refreshRate = 1000 / 10;
setInterval(draw, refreshRate);

$(document).keydown(function(event) {
  const key = event.which

  if (!gameInProgress && [37, 38, 39, 40].includes(key)) {
    gameInProgress = true;
  }

  /* Only switch direction if not already moving in opposite direction */
  if (key === 37 && snake.xMove != 1) {
    /* Left arrow */
    snake.xMove = -1;
    snake.yMove = 0;
  } else if (key === 38 && snake.yMove != 1) {
    /* Up arrow */
    snake.yMove = -1;
    snake.xMove = 0;
  } else if (key === 39 && snake.xMove != -1) {
    /* Right arrow */
    snake.xMove = 1;
    snake.yMove = 0;
  } else if (key === 40 && snake.yMove != -1) {
    /* Down arrow */
    snake.yMove = 1;
    snake.xMove = 0;
  }
});


function draw() {
  if (gameInProgress) {
    /* Move snake */
    snake.x += snake.xMove * gridSize;
    snake.y += snake.yMove * gridSize;

    /* If snake exits canvas, wrap to opposite side */
    if (snake.x > canvasDimension - gridSize) {
      snake.x = 0;
    } else if (snake.x < 0) {
      snake.x = canvasDimension - gridSize;
    }
    if (snake.y > canvasDimension - gridSize) {
      snake.y = 0;
    } else if (snake.y < 0) {
      snake.y = canvasDimension - gridSize;
    }

    /* If snake eats tail, end game */
    snake.position.forEach(position => checkCollision(position, [snake.x, snake.y]));
    if (!gameInProgress) {
      alert("Game Over!")
    }

    /* If snake eats apple, increase length and add new apple */
    snake.position.unshift([snake.x, snake.y]);
    if (snake.x === apple.x && snake.y === apple.y) {
      apple = new Apple;
    } else {
      snake.position.pop();
    }
  }
    
  /* Draw background */
  context.fillStyle = "black";
  context.fillRect(0, 0, canvasDimension, canvasDimension);

  /* Draw snake */
  context.fillStyle = "green";
  snake.position.forEach(drawSnake);

  /* Draw apple */
  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, gridSize - 1, gridSize - 1);

}


let canvasDimension = canvas.width();
let gridSize = 10;


class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.position = [[x, y]];
    this.xMove = 0;
    this.yMove = 0;
  }
}

class Apple {
  constructor() {
    /* Create apple at random canvas location, rounded to nearest gridSize */
    this.x = Math.round(Math.random() * (canvasDimension - gridSize) / gridSize) * gridSize;
    this.y = Math.round(Math.random() * (canvasDimension - gridSize) / gridSize) * gridSize;
  }
}

let snake = new Snake(100, 100);
let apple = new Apple;
let gameInProgress = false;

function drawSnake(gridPosition) {
  context.fillRect(gridPosition[0], gridPosition[1], gridSize - 1, gridSize - 1);
}

function checkCollision(position1, position2) {
  if (position1[0] === position2[0] && position1[1] === position2[1]) {
    gameInProgress = false;
  }
}