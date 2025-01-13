

import Phaser from 'phaser';

import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
       debug: false
    }
  },
  scene: {
    preload : preload,
    create : create,
    update : update
  }
};

new Phaser.Game(config);
function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}
let bird;
let Pipes_TO_RENDER;
let pipeVerticalDistanceRange = [150, 250];
//let pipeHorizontalDistance;
let pipeHorizontalDistanceRange = [500, 550];
let pipes = null;

function create() {
  this.add.image(400, 300, 'sky');
  bird = this.physics.add.sprite(100, 300, 'bird');
  this.isGameRunning = true;
//  pipeHoriontalDistance = 0;
  pipes = this.physics.add.group();

}
function placePipe(uPipe,lPipe){
  const rightMostX = getRightMostPipe();
  let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  let pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 - pipeVerticalDistance);
 const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);
  uPipe.x = rightMostX + pipeHorizontalDistance;
  lPipe.x = uPipe.x;
  //hori position of upper & lower pipe equal 
  uPipe.y = pipeVerticalPosition;
  lPipe.y = uPipe.y + pipeVerticalDistance;
  lPipe.body.velocity.x = -200;
  uPipe.body.velocity.x = -200;

}
function recyclePipes(){
  const tempPipes = [];
  pipes.getChildren().forEach(pipe => {
    if(pipe.getBounds().right <= 0){
      tempPipes.push(pipe);
      if(tempPipes.length === 2){
        placePipe(...tempPipes);
      }
    }
  });
}
function getRightMostPipe(){
  let rightMostX = 0;
  pipes.getChildren().forEach(function(pipe){
    rightMostX = Math.max(pipe.x, rightMostX);
  });
  return rightMostX;
}
function restartBirdPosition(){
  bird.x = 100;
  bird.y = 300;
  bird.body.velocity.y = 0;
}
function update(time,delta){
  if(this.isGameRunning == false)
    return;
  time += delta;
  this.cursors = this.input.keyboard.createCursorKeys();
  const {space,up} = this.cursors;
  if (space.isDown || up.isDown) {
    bird.setVelocityY(-100);
  }
  if(time >10000){
  for(let i=0; i<4; i++){
    const upperPipe = this.physics.add.sprite(0,0,'pipe').setOrigin(0,1);
    const lowerPipe = this.physics.add.sprite(0,0,'pipe').setOrigin(0,0);
     placePipe(upperPipe,lowerPipe);
   }
  }
  if(bird.body.y > config.height || bird.body.y < 0)
  restartBirdPosition();

  recyclePipes();

}
