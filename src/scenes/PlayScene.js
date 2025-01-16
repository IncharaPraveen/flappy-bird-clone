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
    this.score = 0;
    this.scoreText = '';
  }
  preload(){
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
  }
create(){
    this.createBG();
    this.createBird();
    this.createPipes();
    this.createCollider();
    this.createScore();
}
update(time,delta){
this.checkGameStatus();
this.makePipes(time);
this.gameFunction(); 
this.recyclePipes();
}
//start of functions for create
createBG(){
  this.add.image(400, 300, 'sky'); 
}
createBird(){
  this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird');
  this.bird.setCollideWorldBounds(true);
}
createPipes(){
  this.pipes = this.physics.add.group();

} 
createCollider(){
  this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
}
createScore(){
  this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: '32px', fill: '#000' });
}
//start of functions for update 
makePipes(time){
  if (time - this.lastPipeSpawnTime > 2000) { 
    const upperPipe = this.physics.add.sprite(0, 0, 'pipe')
    .setOrigin(0, 1)
    .setImmovable(true);
    const lowerPipe = this.physics.add.sprite(0, 0, 'pipe')
    .setOrigin(0, 0)
    .setImmovable(true);
    this.pipes.add(upperPipe);
    this.pipes.add(lowerPipe);
    this.placePipe(upperPipe, lowerPipe);
    this.lastPipeSpawnTime = time; 
  }
}
gameFunction()
{ this.cursors = this.input.keyboard.createCursorKeys();
  const { space, up } = this.cursors;
  if (space.isDown || up.isDown) {
  this.bird.setVelocityY(-100);
  }
}
checkGameStatus()
{
  if (this.bird.getBounds().bottom >= this.config.height || this.bird.getBounds().top <= 0) {
    this.gameOver();
}
}
 placePipe(uPipe,lPipe)
 {
  const rightMostX = this.getRightMostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
  const pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance);
  const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);
 uPipe.x = rightMostX + pipeHorizontalDistance;
  lPipe.x = uPipe.x;
  uPipe.y = pipeVerticalPosition;
  lPipe.y = uPipe.y + pipeVerticalDistance; 
  lPipe.body.velocity.x = -200;
  uPipe.body.velocity.x = -200;
 lPipe.body.allowGravity =false;
 uPipe.body.allowGravity =false;
}
recyclePipes() {
  const tempPipes = [];
  this.pipes.getChildren().forEach(pipe => {
    // If pipe is off-screen and not yet recycled
    if (pipe.getBounds().right <= 0 && !pipe.recycled) {
      pipe.recycled = true; // Mark the pipe as recycled
      tempPipes.push(pipe);
      if(tempPipes.length === 2){
        this.placePipe(...tempPipes);
        this.increaseScore();
      }
    }
  });
}

/*recyclePipes()
{
  const tempPipes = [];
  this.pipes.getChildren().forEach(pipe => {
    if(pipe.getBounds().right <= 0){
      pipe.recycled = true;
      tempPipes.push(pipe);
      if(tempPipes.length === 2){
        this.placePipe(...tempPipes);
      }
    }  });
} */
 getRightMostPipe()
 {
  let rightMostX = 0;
  this.pipes.getChildren().forEach(function(pipe){
    rightMostX = Math.max(pipe.x, rightMostX);
  });
  return rightMostX;
}
increaseScore(){
  this.score++;
  this.scoreText.setText(`Score: ${this.score}`);
}
 gameOver()
 {
 this.physics.pause();
 this.bird.setTint(0xEE4824);
 this.score = 0;
 this.time.addEvent({
  delay : 1000,
  callback : () => {this.scene.restart();},
  loop :false
 })
 }


}
export default PlayScene;