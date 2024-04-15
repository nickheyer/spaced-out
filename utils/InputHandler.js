
export default class InputHandler {
  constructor() {
    this.keys = {};
    document.addEventListener('keydown', event => {
      this.keys[event.which] = true;
    });
    document.addEventListener('keyup', event => {
      this.keys[event.which] = false;
    });
  }

  getState() {
    return {
      x: (this.keys[68] ? 0.1 : 0) - (this.keys[65] ? 0.1 : 0), // D - A
      y: (this.keys[87] ? 0.1 : 0) - (this.keys[83] ? 0.1 : 0), // W - S
    };
  }
}
