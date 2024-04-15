import * as THREE from '../three.module.min.js';

export default class CollisionManager {
    constructor(player, colliders, stateManager) {
        this.player = player;
        this.colliders = colliders;
        this.stateManager = stateManager;
        this.collided = new Set();
        this.playerBox = new THREE.Box3().setFromObject(this.player.group);
    }

    update() {
        this.playerBox.setFromObject(this.player.group);

        this.colliders.forEach((collider, i) => {
            if (!this.collided.has(collider)) {
                if (this.playerBox.intersectsSphere(collider.collisionSphere)) {
                    this.handleCollision(collider);
                    this.collided.add(collider);
                    this.removeCollider(collider);
                }
            }
        });
    }

    handleCollision(collider) {
        console.log(`Collision detected with ${collider}!`);
        if (this.stateManager.totalLives > 0) {
            this.player.flashRed();
            this.stateManager.totalLives--;
            console.log(`Lives left: ${this.stateManager.totalLives}`);
        }
    }

    addCollider(collider) {
        this.colliders.push(collider);
        this.collided.delete(collider);
    }

    removeCollider(collider) {
        const index = this.colliders.indexOf(collider);
        if (index > -1) {
            this.colliders.splice(index, 1);
        }
    }
}
