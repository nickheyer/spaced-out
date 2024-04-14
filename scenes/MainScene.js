import Spaceship from '../objects/Spaceship.js';
import Asteroid from '../objects/Asteroid.js';

export default class MainScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 10;
    this.spaceship = new Spaceship();
    this.scene.add(this.spaceship.mesh);
    this.asteroids = [];

    for (let i = 0; i < 10; i++) {
      const asteroid = new Asteroid();
      this.scene.add(asteroid.mesh);
      this.asteroids.push(asteroid);
    }
  }

  update(keyboardState) {
    this.spaceship.update(keyboardState);
    this.asteroids.forEach(asteroid => asteroid.update());
  }
}
