const cells = document.querySelectorAll(".col");

const gridSize = 40;
let score = 0;

let board = "";

for (let y = gridSize; y > 0; y--) {
  board += '<div class="row">';
  for (let x = 0; x < gridSize; x++) {
    board += `<div class="col" data-x="${x + 1}" data-y="${y}"></div>`;
  }
  board += "</div>";
}

// Create grid
const el = document.querySelector("#main");
el.innerHTML = board;
el.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

const rand = () => Math.floor(Math.random() * gridSize);
const randFood = () => Math.floor(Math.random() * 5);

let jumpsTillFood = randFood();
let food;
let direction = "up";
let snake = [
  [1, 1],
  [1, 2],
  [1, 3],
];

let removedPiece;

const increment = (current) => {
  if (current === gridSize) {
    return 1;
  }
  return current + 1;
};

const decrement = (current) => {
  if (current === 1) {
    return gridSize;
  }
  return current - 1;
};

const getCell = (x, y) =>
  document.querySelector(`[data-x="${x}"][data-y="${y}"]`);

const paint = () => {
  document
    .querySelectorAll(".active")
    .forEach((el) => el.classList.remove("active"));

  snake.forEach(([x, y]) => {
    getCell(x, y).classList.add("active");
  });
};

const spawnFood = () => {
  valid = false;
  let randX;
  let randY;
  while (!valid || randX === 0 || randY === 0) {
    randX = rand();
    randY = rand();

    valid = snake.every(([x, y]) => x !== randX && y !== randY);
  }

  getCell(randX, randY)?.classList.add("food");
  food = [randX, randY];
};

const detectCollision = () => {
  if (food) {
    // eat food
    let eaten = false;
    snake.forEach(([sX, sY]) => {
      if (food[0] === sX && food[1] === sY) {
        eaten = true;
      }
    });

    if (eaten) {
      snake.push(removedPiece);
      food = null;
      jumpsTillFood = randFood();
      score += 1

      document
        .querySelectorAll(".food")
        .forEach((item) => item.classList.remove("food"));
    }
  }

  // Death
  const snakeCopy = [...snake].map(item => JSON.stringify(item))
  let dead = false;
  let checking;
  while (snakeCopy.length > 1) {
    checking = snakeCopy[0]

    snakeCopy.shift()

    if (snakeCopy.includes(checking)) {
      dead = true
      break;
    }
  }

  if (dead) {
    alert(`You scored ${score}`)
  }
};

const move = () => {
  let newSnake = [];
  removedPiece = snake.pop();

  const [headX, headY] = snake[0];

  switch (direction) {
    case "up":
      newSnake = [[headX, increment(headY)], ...snake];
      break;
    case "down":
      newSnake = [[headX, decrement(headY)], ...snake];
      break;
    case "left":
      newSnake = [[decrement(headX), headY], ...snake];
      break;
    case "right":
      newSnake = [[increment(headX), headY], ...snake];
      break;
  }

  snake = newSnake;

  if (jumpsTillFood === 0 && !food) {
    spawnFood();
  } else if (!food) {
    jumpsTillFood -= 1;
  }

  detectCollision();

  paint();

  document.querySelector('#score').innerHTML = score
};

const handleKeyDown = (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction !== "down") {
        direction = "up";
      }
      break;
    case "ArrowDown":
      if (direction !== "up") {
        direction = "down";
      }
      break;
    case "ArrowLeft":
      if (direction !== "right") {
        direction = "left";
      }
      break;
    case "ArrowRight":
      if (direction !== "left") {
        direction = "right";
      }
      break;
  }
};

document.addEventListener("keydown", handleKeyDown);

setInterval(move, 300);
