/*Player and Bullet creation File*/
var ARROW_MAP = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  Space: false, //spacebar
};
var bulletsArray = [],
  bulletsIndex = 0,
  bullets_width = 8,
  bullets_height = 10,
  bulletSpeed = 10,
  bullets_lastTime = 0,
  bullets_Timer = 1000,
  player_width = 125,
  player_height = 500,
  player_x = 0,
  player_y = 0,
  player_widths = 0;

function creatBullete() {
  var x = player_x + player_widths / 2 - bullets_width / 2;
  var y = player_y;
  new bullete(x, y, bullets_width, bullets_height, bulletSpeed);
}
function bullete(x, y, width, height, speed) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  bulletsIndex++;
  bulletsArray[bulletsIndex] = this;
  this.id = bulletsIndex;
  this.speed = speed;
  this.update = function () {
    this.y += -this.speed;
    if (this.y < -player_height) {
      this.delete();
    }
    this.draw();
  };
  this.draw = function () {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.stroke();
  };
  this.delete = function () {
    delete bulletsArray[this.id];
  };
}

class Player {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.height = height + 20;
    player_widths = this.width = width + 20;
    this.speed = 1.9;
    player_x = this.x = player_width - this.width;
    player_y = this.y = player_height - this.height;
    this.power = 10;
    this.player_img = new Image();
    this.player_img.src = "images/player.png";
    // document.addEventListener('keydown',this.handlekeyEvent.bind(this))
    document.body.addEventListener("keydown", function (e) {
      ARROW_MAP[e.code] = true;
      if (e.code == "Space") {
        creatBullete();
      }
    });
    document.body.addEventListener("keyup", function (e) {
      ARROW_MAP[e.code] = false;
    });
  }

  getBorders() {
    return {
      xMin: this.x,
      xMax: this.x + this.width,
      yMin: this.y,
      yMax: this.y + this.height,
    };
  }
  draw() {
    let indebullet = [];
    let indeenemy = [];
    bulletsArray.forEach((a, inde) => {
      enemyArray.forEach((b, index) => {
        if (
          !(
            a.y + a.height < b.y ||
            a.y > b.y + b.height ||
            a.x > b.x + b.width ||
            a.x + a.width < b.x
          )
        ) {
          indebullet.push(inde);
          indeenemy.push(index);
          return 0;
        }
      });
    });
    if (boss) {
      bulletsArray.forEach((a) => {
        if (
          !(
            a.y + a.height < boss.y ||
            a.y > boss.y + boss.height ||
            a.x > boss.x + boss.width ||
            a.x + a.width < boss.x
          )
        ) {
          new boom(a.x, a.y);
          --boss.boos_life;
          return 0;
        }
      });
      if (boss.boos_life < 1) {
        boss = null;
      }
    }

    indebullet.forEach((a) => {
      bulletsArray.splice(a, 1);
    });
    indeenemy.forEach((a) => {
      ++score;
      if (enemyArray[a]) {
        new boom(enemyArray[a].x, enemyArray[a].y);
        enemyArray.splice(a, 1);
      }
    });
    bulletsArray.forEach((a) => {
      a.update();
    });
    if (ARROW_MAP["ArrowLeft"]) {
      this.x -= this.speed;
      player_x = this.x;
    }
    if (ARROW_MAP["ArrowRight"]) {
      this.x += this.speed;
      player_x = this.x;
    }
    if (ARROW_MAP["ArrowDown"]) {
      this.y += this.speed;
      player_y = this.y;
    }
    if (ARROW_MAP["ArrowUp"]) {
      this.y -= this.speed;
      player_y = this.y;
    }

    this.ctx.beginPath();
    this.ctx.drawImage(
      this.player_img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
