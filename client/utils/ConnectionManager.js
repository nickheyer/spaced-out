
const SO_SERVER_PROTOCOL = 'ws';
const SO_SERVER_URL = 'localhost';
const SO_SERVER_PORT = 5002;

let connection = null;

export default class ConnectionManager {
  constructor(eventCB) {
    if (connection) {
      console.log('YOU ARE ALREADY CONNECTED, CANCELLING CONNECTION INIT')
      return connection;
    }

    this.id = null;
    this.key = crypto.randomUUID();
    this.isLive = false;
    this.eventCB = eventCB;
    this.allowedEvents = [
      'CONN_ANNOUNCED',
      'CONN_DESTROYED',
      'CONN_ESTABLISHED',
      'GAME_EVENT',
    ];

    this.messages = {}; // HASH MAP FOR OUTGOING MESSAGE QUEUE

    this.ws = new WebSocket(`${SO_SERVER_PROTOCOL}://${SO_SERVER_URL}:${SO_SERVER_PORT}`);
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (this.checkQueue(data)) {
        return null;
      }

      if (this.allowedEvents.includes(data.type)) {

        // SERVER ANNOUNCES CONNECTION ATTEMPT TO ALL CLIENTS
        if (data.type === 'CONN_ANNOUNCED' && !this.id) {
          
          // IF THIS CLIENT IS WAITING FOR CONN, SEND REQUEST INCLUDING KEY FOR EXCHANGE
          this.emit('CONN_REQUESTED', { key: this.key }, (err, resp) => {

            // IF THE RESPONSE CONTAINS A PLAYER-ID, THIS IS NOW THE CLIENT-SERVER KEY
            if (resp.type === 'CONN_ESTABLISHED' && resp.playerId && !this.id) {

              console.log(`GOT NEW PLAYER ID FROM THE SERVER: ${resp.playerId}`);
              this.id = resp.playerId;

              console.log('CONNECTION ESTABLISHED WITH SERVER!');
              this.isLive = true;
            }
          });
        } else if (data.type === 'CONN_DESTROYED' && data.playerId === this.id) {
          // RESET PLAYER ID + SET LIVE STATUS TO FALSE
          this.playerId = null;
          this.isLive = false;

          // CLEARING MESSAGE QUEUE
          this.messages = {};
        } else if (data.type === 'GAME_EVENT') {
          this.eventCB(null, data);
        }
      } else {
        console.log(`RECEIVED PREPROCESSED, UNKNOWN, OR FORBIDDEN EVENT TYPE: ${data.type}`);
      }
    };
  };

  get connection() {
    return this;
  };

  // WS EMIT FOR RESPONSE HANDLING, INDEPENDENT OF PLAYER-ID
  emit(type, data, cb) {
    const cbID = crypto.randomUUID();
    this.messages[cbID] = cb;
    this.ws.send(JSON.stringify({ type, message: data, cbID }));
  };

  // CHECKING FOR AWAITED RESPONSES
  checkQueue(data) {
    if (data.cbID && this.messages[data.cbID]) {
      const waitingTask = this.messages[data.cbID];
      delete this.messages[data.cbID];
      return waitingTask(null, data); // EXECUTE ASYNC TASK
      // RETURN TRUTHY VALUE IN CB TO END ON MESSAGE EVENT
    }
  }
}
