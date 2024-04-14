import MainScene from './scenes/MainScene.js';
import InputHandler from './utils/InputHandler.js';

const scene = new MainScene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const inputHandler = new InputHandler();

function animate() {
  requestAnimationFrame(animate);
  scene.update(inputHandler.getState());
  renderer.render(scene.scene, scene.camera);
}

animate();
