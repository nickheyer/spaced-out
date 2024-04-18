import * as THREE from '../lib/three.module.min.js';
import MainScene from './scenes/MainScene.js';
import InputHandler from './utils/InputHandler.js';
import StateManager from './utils/StateManager.js';
import ConnectionManager from './utils/ConnectionManager.js';


// function eventEmitter({
//   id = playerId,
//   event = null,
//   player = {
//     velocity: {
//       x: 0,
//       y: 0
//     },
//     position: {
//       x: 0,
//       y: 0
//     }
//   }
// } = {}) {

//   const message = JSON.stringify({ id, event, player });
//   ws.send(message);
// }

// SERVER CONNECTION INIT
const server = new ConnectionManager((err, log) => {
  if (err) {
    Error(`CONNECTION/EVENT ERROR ENCOUNTERED, RAISING ERR: ${err}`)
  } else {
    console.log(log);
  }
});

// CLASS INIT
const stateManager = new StateManager(server);
const scene = new MainScene(stateManager, server);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const inputHandler = new InputHandler(server);

// RENDERER SETUP
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// TOP LEVEL GAME LOOP
let lastTime = 0;
function animate(time) {
  lastTime = time;
  const deltaTime = time - lastTime;
  requestAnimationFrame(animate);
  const inputState = inputHandler.getState();
  scene.update(inputState, deltaTime);
  renderer.render(scene.scene, scene.camera);
}

requestAnimationFrame(animate);
