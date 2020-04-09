import { MIDI } from "./MIDI.js";
import { Simon } from "./Simon.js";

export const MATRIX = [
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
];

export class Game {
  constructor() {
    this.key = null;
    this.midiInput = null;
    this.midiOnput = null;
    this.midi = new MIDI(this.onEvent.bind(this));
    this.midi.initialize().then(() => {
      this.reset();
    });
  }
  onConnected(device) {
    if (device.type === "input" && !this.midiInput)
      this.midiInput = device.name;
    if (device.type === "output" && !this.midiOutput)
      this.midiOutput = device.name;
  }
  onDisconnected(device) {
    if (device.type === "input" && this.midiInput === device.name) {
      this.midiInput = null;
      this.simon = null;
    }
    if (device.type === "output" && this.midiOutput === device.name)
      this.midiOutput = null;
  }
  onPress(key) {
    if (this.key) return;
    this.key = key;
  }
  onRelease(key) {
    if (this.key !== key) return;
    this.key = null;
    this.answer.push(key);
    const { complete, success } = this.simon.submit(this.answer);
    if (!success) {
      alert(`YOU FAIL! You got to level ${this.answer.length - 1}`);
      this.reset();
    } else if (complete) {
      this.step();
    }
  }

  onEvent(event) {
    if (event.type === "device_connected") this.onConnected(event.device);
    else if (event.type === "device_disconnected")
      this.onDisconnected(event.device);
    else if (event.type === "note_on") this.onPress(event.a.value);
    else if (event.type === "note_off") this.onRelease(event.a.value);
  }

  reset() {
    this.simon = new Simon(MATRIX);
    this.step();
  }

  step() {
    this.simon.step();
    this.answer = [];
    this.light();
  }

  light(index = 0) {
    const { pattern } = this.simon;
    const on = () => {
      this.midi.notify([144, pattern[index], 127], this.midiOutput);
      document
        .getElementById(`button-${pattern[index]}`)
        .classList.add("active");
    };
    const off = () => {
      this.midi.notify([128, pattern[index], 0], this.midiOutput);
      document
        .getElementById(`button-${pattern[index]}`)
        .classList.remove("active");
    };
    setTimeout(on, 250);
    setTimeout(off, 750);
    if (index < pattern.length - 1)
      setTimeout(() => {
        this.light(index + 1);
      }, 1000);
  }
}
