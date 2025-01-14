import Phaser from 'phaser';

class PlayScene extends Phaser.Scene{

 constructor(config)
  {
    super('PlayScene');
    this.config = config;
    this.bird = null;
    this.pipes = null;
    this.pipeVerticalDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [500, 550];
    this.pipeHoriontalDistance = 0;
    this.lastPipeSpawnTime = 0;
  }
  preload(){
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
  }
  create(){
    this.createBG(){
    this.add.image(400, 300, 'sky'); }
    
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird');

    this.pipes = this.physics.add.group();
    
  }



  update(time,delta){

    if (time - this.lastPipeSpawnTime > 2000) { // Check if 2 second has passed before spawning 

      const upperPipe = this.physics.add.sprite(0, 0, 'pipe').setOrigin(0, 1);
      const lowerPipe = this.physics.add.sprite(0, 0, 'pipe').setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe);
    
      this.lastPipeSpawnTime = time; // Update the last spawn tiME
  }
 

    this.cursors = this.input.keyboard.createCursorKeys();
    const { space, up } = this.cursors;
  
    if (space.isDown || up.isDown) {
      this.bird.setVelocityY(-100);
    }
    if (this.bird.body.y > this.config.height || this.bird.body.y < 0) {
      this.restartBirdPosition();
    }
  
    this.recyclePipes();
}
placePipe(uPipe,lPipe){
  const rightMostX = this.getRightMostPipe();
  //get position of rightmost pipe
  const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
  const pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance);
 const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);

 
  uPipe.x = rightMostX + pipeHorizontalDistance;
  //ensure that new pipe is placed at distance away from rightmost pipe, does not overlap 
  lPipe.x = uPipe.x;
  //hori position of upper & lower pipe equal 
  uPipe.y = pipeVerticalPosition;
  lPipe.y = uPipe.y + pipeVerticalDistance; 
  lPipe.body.velocity.x = -200;
  uPipe.body.velocity.x = -200;
  lPipe.body.allowGravity =false;
  uPipe.body.allowGravity =false;

}
recyclePipes(){
  const tempPipes = [];
  this.pipes.getChildren().forEach(pipe => {
    if(pipe.getBounds().right <= 0){
      tempPipes.push(pipe);
      if(tempPipes.length === 2){
        this.placePipe(...tempPipes);
      }
    }
  });
}
 getRightMostPipe(){
  let rightMostX = 0;
  this.pipes.getChildren().forEach(function(pipe){
    rightMostX = Math.max(pipe.x, rightMostX);
  });
  return rightMostX;
}
 restartBirdPosition(){
 this.bird.x = this.config.startPosition.x;
 this.bird.y = this.config.startPosition.y;
 this.bird.body.velocity.y = 0;
}
}
export default PlayScene;