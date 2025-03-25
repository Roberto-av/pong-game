let ball, leftPaddle, rightPaddle;
let leftScore = 0, rightScore = 0;
let maxScore = 10;
let gameEnded = false; 

function setup() {
  createCanvas(800, 400);
  ball = new Ball();
  leftPaddle = new Paddle(20);
  rightPaddle = new Paddle(width - 30);
}

function draw() {
  background(30, 30, 30, 100); 

  // Mostrar puntuación
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(leftScore, width / 4, 50);
  text(rightScore, (3 * width) / 4, 50);

  // Dibujar y actualizar objetos
  ball.update();
  ball.show();
  leftPaddle.update();
  rightPaddle.update();
  leftPaddle.show();
  rightPaddle.show();

  // Colisiones con las paletas
  ball.checkPaddleCollision(leftPaddle);
  ball.checkPaddleCollision(rightPaddle);

  // Verificar puntuación
  if (ball.x < 0) {
    rightScore++;
    ball.reset();
  } else if (ball.x > width) {
    leftScore++;
    ball.reset();
  }

  // Verificar ganador
  if (leftScore >= maxScore || rightScore >= maxScore) {
    gameEnded = true; 
    textSize(48);
    text("¡Juego terminado!", width / 2, height / 2);
    textSize(24);
    text("Haz clic para volver a jugar", width / 2, height / 2 + 50);
    noLoop();
  }
}

function mousePressed() {
  if (gameEnded) {
    resetGame(); 
  }
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  gameEnded = false;
  ball.reset();
  loop();
}

function keyPressed() {
  if (!gameEnded) { 
    if (key === 'W' || key === 'w') leftPaddle.moveUp();
    if (key === 'S' || key === 's') leftPaddle.moveDown();
    if (keyCode === UP_ARROW) rightPaddle.moveUp();
    if (keyCode === DOWN_ARROW) rightPaddle.moveDown();
  }
}

function keyReleased() {
  if (!gameEnded) {
    if (key === 'W' || key === 'w' || key === 'S' || key === 's') leftPaddle.stop();
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) rightPaddle.stop();
  }
}

class Ball {
  constructor() {
    this.size = 15;
    this.colors = [
      color(255, 100, 100),
      color(100, 255, 100),
      color(100, 100, 255),
      color(255, 255, 100),
      color(255, 100, 255),
    ];
    this.currentColor = this.colors[int(random(this.colors.length))];
    this.reset();
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.speedX = random([-4, 4]);
    this.speedY = random([-3, 3]);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Rebote en bordes superior e inferior
    if (this.y <= 0 || this.y >= height) {
      this.speedY *= -1;
      this.changeColor();
    }
  }

  show() {
    fill(this.currentColor);
    ellipse(this.x, this.y, this.size);
  }

  checkPaddleCollision(paddle) {
    if (
      this.x - this.size / 2 < paddle.x + paddle.width &&
      this.x + this.size / 2 > paddle.x &&
      this.y > paddle.y &&
      this.y < paddle.y + paddle.height
    ) {
      this.speedX *= -1.1; // Aumenta la velocidad en el rebote
      this.speedY *= 1.1; // Aumenta la velocidad en el rebote
      this.changeColor();
    }
  }

  changeColor() {
    this.currentColor = this.colors[int(random(this.colors.length))];
  }
}

class Paddle {
  constructor(x) {
    this.x = x;
    this.y = height / 2 - 40;
    this.width = 10;
    this.height = 80;
    this.speed = 5;
    this.ySpeed = 0;
  }

  update() {
    this.y += this.ySpeed; // Mueve la paleta suavemente
    this.y = constrain(this.y, 0, height - this.height); // Limita el movimiento dentro de la pantalla
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }

  moveUp() {
    this.ySpeed = -this.speed;
  }

  moveDown() {
    this.ySpeed = this.speed;
  }

  stop() {
    this.ySpeed = 0;
  }
}
