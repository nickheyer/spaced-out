export default class StateManager {
  constructor() {
    this.score = 0;
    this.numOfAsteroids = 4;
    this.timeInSpace = 0;
    this.timesHit = 0;
    this.winCond = false;
    this.loseCond = false;
    this.gameRunning = true;
    this.time = 0;
    this.lastAsteroidSpawnTime = 0;
    this.asteroidSpawnDelay = 1000;
    this.spawnDelayMin = 30;
    this.spawnDelayDecUnit = 1;
    
    this.maxNumberOfAsteroids = 9999;
  };

  getRandDelayInRange() {
    const min = this.spawnDelayMin;
    const max = this.asteroidSpawnDelay;
    
    return Math.max(
      min,
      Math.ceil(max * Math.random())
    );
  };


  getTime() {
    return this.gameTime;
  };

  getState() {
    return this;
  };
}
