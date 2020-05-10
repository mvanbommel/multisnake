const canvas = $("#canvas");
const context = canvas[0].getContext("2d");

const refreshRate = 1000 / 10;
let drawIntervalID = setInterval(draw, refreshRate);

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

      snake.lastX = snake.x;
      snake.lastY = snake.y;

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

            let newAppleColor = "green";
            if (apple.color === "green") {
              newAppleColor = "white";
            } 

            apples[i] = new Apple(newAppleColor);
          } else {
            gameInProgress = false;
          }
        }
      }
    }

    /* Check if any apple is consumed */
    let anyAppleConsumed = snakes.map(snake => snake.appleConsumed).some(x => x === true);
    if (!anyAppleConsumed) {
      /* Remove ends of snake tails, which the snakes have left */
      snakes.forEach(snake => snake.position.pop());
    }

    /* Check for collisions */
    for (let snakeIndex = 0; snakeIndex < snakes.length; snakeIndex ++) {
      /* debugger; */
      let snake = snakes[snakeIndex];

      for (let otherSnakeIndex = snakeIndex; otherSnakeIndex < snakes.length; otherSnakeIndex ++) {
        let otherSnake = snakes[otherSnakeIndex];
        
        if (snakeIndex === otherSnakeIndex) {
          if (snake.length > 3) {
            /* Snake will never collide with its own 3 first positions */
            /* This prevents false collisions from rapid key strokes */
            snake.position.slice(3, snake.length).forEach(position => checkCollision(position, [snake.x, snake.y]));
          }
        } else {
          /* Check if any part of otherSnake collides with head of snake */
          otherSnake.position.forEach(position => checkCollision(position, [snake.x, snake.y]));

          /* Check head on collisions separately in case the order of snake movements lets it be missed in first check */
          /* Snakes move to same spot */
          checkCollision([otherSnake.x, otherSnake.y], [snake.x, snake.y])
          /* Snakes switch positions */
          if (snake.x === otherSnake.lastX && snake.y === otherSnake.lastY && snake.lastX === otherSnake.x && snake.lastY === otherSnake.y) {
            gameInProgress = false;
          }
        }
      }

      /* Complete snake movement */
      snake.position.unshift([snake.x, snake.y]);

    }
          
    if (!gameInProgress) {
      alert("Game Over!")
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
    context.fillStyle = "red";
    context.fillRect(apple.x + 2, apple.y + 2, gridSize - 5, gridSize - 5);
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
    this.lastX = x;
    this.lastY = y;
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

/* Offset snake x and y values to avoid any apple spots that would force collision */
let snake1 = new Snake("green", 120, 120);
let snake2 = new Snake("white", 130, 380, -1, -1);
let snake3 = new Snake("green", 380, 390);
let snake4 = new Snake("white", 390, 130, -1, -1);
let snakes = [snake1, snake2, snake3, snake4];

let apple1 = new Apple("green");
let apples = [apple1];

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