export default class Spaceship {
  constructor() {
    const geometry = new THREE.ConeGeometry(0.5, 2, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = Math.PI / 2;
  }

  update(positionChanges) {
    this.mesh.position.x += positionChanges.x;
    this.mesh.position.y += positionChanges.y;
  }
}
