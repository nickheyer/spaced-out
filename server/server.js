const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// CONSTANTS
const SO_SERVER_PORT = process.env.SO_SERVER_PORT || 8080;
const SO_UPDATE_INTERVAL = process.env.MS_UPDATE_INTERVAL || 100;

const players = {};
const asteroids = [];
const allowedEvents = [
  'CONN_REQUESTED',
  'CONN_CLOSED',
  'PLAYER_EVENT',
  'ASTEROID_EVENT',
  'GM_EVENT'
];

function createPlayerID(length = 16) {
  const playerID = crypto.randomBytes(length).toString('hex');
  console.log(`CREATING PLAYER ID: ${playerID}`);
  return playerID;
}

// Basic structure for a player object
function createPlayer(id, key) {
  console.log(`PLAYER ${id} CONNECTED, RETURNING DEFAULT STATE FOR NEW SPAWN`);
  return {
    id: id, // SERVER GENERATED KEY
    key: key, // CLIENT GENERATED KEY
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0 }
  };
}

// Basic structure for an asteroid object
function createAsteroid() {
  return {
    position: { x: Math.random() * 10 - 5, y: Math.random() * 10 - 5, z: -50 },
    rotation: { x: 0.001, y: 0.001 },
    velocity: { z: 0.08 }
  };
}

// Spawn asteroids at intervals
setInterval(() => {
  if (asteroids.length < 50) {  // Limit number of asteroids
    asteroids.push(createAsteroid());
  }
}, 2000);

// Handle WebSocket connection
wss.on('connection', function connection(ws) {
  let id = null;
  console.log('CONNECTION REQUESTED FROM SERVER BY CLIENT');
  ws.send(JSON.stringify({ type: 'CONN_ANNOUNCED' }));
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    console.log(data);


    if (!allowedEvents.includes(data.type)) {
      console.log(`RECEIVED UNKNOWN OR FORBIDDEN EVENT TYPE: ${data.type}`);
      return;
    }

    // CALLBACK ID USED BY CLIENT FOR ASYNC TASKS
    const cbID = data.cbID;

    // IF CLIENT REQUESTED A CONNECTION WITH A CALLBACK ID
    if (data.type === 'CONN_REQUESTED' && data.message.key && cbID) {
      console.log(`INCOMING CONNECTION REQUEST WITH KEY: ${data.message.key}`);
      id = createPlayerID();
      players[id] = createPlayer(id, data.message.key);
      ws.send(JSON.stringify({ type: 'CONN_ESTABLISHED', playerId: id }));
      console.log(`ESTABLISHING CONNECTION WITH INCOMING CLIENT, GEN PLAYER ID: ${id}`)
    } else if (data.type === 'PLAYER_EVENT' && data.id && players[data.id]) {

      players[data.id].position.x += players[data.id].velocity.x;
      players[data.id].position.y += players[data.id].velocity.y;
  
      players[data.id].velocity.x += data.positionChanges.x;
      players[data.id].velocity.y += data.positionChanges.y;
    }

  });

  ws.on('close', function() {
    if (id && players[id]) {
      delete players[id];
    }
  });
});

// Broadcast game state to all clients
function updateGame() {

  const payload = JSON.stringify({
    type: 'GAME_EVENT',
    players,
    asteroids
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  // Update asteroid positions
  asteroids.forEach((asteroid, index) => {
    asteroid.position.z += asteroid.velocity.z;
    if (asteroid.position.z > 10) {
      asteroids.splice(index, 1);
    }
  });
}

setInterval(updateGame, SO_UPDATE_INTERVAL); // Update game state every 100 ms

server.listen(SO_SERVER_PORT, () => {
  console.log(`Server started on port ${SO_SERVER_PORT}`);
});
