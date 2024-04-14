import Spaceship from '../objects/Spaceship.js';
import Asteroid from '../objects/Asteroid.js';
import WinBanner from '../objects/WinBanner.js';

let numOfAsteroids = 4;

export default class MainScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 10;
    this.spaceship = new Spaceship();
    this.scene.add(this.spaceship.mesh);
    this.asteroids = [];
    this.winBanner = null;

    if (numOfAsteroids++ > 20) {
      const winBanner = new WinBanner();
      this.scene.add(winBanner.mesh);
      this.winBanner = winBanner;
    } else {
      for (let i = 0; i < numOfAsteroids; i++) {
        const asteroid = new Asteroid();
        this.scene.add(asteroid.mesh);
        this.asteroids.push(asteroid);
      }
    }
  }

  update(keyboardState) {
    this.spaceship.update(keyboardState);
    this.asteroids.forEach(asteroid => asteroid.update());
    if (this.winBanner) {
      this.winBanner.update(keyboardState);
    }
  }
}
