export default class WinBanner {
  constructor(spaceship) {
    const geometry = new THREE.BoxGeometry(1, 1, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 2, -5); // Set initial position
    this.velocity = new THREE.Vector3(0.1, 0, 0.1); // Set initial velocity
    this.spaceship = spaceship;
  }

  update(keyboardState) {
    this.mesh.position.add(this.velocity); // Move the win banner

    const distanceToUser = Math.sqrt(Math.pow(this.mesh.position.x - this.spaceship.mesh.position.x, 2) + Math.pow(this.mesh.position.z - this.spaceship.mesh.position.z, 2));

    if (distanceToUser < 5) { // Stop the win banner when it's in front of the user
      this.velocity.set(0, 0, 0);
    }
  }
}
