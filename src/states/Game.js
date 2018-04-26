/* globals __DEV__ */
import Phaser from "phaser";
import { centerGameObjects } from "../utils";
var ball,
  paddle,
  bricks,
  newBrick,
  brickInfo,
  scoreText,
  lives = 3,
  livesText,
  lifeLostText,
  score = 0;

export default class extends Phaser.State {
  init() {}
  preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image("ball", "assets/images/ball.png");
    game.load.image("paddle", "assets/images/paddle.png");
    game.load.image("brick", "assets/images/brick.png");
  }
  initBricks() {
    brickInfo = {
      width: 15,
      height: 5,
      count: {
        row: 7,
        col: 3
      },
      offset: {
        top: 10,
        left: 10
      },
      padding: 5
    };
    bricks = game.add.group();
    for (var c = 0; c < brickInfo.count.col; c++) {
      for (var r = 0; r < brickInfo.count.row; r++) {
        var brickX =
          r * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
        var brickY =
          c * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;
        newBrick = game.add.sprite(brickX, brickY, "brick");
        game.physics.enable(newBrick, Phaser.Physics.ARCADE);
        newBrick.body.immovable = true;
        newBrick.anchor.set(0.5);
        bricks.add(newBrick);
      }
    }
  }

  create() {
    var textStyle = { font: "18px Arial", fill: "#0095DD" };
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
    scoreText = game.add.text(5, 5, "Points: 0", {
      font: "18px Arial",
      fill: "#0095DD"
    });

    // Ball
    ball = game.add.sprite(
      game.world.width * 0.5,
      game.world.height - 25,
      "ball"
    );
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.velocity.set(150, -150);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.events.onOutOfBounds.add(this.ballLeaveScreen, this);

    // Paddle
    paddle = game.add.sprite(
      game.world.width * 0.5,
      game.world.height - 5,
      "paddle"
    );

    paddle.scale.set(6, 1);
    centerGameObjects([paddle]);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    // Lives
    livesText = game.add.text(
      game.world.width - 5,
      5,
      "Lives: " + lives,
      textStyle
    );
    livesText.anchor.set(1, 0);
    lifeLostText = game.add.text(
      game.world.width * 0.5,
      game.world.height * 0.5,
      "Life lost, click to continue",
      textStyle
    );
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;

    this.initBricks();
    paddle.body.immovable = true;
  }
  ballLeaveScreen() {
    console.log("working");
    lives--;
    if (lives) {
      livesText.setText("Lives: " + lives);
      lifeLostText.visible = true;
      ball.reset(game.world.width * 0.5, game.world.height - 25);
      paddle.reset(game.world.width * 0.5, game.world.height - 5);
      game.input.onDown.addOnce(function() {
        lifeLostText.visible = false;
        ball.body.velocity.set(150, -150);
      }, this);
    } else {
      alert("You lost, game over!");
      location.reload();
    }
  }
  ballHitBrick(ball, brick) {
    var killTween = game.add.tween(brick.scale);
    killTween.to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function() {
      brick.kill();
    }, this);
    killTween.start();
    score += 10;
    scoreText.setText("Points: " + score);

    var count_alive = 0;
    for (var i = 0; i < bricks.children.length; i++) {
      if (bricks.children[i].alive == true) {
        count_alive++;
      }
    }
    if (count_alive == 0) {
      alert("You won the game, congratulations!");
      location.reload();
    }
  }

  update() {
    game.physics.arcade.collide(ball, paddle);
    game.physics.arcade.collide(ball, bricks, this.ballHitBrick);
    paddle.x = game.input.x || game.world.width * 0.5;
  }

  render() {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
