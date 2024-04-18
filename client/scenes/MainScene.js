import * as THREE from '../../lib/three.module.min.js';
import Spaceship from '../objects/Spaceship.js';
import Asteroid from '../objects/Asteroid.js';
import TextManager from '../objects/TextRenderer.js';
import CollisionManager from '../utils/CollisionManager.js';

export default class MainScene {
  constructor(stateManager, server) {

    // INIT CLIENT<-->SERVER EVENT EMITTER
    this.server = server;

    // INIT CAMERA AND SCENE
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 10;
    
    // INIT FOG
    this.scene.fogExp = new THREE.FogExp2(0x000000, 0.008);
    this.scene.fog = new THREE.Fog(0x000000, 50, 100);

    // INIT STATE
    this.state = stateManager;
    this.winBanner = null;
    


    // INIT SPACESHIP
    this.spaceship = new Spaceship(this.server);
    this.scene.add(this.spaceship.group);

    // INIT COLLISION MANAGER
    this.collisionManager = new CollisionManager(this.spaceship, [], this.state, this.server);

    // INIT ASTEROIDS ARRAY
    this.asteroids = [];

    // TEXT
    this.textManager = new TextManager(this.scene, this.collisionManager, this.server);
    this.generateText('Spaced Out\nBy Nick', 'green', { size: 3 });
  }

  generateText(text, color='green', options = {}) {
    this.textManager.loadFontAndCreateText({
      text: text, color: color, ...options
    });
  }

  createAsteroids(qty) {
    for (let i = 0; i < qty; i++) {
        console.log('Spawning asteroid');
        const asteroid = new Asteroid(this.server);
        this.scene.add(asteroid.mesh);
        this.collisionManager.addCollider(asteroid);
        this.asteroids.push(asteroid);
        this.state.numOfAsteroids = this.asteroids.length;
        this.state.lastAsteroidSpawnTime = this.state.time;
        this.state.resetNextSpawnTime();
    }

    // Update state with current count
    return this.asteroids;
  }

  updateAsteroids(deltaTime) {
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroidDestroyed = this.asteroids[i].update(deltaTime);
      if (asteroidDestroyed) {
        this.collisionManager.removeCollider(this.asteroids[i]);
        this.scene.remove(this.asteroids[i].mesh);
        this.asteroids.splice(i, 1);
      }
    }
  }

  fadeOutAsteroids() {
    this.asteroids.forEach((asteroid) => {
      asteroid.startFading();
    });
  }


  update(keyboardState, deltaTime) {
    this.state.time += 1;
    const stateUpdates = this.state.updateLevel();
    this.spaceship.update(keyboardState);
    this.updateAsteroids(deltaTime);
    this.collisionManager.update();

    if (this.state.gameRunning) {
      if (this.state.time >= this.state.nextAsteroidSpawnTime) {
        this.createAsteroids(1);
      }

      if (stateUpdates) {
        this.generateText(`Level ${stateUpdates}`, 'red');
      }
    }

    if (!this.state.gameEnded) {
      if (this.state.totalLives > 0 && this.state.level === 10) {
        this.generateText(`YOU WON THE GAME WITH ${this.state.score} POINTS`, 'green');
        this.state.gameRunning = false;
        this.state.gameEnded = true;
        this.state.gameEndTime = this.state.time;
        this.fadeOutAsteroids();
      } else if (this.state.totalLives <= 0) {
        this.generateText(`YOU LOST!`, 'red');
        this.spaceship.flashRed(true);
        this.state.gameRunning = false;
        this.state.gameEnded = true;
        this.state.gameEndTime = this.state.time;
        this.fadeOutAsteroids();
      }
    }

    if (
      this.state.gameEnded &&
      this.state.time >= this.state.gameEndTime + this.state.gameEndFollowUpTime
    ) {
      const followUps = [
        'Why are you still here...',
        'Go home...',
        'The game is over...',
        'Refresh if you wanna play again...'
      ];

      this.generateText(followUps[this.state.gameEndFollowUpTextIter++], 'purple', { size: 2 });
      this.state.gameEndTime += this.state.gameEndFollowUpTime;
      if (this.state.gameEndFollowUpTextIter > 3) {
        this.state.gameEndFollowUpTextIter = 0;
      }
    }

    this.textManager.update(keyboardState);
  }
}