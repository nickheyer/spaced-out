import * as THREE from '../../lib/three.module.min.js';

export default class Asteroid {
  constructor() {
    const size = Math.random() * 2 + 0.02;
    const geometry = new THREE.IcosahedronGeometry(size, 1);
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 1.0
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, -100);
    this.collisionSphere = new THREE.Sphere(this.mesh.position, size);
    this.isFading = false;
    this.fadeStartTime = 0;
    this.fadeRate = 0.001; // Rate of opacity decrease per millisecond
  }

  update(deltaTime) {
    this.mesh.rotation.x += 0.001;
    this.mesh.rotation.y += 0.001;
    this.mesh.position.z += 0.08;
    this.collisionSphere.center.copy(this.mesh.position);

    if (this.isFading) {
      this.fadeOut(deltaTime);
    }
    
    return this.mesh.position.z > 10 || this.mesh.material.opacity <= 0;
  }

  startFading() {
    this.isFading = true;
  }

  fadeOut(deltaTime) {
    if (this.mesh.material.opacity > 0) {
      console.log(deltaTime);
      const fadedOpac = this.mesh.material.opacity - (deltaTime * this.fadeRate);
      console.log(fadedOpac);
      this.mesh.material.opacity = Math.max(fadedOpac, 0);
    } else {
      this.isFading = false;
    }
  }
}
