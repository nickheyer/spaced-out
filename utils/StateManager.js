
export default class StateManager {
  constructor(textManager) {
    // BASIC GAME STATE
    this.score = 0;
    this.totalLives = 3;

    this.gameRunning = true;
    this.gameEnded = false;

    // GAME TIME
    this.time = 0;

    // ASTEROID SPAWN TIMES/STATES
    this.maxNumberOfAsteroids = 9999;
    this.lastAsteroidSpawnTime = 0;
    this.asteroidSpawnDelay = 100;
    this.spawnDelayMin = 20;
    this.spawnDelayDecUnit = 2;
    this.nextAsteroidSpawnTime = this.asteroidSpawnDelay;

    // BREAK STATE
    this.breakTime = 400;
    this.isBreakTime = false;
    this.endOfBreakTime = this.breakTime;

    // LEVEL STATE
    this.currentLevel = 0;
    this.levelDuration = 4 * 1000;
    this.nextLevelStartTime = this.breakTime + this.levelDuration;


    // END GAME STATE
    this.gameEndFollowUpTime = 1200;
    this.gameEndFollowUpTextIter = 0;
  };

  getRandDelay() {
    const rand = Math.ceil(this.asteroidSpawnDelay * Math.random());
    return Math.max(
      this.spawnDelayMin,
      rand
    );
  };

  updateLevel() {

    // IF CURRENT TIME IS > NEXT LEVEL START TIME, START NEW BREAK AND INCREMENT LEVEL, PREP NEXT LEVEL
    if (this.time > this.nextLevelStartTime || this.currentLevel === 0) {

      // INCREMEMENT LEVEL
      this.currentLevel++;

      // SET END OF BREAK TIME
      this.isBreakTime = true;
      this.endOfBreakTime = this.time + this.breakTime;
      console.log(`STARTING BREAK TIME UNTIL: ${this.endOfBreakTime}, CURRENTLY ${this.time}`);

      // SET SPAWN TIME OF NEXT ASTEROID TO THE END OF CURRENT BREAK/GAP BETWEEN LEVELS
      this.nextAsteroidSpawnTime = this.endOfBreakTime;

      // SET START OF NEXT LEVEL (AFTER BREAKS)
      this.nextLevelStartTime = this.endOfBreakTime + this.levelDuration;

      // INCREASE DIFFICULTY PER LEVEL, COMPOUNDING
      this.asteroidSpawnDelay -= this.currentLevel;
    }

    if (this.isBreakTime && this.time >= this.endOfBreakTime) {
      this.isBreakTime = false;
      console.log(`ENDING BREAK TIME AT ${this.endOfBreakTime}`);
      this.endOfBreakTime = this.nextLevelStartTime;
      return this.currentLevel
    }

    return null;
  }

  resetNextSpawnTime() {
    const rand = this.getRandDelay();
    this.nextAsteroidSpawnTime += rand;
  }

  getTime() {
    return this.time;
  };

  getState() {
    return this;
  };
}
