import Spaceship from '../objects/Spaceship.js';
import Asteroid from '../objects/Asteroid.js';
import WinBanner from '../objects/WinBanner.js';

export default class MainScene {
  constructor(stateManager) {
    
    // INIT CAMERA AND SCENE
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 10;
    
    // INIT STATE
    this.state = stateManager;
    this.winBanner = null;
    
    // INIT SPACESHIP
    this.spaceship = new Spaceship();
    this.scene.add(this.spaceship.mesh);

    // INIT ASTEROIDS
    this.asteroids = [];
    this.createAsteroids(5);
  }

  createAsteroids(qty) {
    for (let i = 0; i < qty; i++) {
      // while(
      //   this.state.getTime() <
      //   this.state.lastAsteroidSpawnTime + this.state.asteroidSpawnDelay
      // ) {
      //     console.log('waiting...', this.state.lastAsteroidSpawnTime + this.state.asteroidSpawnDelay);
      //   }

        console.log('Spawning asteroid');
        const asteroid = new Asteroid();
        this.scene.add(asteroid.mesh);
        this.asteroids.push(asteroid);
        this.state.numOfAsteroids = this.asteroids.length;
        this.state.lastAsteroidSpawnTime = this.state.time;
    }

    // Update state with current count
    return this.asteroids;
  }

  updateAsteroids() {
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroidDestroyed = this.asteroids[i].update();
      if (asteroidDestroyed) {
        this.scene.remove(this.asteroids[i].mesh);
        this.asteroids.splice(i, 1);
      }
    }
  }


  update(keyboardState) {
    this.state.time += 1;
    this.spaceship.update(keyboardState);
    this.updateAsteroids();

    if (this.state.gameRunning) {

      const randDelay = this.state.getRandDelayInRange();

      if (this.state.numOfAsteroids > this.state.maxNumberOfAsteroids) {
        const winBanner = new WinBanner(this.spaceship);
        this.scene.add(winBanner.mesh);
        this.winBanner = winBanner;
        this.state.gameRunning = false;
      } else if (this.state.lastAsteroidSpawnTime + randDelay < this.state.time) {
        this.createAsteroids(1);
        console.log(`
        LAST SPAWN TIME: ${this.state.lastAsteroidSpawnTime}

        RAND SPAWN DELAY: ${randDelay}

        SPAWN DELAY MAX: ${this.state.asteroidSpawnDelay}

        CURRENT TIME: ${this.state.time}
        `);

        // DECREASE DELAY BETWEEN ASTEROID SPAWNS BY 1 EVERY TIME ASTEROID SPAWNS
        if (this.state.asteroidSpawnDelay > this.state.spawnDelayMin) {
          this.state.asteroidSpawnDelay = this.state.asteroidSpawnDelay - this.state.spawnDelayDecUnit;
        }
      }


    }
   
    if (this.winBanner) {
      this.winBanner.update(keyboardState);
    }
  }
}