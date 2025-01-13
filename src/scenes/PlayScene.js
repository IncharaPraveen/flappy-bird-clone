import Phaser from 'phaser';
class PlayScene extends Phaser.Scene{
  constructor()
  {
    super('PlayScene');
    this.initialBirdPosition = {
      x : 80,
      y:300
    }
  }
 preload(){
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
  }
  create(){
    this.add.image(400, 300, 'sky');
    this.bird = this.physics.add.sprite(this.initialBirdPosition.x, this.initialBirdPosition.y, 'bird');
    this.isGameRunning = true;
  //  pipeHoriontalDistance = 0;
    pipes = this.physics.add.group({
      allowGravity: false
    });
  
  }
 update(){

  }

}
export default PlayScene;