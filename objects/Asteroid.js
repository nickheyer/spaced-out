export default class Asteroid {
  constructor() {
    const geometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.25, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, -30);
  }

  update() {
    this.mesh.position.z += 0.1;
    return this.mesh.position.z > 10;
  }
}