const canvas = $("#canvas");
const context = canvas[0].getContext("2d");

const refreshRate = 1000 / 10;
setInterval(draw, refreshRate);

$(document).keydown(function(event) {
  if (keyPressResolved) {
    keyPressResolved = false;

    const key = event.which

    if (!gameInProgress && [37, 38, 39, 40].includes(key)) {
      gameInProgress = true;
    }

    for (let snakeIndex = 0; snakeIndex < snakes.length; snakeIndex ++) {
      let snake = snakes[snakeIndex];
      /* Only switch direction if not already moving along that plane */
      if (key === 37 && snake.xMove === 0) {
        /* Left arrow */
        snake.xMove = -1 * snake.xModifier;
        snake.yMove = 0;
      } else if (key === 38 && snake.yMove === 0) {
        /* Up arrow */
        snake.yMove = -1 * snake.yModifier;
        snake.xMove = 0;
      } else if (key === 39 && snake.xMove === 0) {
        /* Right arrow */
        snake.xMove = 1 * snake.xModifier;
        snake.yMove = 0;
      } else if (key === 40 && snake.yMove === 0) {
        /* Down arrow */
        snake.yMove = 1 * snake.yModifier;
        snake.xMove = 0;
      }
    }
  }
});


function draw() {
  /* Draw background */
  context.fillStyle = "black";
  context.fillRect(0, 0, canvasDimension, canvasDimension);

  if (gameInProgress) {
    /* Move snakes */
    for (let snakeIndex = 0; snakeIndex < snakes.length; snakeIndex ++) {
      let snake = snakes[snakeIndex];

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
    }

    /* Check if apples consumed */
    for (let snakeIndex = 0; snakeIndex < snakes.length; snakeIndex ++) {
      let snake = snakes[snakeIndex];

      snake.appleConsumed = false;
      for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (snake.x === apple.x && snake.y === apple.y) {
          if (snake.color === apple.color) {
            snake.appleConsumed = true;
            apples[i] = new Apple(apple.color);
          } else {
            gameInProgress = false;
          }
        }
      }

      if (!snake.appleConsumed) {
        /* Remove end of snake tail, which the snake has left */
        snake.position.pop();
      }
    }

    for (let snakeIndex = 0; snakeIndex < snakes.length; snakeIndex ++) {
      let snake = snakes[snakeIndex];

      for (let otherSnakeIndex = snakeIndex; otherSnakeIndex < snakes.length; otherSnakeIndex ++) {
        let otherSnake = snakes[otherSnakeIndex];
        
        if (snakeIndex === otherSnakeIndex) {
          if (snake.length > 3) {
            /* Snake will never collide with its 3 first positions */
            /* This prevents false collisions from rapid key strokes */
            snake.position.slice(3, snake.length).forEach(position => checkCollision(position, [snake.x, snake.y]));
          }
        } else {
          /* Check if any part of otherSnake collides with head of snake */
          otherSnake.position.forEach(position => checkCollision(position, [snake.x, snake.y]));
        }
      }

      /* Complete snake movement */
      snake.position.unshift([snake.x, snake.y]);
    }

          
    if (!gameInProgress) {
      alert("Game Over!")
      console.log(snakes);
      console.log(apples);
    }
  }

  /* Draw snakes */
  snakes.forEach(snake => {
    context.fillStyle = snake.color;
    snake.position.forEach(drawSnake);
  });
  

  /* Draw apples */
  apples.forEach(apple => {
    context.fillStyle = apple.color;
    context.fillRect(apple.x, apple.y, gridSize - 1, gridSize - 1);
  });

  keyPressResolved = true;

}



let canvasDimension = canvas.width();
let gridSize = 10;


class Snake {
  constructor(color, x, y, xModifier = 1, yModifier = 1) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.position = [[x, y]];
    this.xMove = 0;
    this.yMove = 0;
    this.xModifier = xModifier;
    this.yModifier = yModifier;
    this.appleConsumed = false;
  }

  get length() {
    return this.position.length;
  }
}

class Apple {
  constructor(color) {
    this.color = color;

    /* Create apple at random canvas location, rounded to nearest gridSize */
    this.x = Math.round(Math.random() * (canvasDimension - gridSize) / gridSize) * gridSize;
    this.y = Math.round(Math.random() * (canvasDimension - gridSize) / gridSize) * gridSize;
  }
}

let snake1 = new Snake("green", 100, 100);
let snake2 = new Snake("white", 400, 400, -1, -1);
let snakes = [snake1, snake2];

let apple1 = new Apple("green");
let apple2 = new Apple("white");
let apples = [apple1, apple2];

let gameInProgress = false;

let keyPressResolved = true;

function drawSnake(gridPosition) {
  context.fillRect(gridPosition[0], gridPosition[1], gridSize - 1, gridSize - 1);
}

function checkCollision(position1, position2) {
  if (position1[0] === position2[0] && position1[1] === position2[1]) {
    gameInProgress = false;
  }
}