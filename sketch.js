let drone;
let tiros = [];
let lagartas = [];
let particulas = [];
let score = 0;
let vidas = 5;
let gameOver = false;

function setup() {
  createCanvas(900, 550);
  drone = new Drone();
}

function draw() {
  desenharCenario();

  if (gameOver) {
    telaGameOver();
    return;
  }

  if (frameCount % 50 == 0) {
    lagartas.push(new Lagarta());
  }

  drone.update();
  drone.show();

  for (let i = tiros.length - 1; i >= 0; i--) {
    tiros[i].update();
    tiros[i].show();

    if (tiros[i].y < -20) {
      tiros.splice(i, 1);
      continue;
    }
  }

  for (let i = lagartas.length - 1; i >= 0; i--) {
    let l = lagartas[i];

    l.update();
    l.show();

    if (l.y > height - 70) {
      vidas--;
      lagartas.splice(i, 1);

      if (vidas <= 0) {
        gameOver = true;
      }

      continue;
    }

    for (let j = tiros.length - 1; j >= 0; j--) {
      if (dist(l.x, l.y, tiros[j].x, tiros[j].y) < 25) {

        for (let k = 0; k < 12; k++) {
          particulas.push(new Particula(l.x, l.y));
        }

        lagartas.splice(i, 1);
        tiros.splice(j, 1);
        score += 10;
        break;
      }
    }
  }

  for (let i = particulas.length - 1; i >= 0; i--) {
    particulas[i].update();
    particulas[i].show();

    if (particulas[i].vida <= 0) {
      particulas.splice(i, 1);
    }
  }

  desenharHUD();
}

function keyPressed() {
  if (key === ' ') {
    tiros.push(new Tiro(drone.x, drone.y - 25));
  }

  if (gameOver && key === 'r') {
    reiniciar();
  }
}

function reiniciar() {
  score = 0;
  vidas = 5;
  tiros = [];
  lagartas = [];
  particulas = [];
  gameOver = false;
}

function desenharCenario() {

  background(135, 206, 235);

  noStroke();

  fill(255, 255, 255, 180);
  ellipse(150, 90, 120, 60);
  ellipse(180, 80, 100, 60);

  ellipse(700, 120, 130, 70);
  ellipse(740, 110, 90, 60);

  fill(70, 180, 75);
  rect(0, height - 80, width, 80);

  for (let x = 30; x < width; x += 50) {

    stroke(20, 120, 20);
    strokeWeight(3);

    line(x, height - 80, x, height - 110);

    noStroke();
    fill(40, 180, 40);

    ellipse(x - 6, height - 100, 10);
    ellipse(x + 6, height - 95, 10);
    ellipse(x, height - 110, 12);
  }
}

function desenharHUD() {

  fill(0);
  textSize(24);
  text("Pontos: " + score, 20, 35);

  fill(220, 30, 30);
  text("Vidas: " + vidas, 20, 70);
}

function telaGameOver() {

  fill(0, 180);
  rect(0, 0, width, height);

  textAlign(CENTER);

  fill(255);
  textSize(60);
  text("GAME OVER", width / 2, height / 2 - 40);

  textSize(30);
  text("Pontuação: " + score, width / 2, height / 2 + 20);

  textSize(22);
  text("Pressione R para reiniciar", width / 2, height / 2 + 80);

  textAlign(LEFT);
}

class Drone {

  constructor() {
    this.x = width / 2;
    this.y = height - 130;
    this.speed = 7;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;

    this.x = constrain(this.x, 40, width - 40);
  }

  show() {

    push();

    translate(this.x, this.y);

    fill(90);
    rectMode(CENTER);
    rect(0, 0, 70, 25, 8);

    fill(150);
    ellipse(-35, 0, 20);
    ellipse(35, 0, 20);

    stroke(60);
    strokeWeight(3);

    line(-35, 0, -50, -12);
    line(35, 0, 50, -12);

    noStroke();

    fill(30);
    ellipse(-50, -12, 25, 6);
    ellipse(50, -12, 25, 6);

    fill(0, 180, 255);
    rect(0, -5, 20, 10, 3);

    pop();
  }
}

class Tiro {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.y -= 10;
  }

  show() {

    fill(255, 220, 0);
    noStroke();

    ellipse(this.x, this.y, 8);
    ellipse(this.x, this.y + 5, 5);
  }
}

class Lagarta {

  constructor() {

    this.x = random(40, width - 40);
    this.y = -20;

    this.speed = random(1.5, 3);

    this.anim = random(TWO_PI);
  }

  update() {

    this.y += this.speed;
    this.x += sin(frameCount * 0.08 + this.anim) * 1.2;
  }

  show() {

    noStroke();

    for (let i = 0; i < 5; i++) {

      fill(50, 190, 50);

      ellipse(
        this.x,
        this.y + i * 10,
        20 - i,
        18 - i
      );
    }

    fill(20);
    ellipse(this.x - 3, this.y - 3, 3);
    ellipse(this.x + 3, this.y - 3, 3);
  }
}

class Particula {

  constructor(x, y) {

    this.x = x;
    this.y = y;

    this.vx = random(-3, 3);
    this.vy = random(-3, 3);

    this.vida = 255;
  }    

  update() {

    this.x += this.vx;
    this.y += this.vy;

    this.vida -= 6;
  }

  show() {

    noStroke();

    fill(255, 180, 0, this.vida);
    ellipse(this.x, this.y, 6);
  }
}