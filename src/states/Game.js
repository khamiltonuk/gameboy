/* globals __DEV__ */
import Phaser from "phaser";
import { centerGameObjects } from "../utils";
var ball, paddle;

export default class extends Phaser.State {
  init() {}
  preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    // game.stage.backgroundColor = "#eee";
    game.load.image("ball", "assets/images/mushroom2.png");
    game.load.image("paddle", "assets/images/paddle.png");
  }

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    ball = game.add.sprite(
      game.world.width * 0.5,
      game.world.height - 25,
      "ball"
    );
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.velocity.set(150, -150);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.scale.set(0.5, 0.5);

    paddle = game.add.sprite(
      game.world.width * 0.5,
      game.world.height - 5,
      "paddle"
    );
    centerGameObjects([paddle]);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
    ball.events.onOutOfBounds.add(function() {
      alert("Game over!");
      location.reload();
    }, this);

    paddle.body.immovable = true;
  }

  update() {
    game.physics.arcade.collide(ball, paddle);
    paddle.x = game.input.x || game.world.width * 0.5;
  }

  render() {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
