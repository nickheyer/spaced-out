import * as THREE from './three.module.min.js';
import MainScene from './scenes/MainScene.js';
import InputHandler from './utils/InputHandler.js';
import StateManager from './utils/StateManager.js';

const stateManager = new StateManager();
const scene = new MainScene(stateManager);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const inputHandler = new InputHandler();
let lastTime = 0;


function animate(time) {
  requestAnimationFrame(animate);
  const deltaTime = time - lastTime;
  lastTime = time;
  scene.update(inputHandler.getState(), deltaTime);
  renderer.render(scene.scene, scene.camera);
}

requestAnimationFrame(animate);