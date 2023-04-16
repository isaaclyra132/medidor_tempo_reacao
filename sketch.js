let colors = ['red', 'blue', 'green', 'yellow', 'purple'];
let balls = [];
let score = 0;
let startTime = 0;
let reactionTimes = [];
let hits = [];
let gameState = "start";

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  
  if (gameState === "start") {
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Press any key to start", width/2, height/2);
  }
  else if (gameState === "playing") {
    if (balls.length < 5) {
      let color = random(colors);
      balls.push(new Ball(color));
      startTime = millis();
    }
    
    for (let i = balls.length-1; i >= 0; i--) {
      balls[i].update();
      balls[i].show();
      
      if (balls[i].isDone()) {
        if (!hits[i]) {
          reactionTimes.push(millis() - startTime);
          hits.push(false);
        }
        balls.splice(i, 1);
      }
    }
  }
  else if (gameState === "end") {
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", width/2, height/3);
    text("Score: " + score, width/2, height/2);
    let y = height/2 + 50;
    for (let i = 0; i < 5; i++) {
      if (reactionTimes[i]) {
        let result = hits[i] ? "hit" : "missed";
        let time = reactionTimes[i];
        text(result + " - " + time + "ms", width/2, y);
        y += 30;
      }
    }
    textSize(16);
    text("Press any key to try again", width/2, y + 50);
  }
}

function resetGame() {
  score = 0;
  reactionTimes = [];
  hits = [];
  gameState = "start";
}

function keyPressed() {
  if (gameState === "start") {
    gameState = "playing";
  }
  else if (gameState === "playing") {
    if (balls.length > 0) {
      let ball = balls[0];
      if (keyIsPressed && key === ball.color.charAt(0)) {
        score++;
        hits.push(true);
      }
      else {
        hits.push(false);
      }
      reactionTimes.push(millis() - startTime);
      balls.splice(0, 1);
    }
  }
  else if (gameState === "end") {
    resetGame();
  }
}

class Ball {
    constructor() {
      this.color = random(colors);
      this.radius = 30;
      this.x = random(this.radius, width - this.radius);
      this.y = random(this.radius, height - this.radius);
      this.clicked = false;
    }
  
    show() {
      fill(this.color);
      stroke(0);
      ellipse(this.x, this.y, this.radius * 2);
    }
  
    update() {
      if (!this.clicked) {
        if (millis() - startTime > 1000) {
          this.clicked = true;
        }
      } else {
        let index = balls.indexOf(this);
        if (index != -1) {
          balls.splice(index, 1);
        }
      }
    }
  }