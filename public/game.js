var requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
var canvas = document.getElementById("cv"),
  ctx = canvas.getContext("2d");
(scoreElm = document.getElementById("score")),
  (lifeElement = document.getElementById("lifeEle")),
  (msgElement = document.getElementById("msg")),
  (score = 0),
  (enemyArray = []),
  (enemyTimer = 1000),
  (eneymyWidth = 27),
  (enemyHeight = 27),
  (enemyIndex = 0),
  (width = 300),
  (height = 500),
  (lastTime = 0),
  (Player_life = 5),
  (collitionEnemyIndex = []),
  (boom_width = 25),
  (boom_height = 25),
  (boom_Array = []),
  (boom_Timer = 14),
  (boom_index = 0),
  (extra_enemy = false),
  (boss = null),
  (boss_50_flag = true),
  (boss_100_flag = true),
  (continuegame = true);

function enemy(x, y, dy, dx, img, width_enemy, height_enemy, rotation) {
  this.x = x;
  this.y = y;
  this.dy = dy;
  this.dx = dx;
  this.img = img;
  this.width = width_enemy;
  this.height = height_enemy;
  this.rotation = rotation;
  enemyIndex++;
  this.id = enemyIndex;
  enemyArray[enemyIndex] = this;
  if (this.rotation < 0.2 || this.rotation > 0.7) {
    this.dx = -this.dx;
  } else {
    this.dx = 0;
    this.dy = this.dy;
  }
  this.update = function () {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x + this.width >= width) {
      this.dx = -this.dx;
    } else if (this.x <= 0) {
      this.dx = Math.abs(this.dx);
    }
    if (this.y > height + this.height) {
      this.delete();
    }
    this.draw();
  };
  this.draw = function () {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
  this.delete = function () {
    delete enemyArray[this.id];
  };
}
function Boss(x, y, boosLife = 400) {
  this.x = x;
  this.y = y;
  this.width = 200;
  this.height = 100;
  this.boos_life = boosLife;
  this.img = new Image();
  this.speed = 0.5;
  this.img.src = "images/Boss.png";
  this.update = function () {
    this.y += this.speed;
    this.draw();
  };
  this.draw = function () {
    ctx.beginPath();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
}
function boom(x, y) {
  this.x = x;
  this.y = y;
  this.width = boom_width;
  this.height = boom_height;
  this.timer = boom_Timer;
  boom_index++;
  this.id = boom_index;
  this.img = new Image();
  this.img.src = "images/boom.png";
  boom_Array[boom_index] = this;
  this.update = function () {
    --this.timer;
    if (this.timer < 0) {
      this.delete();
    }
    this.draw();
  };
  this.draw = function () {
    ctx.beginPath();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
  this.delete = function () {
    delete boom_Array[this.id];
  };
}
function createEnemy() {
  let x = Math.random() * (width - eneymyWidth);
  let y = enemyHeight;
  let dy = 3;
  let dx = 3;
  let img = (enemy_img = new Image());
  if (extra_enemy) {
    let random = Math.random();
    if (random < 0.2 || random > 0.7) {
      y = enemyHeight = 40;
      eneymyWidth = 40;
      dy = 4;
      dx = 4;
      img.src = "images/battleShip.png";
    } else {
      enemyHeight = 27;
      eneymyWidth = 27;
      img.src = "images/enemy.png";
    }
  } else {
    enemyHeight = 27;
    eneymyWidth = 27;
    img.src = "images/enemy.png";
  }

  let rotation = Math.random();
  new enemy(x, y, dy, dx, img, eneymyWidth, enemyHeight, rotation);
}
class Game {
  constructor(canvas, width, height) {
    this.ctx = canvas.getContext("2d");
    this.height = height;
    this.width = width;
    canvas.height = height;
    canvas.width = width;
    this.player = new Player(this.ctx, this.width / 10, this.height / 20);
  }

  play(currentTime) {
    this.clear();
    this.createBorder();
    this.player.draw();
    this.checkState();
    if (currentTime >= lastTime + enemyTimer) {
      lastTime = currentTime;
      createEnemy();
    }
    enemyArray.forEach((obj) => {
      obj.update();
    });
    boom_Array.forEach((bo) => {
      bo.update();
    });
    if (boss) {
      boss.update();
    }
    if (this.checkCollapse()) {
      if (continuegame) {
        requestAnimationFrame(this.play.bind(this));
      } else {
        alert("Game Paused");
      }
    } else {
      alert("You lost!");
      reset();
      game.clear();
      enableRestart();
    }
  }

  checkState() {
    let conditions = this.player.getBorders();
    if (conditions.xMin < 0) this.player.x += this.player.speed + 1;
    if (conditions.xMax > this.width) this.player.x -= this.player.speed + 1;
    if (conditions.yMin < 0) this.player.y += this.player.speed + 1;
    if (conditions.yMax > this.height) this.player.y -= this.player.speed + 1;
  }
  checkCollapse() {
    let flag = true;
    enemyArray.forEach((a) => {
      if (
        !(
          this.player.y + this.player.height < a.y ||
          this.player.y > a.y + a.height ||
          this.player.x > a.x + a.width ||
          this.player.x + this.player.width < a.x
        )
      ) {
        let prevInd = collitionEnemyIndex.findIndex((b) => {
          return b === a.id;
        });
        if (prevInd == -1) {
          new boom(this.player.x, this.player.y);
          collitionEnemyIndex.push(a.id);
          flag = false;
          return 0;
        }
      }
    });
    if (!flag) {
      --Player_life;
    }
    if (boss) {
      if (
        !(
          this.player.y + this.player.height < boss.y ||
          this.player.y > boss.y + boss.height ||
          this.player.x > boss.x + boss.width ||
          this.player.x + this.player.width < boss.x
        )
      ) {
        --Player_life;
      }
    }
    lifeElement.innerText = Player_life;
    if (score < 25) {
      msgElement.innerText = "Blast the enemy";
    }
    if (score > 25 && score < 50) {
      if (boss_50_flag) {
        boss = new Boss(10, 10);
        boss_50_flag = false;
      }
      msgElement.innerText = "Awesome Commander";
    }
    if (score > 50) {
      extra_enemy = true;
      msgElement.innerText = "Born Killer.Here have some more";
      if (enemyTimer !== 500) {
        enemyTimer = enemyTimer - 500;
      }
    }
    if (score > 100) {
      msgElement.innerText = `More enemy's ahead.`;
      if (boss_100_flag) {
        boss = new Boss(10, 10, 1000);
        boss_100_flag = false;
      }
      /* if (enemyTimer !== 250) {
        enemyTimer = enemyTimer - 250;
      } */
    }

    scoreElm.innerText = score;

    if (Player_life < 1) {
      return false;
    } else {
      return true;
    }
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  createBorder() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.stroke();
  }
}

var game = new Game(canvas, width, height);

var Startbutton = document.getElementById("gameStart");
Startbutton.onclick = function (e) {
  Startbutton.blur();
  const introElement = document.getElementById("intro");
  introElement.classList.toggle("hide");
  const gameElement = document.getElementById("game");
  gameElement.classList.toggle("hide");
  startGame();
};

var restartbutton = document.getElementById("gameResetStart");
restartbutton.onclick = function (e) {
  restartbutton.blur();
  startGame();
};

var pausetbutton = document.getElementById("gamePause");
pausetbutton.onclick = function (e) {
  pausetbutton.blur();

  if (pausetbutton.innerText === "Pause") {
    pausetbutton.innerText = "Continue";
    continuegame = false;
  } else {
    pausetbutton.innerText = "Pause";
    continuegame = true;
    game.play();
  }
  game.clear();
};
function reset() {
  score = 0;
  enemyTimer = 1000;
  eneymyWidth = 27;
  enemyHeight = 27;
  enemyIndex = 0;
  width = 300;
  height = 500;
  lastTime = 0;
  Player_life = 5;
  collitionEnemyIndex = [];
  boom_width = 25;
  boom_height = 25;
  boom_Array = [];
  boom_Timer = 14;
  boom_index = 0;
  extra_enemy = false;
  boss = null;
  boss_50_flag = true;
  boss_100_flag = true;
  continuegame = true;
  enemyArray = [];
}

function startGame() {
  reset();
  var game = new Game(canvas, width, height);
  game.play();
}

function enableRestart() {
  const gameResetStart = document.getElementById("gameResetStart");
  gameResetStart.classList.toggle("hide");
  gameResetStart.onclick = function () {
    gameResetStart.classList.toggle("hide");
    startGame();
  };
}

function openCode() {
  window.open("https://github.com/SENTHILnew/the-space-fighter", "_blank");
}
