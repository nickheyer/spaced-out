import * as THREE from '../../lib/three.module.min.js';
import { GLTFLoader } from '../../lib/gltfloader.js';

export default class Spaceship {
  constructor() {
    this.group = new THREE.Group();
    this.velocity = new THREE.Vector2(0, 0);
    this.acceleration = new THREE.Vector2(0.005, 0.005);
    this.maxSpeed = 0.1;
    this.loadModel('client/objects/spaceship.gltf');
  }

  loadModel(path) {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      const model = gltf.scene;
      this.group.add(model);
      this.addLights();
      this.saveOriginalColors(model);
    }, undefined, (error) => {
      console.error('The model is borked:', error);
    });
  }

  addLights() {
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 2, 5);
    this.group.add(pointLight);
  
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 3, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.group.add(spotLight);
  }

  saveOriginalColors(model) {
    model.traverse((object) => {
      if (object.isMesh && object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if (!material.userData.originalColor && material.color) {
            material.userData.originalColor = material.color.clone();
          }
          if (!material.userData.originalEmissive && material.emissive) {
            material.userData.originalEmissive = material.emissive.clone();
          }
        });
      }
    });
  }

  update(positionChanges) {
    // ACCELL ON INPUT
    if (positionChanges.x !== 0) {
      this.velocity.x += this.acceleration.x * positionChanges.x;
      this.velocity.x = Math.sign(this.velocity.x) * Math.min(Math.abs(this.velocity.x), this.maxSpeed);
    } else {
      // FRICTON ON NO INPUT
      this.velocity.x *= 0.95;
    }

    if (positionChanges.y !== 0) {
      this.velocity.y += this.acceleration.y * positionChanges.y;
      this.velocity.y = Math.sign(this.velocity.y) * Math.min(Math.abs(this.velocity.y), this.maxSpeed);
    } else {
      this.velocity.y *= 0.95;
    }

    // UPDATE POS
    this.group.position.x += this.velocity.x;
    this.group.position.y += this.velocity.y;
  }

  flashRed(perpetual = false) {
    if (perpetual) {
      this.isFlashing = true;
      this.flashProgress = 0;
      this.flashingToRed = true;
      this.animateFlash();
    } else {
      this.changeMaterialColor(0xff0000); // RED
      setTimeout(() => {
        this.restoreOriginalColors();
      }, 500);
    }
  }

  animateFlash() {
    if (!this.isFlashing) return;

    const speed = 0.05;
    if (this.flashingToRed) {
      this.flashProgress += speed;
      if (this.flashProgress >= 1) {
        this.flashProgress = 1;
        this.flashingToRed = false;
      }
    } else {
      this.flashProgress -= speed;
      if (this.flashProgress <= 0) {
        this.flashProgress = 0;
        this.flashingToRed = true;
      }
    }

    let newColor = new THREE.Color(0x333333); // WHATEVER THE "ORIGINAL" IS
    newColor.lerp(new THREE.Color(0xff0000), this.flashProgress);
    this.changeMaterialColor(newColor);

    requestAnimationFrame(this.animateFlash.bind(this));
  }

  stopFlashing() {
    this.isFlashing = false;
    this.restoreOriginalColors();
  }

  changeMaterialColor(color) {
    this.group.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => this.setColor(mat, color));
        } else {
          this.setColor(child.material, color);
        }
      }
    });
  }

  setColor(material, color) {
    // if (material.color) {
    //   material.color.set(color);
    // }
    if (material.emissive) {
      material.emissive.set(color);
    }
  }

  restoreOriginalColors() {
    this.group.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (material.userData.originalColor) {
            material.color.copy(material.userData.originalColor);
          }
          if (material.userData.originalEmissive) {
            material.emissive.copy(material.userData.originalEmissive);
          }
        });
      }
    });
  }
}
