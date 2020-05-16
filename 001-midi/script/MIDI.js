// http://aaron.headwai.com/ra/MIDI/MIDI%20Message%20Table%201.pdf
// https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
class MIDIEvent {
  constructor(face, data) {
    this.device = {
      type: face.type,
      id: face.id,
      manufacturer: face.manufacturer,
      name: face.name,
    };
    if (data) {
      const { type, a, b } = MIDIEvent.describedValuesFromData(data);
      this.type = type;
      this.a = a;
      this.b = b;
    } else {
      this.type = MIDIEvent.toType(
        face.state === "connected" ? "Device Connected" : "Device Disconnected"
      );
      this.a = null;
      this.b = null;
    }
  }

  static toType(string) {
    if (!string) return string;
    return string
      .replace(/[^\w\d]/, " ")
      .replace(/ +$/, "")
      .replace(/ +/, "_")
      .toLowerCase();
  }

  static describedData(data, name, label1, label2) {
    const [func, byte1, byte2] = data;
    const channel = func >= 128 && func <= 239 ? (func % 16) + 1 : 0;
    const value = (val) => (typeof val === "number" ? val : null);
    const ratio = (val) => (typeof val === "number" ? val / 127 : null);
    const string = (val) => val || null;
    return {
      channel,
      type: MIDIEvent.toType(name),
      a: {
        value: value(byte1),
        ratio: ratio(byte1),
        type: string(MIDIEvent.toType(label1)),
      },
      b: {
        value: value(byte2),
        ratio: ratio(byte2),
        type: string(MIDIEvent.toType(label2)),
      },
    };
  }

  static describedValuesFromData(data) {
    const [func, byte1] = data;
    const fn = MIDIEvent.describedData;
    if (func >= 128 && func <= 143)
      return fn(data, "Note Off", "Note", "Velocity");
    else if (func >= 144 && func <= 159)
      return fn(data, "Note On", "Note", "Velocity");
    else if (func >= 160 && func <= 175)
      return fn(data, "Polyphonic Aftertouch", "Note", "Pressure");
    else if (func >= 176 && func <= 191)
      return fn(data, "Mode Change", "Mode", MIDIEvent.modeLabel(byte1));
    else if (func >= 192 && func <= 207)
      return fn(data, "Program Change", "Program");
    else if (func >= 208 && func <= 223)
      return fn(data, "Aftertouch", "Pressure");
    else if (func >= 224 && func <= 239)
      return fn(data, "Pitch Wheel Control", "LSB", "MSB");
    else
      switch (func) {
        case 240:
          return fn(data, "System Exclusive");
        case 241:
          return fn(data, "MIDI Time Code Qtr. Frame");
        case 242:
          return fn(data, "Song Position Pointer", "LSB", "MSB");
        case 243:
          return fn(data, "Song Select", "Song #");
        case 244:
          return fn(data, "Unspecified (Reserved)");
        case 245:
          return fn(data, "Unspecified (Reserved)");
        case 246:
          return fn(data, "Tune request'");
        case 247:
          return fn(data, "End of SysEx (EOX)");
        case 248:
          return fn(data, "Timing clock");
        case 249:
          return fn(data, "Unspecified (Reserved)");
        case 250:
          return fn(data, "Start");
        case 251:
          return fn(data, "Continue");
        case 252:
          return fn(data, "Stop");
        case 253:
          return fn(data, "Unspecified (Reserved)");
        case 254:
          return fn(data, "Active Sensing");
        case 255:
          return fn(data, "System Reset");
      }
  }

  static modeLabel(byte1) {
    return [
      "Bank Select",
      "Modulation Wheel or Lever",
      "Breath Controller",
      "Unspecified",
      "Foot Controller",
      "Portamento Time",
      "Data Entry MSB",
      "Channel Volume",
      "Balance",
      "Unspecified",
      "Pan",
      "Expression Controller",
      "Effect Control 1",
      "Effect Control 2",
      "Unspecified",
      "Unspecified",
      "General Purpose Controller 1",
      "General Purpose Controller 2",
      "General Purpose Controller 3",
      "General Purpose Controller 4",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "LSB for Control 0 (Bank Select)",
      "LSB for Control 1 (Modulation Wheel or Lever)",
      "LSB for Control 2 (Breath Controller)",
      "LSB for Control 3 (Unspecified)",
      "LSB for Control 4 (Foot Controller)",
      "LSB for Control 5 (Portamento Time)",
      "LSB for Control 6 (Data Entry)",
      "LSB for Control 7 (Channel Volume)",
      "LSB for Control 8 (Balance)",
      "LSB for Control 9 (Unspecified)",
      "LSB for Control 10 (Pan)",
      "LSB for Control 11 (Expression Controller)",
      "LSB for Control 12 (Effect control 1)",
      "LSB for Control 13 (Effect control 2)",
      "LSB for Control 14 (Unspecified)",
      "LSB for Control 15 (Unspecified)",
      "LSB for Control 16 (General Purpose Controller 1)",
      "LSB for Control 17 (General Purpose Controller 2)",
      "LSB for Control 18 (General Purpose Controller 3)",
      "LSB for Control 19 (General Purpose Controller 4)",
      "LSB for Control 20 (Unspecified)",
      "LSB for Control 21 (Unspecified)",
      "LSB for Control 22 (Unspecified)",
      "LSB for Control 23 (Unspecified)",
      "LSB for Control 24 (Unspecified)",
      "LSB for Control 25 (Unspecified)",
      "LSB for Control 26 (Unspecified)",
      "LSB for Control 27 (Unspecified)",
      "LSB for Control 28 (Unspecified)",
      "LSB for Control 29 (Unspecified)",
      "LSB for Control 30 (Unspecified)",
      "LSB for Control 31 (Unspecified)",
      "Damper Pedal on/off (Sustain) ≤63 off, ≥64 on",
      "Portamento On/Off ≤63 off, ≥64 on",
      "Sostenuto On/Off ≤63 off, ≥64 on",
      "Soft Pedal On/Off ≤63 off, ≥64 on",
      "Legato Footswitch ≤63 Normal, ≥64 Legato",
      "Hold 2 ≤63 off, ≥64 on",
      "Sound Controller 1 (default: Sound Variation)",
      "Sound Controller 2 (default: Timbre/Harmonic Intensity)",
      "Sound Controller 3 (default: Release Time)",
      "Sound Controller 4 (default: Attack Time)",
      "Sound Controller 5 (default: Brightness)",
      "Sound Controller 6 (default: Decay Time)",
      "Sound Controller 7 (default: Vibrato Rate)",
      "Sound Controller 8 (default: Vibrato Depth)",
      "Sound Controller 9 (default: Vibrato Delay)",
      "Sound Controller 10 (default: Unspecified)",
      "General Purpose Controller 5",
      "General Purpose Controller 6",
      "General Purpose Controller 7",
      "General Purpose Controller 8",
      "Portamento Control",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "High Resolution Velocity Prefix",
      "Unspecified",
      "Unspecified",
      "Effects 1 Depth",
      "Effects 2 Depth",
      "Effects 3 Depth",
      "Effects 4 Depth",
      "Effects 5 Depth",
      "Data Increment (Data Entry +1)",
      "Data Decrement (Data Entry -1)",
      "Non-Registered Parameter Number (NRPN) - LSB",
      "Non-Registered Parameter Number (NRPN) - MSB",
      "Registered Parameter Number (RPN) - LSB",
      "Registered Parameter Number (RPN) - MSB",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "Unspecified",
      "[Channel Mode Message] All Sound Off 0",
      "[Channel Mode Message] Reset All Controllers",
      "[Channel Mode Message] Local Control On/Off 0 off, 127 on",
      "[Channel Mode Message] All Notes Off 0",
      "[Channel Mode Message] Omni Mode Off (+ all notes off) 0",
      "[Channel Mode Message] Omni Mode On (+ all notes off) 0",
      "[Channel Mode Message] Mono Mode On (+ poly off, + all notes off)",
      "[Channel Mode Message] Poly Mode On (+ mono off, +all notes off)",
    ][byte1];
  }
}

export class MIDI {
  constructor(onEvent = () => {}) {
    this.inputs = {};
    this.outputs = {};
    this.onEvent = onEvent;
  }

  initialize() {
    return new Promise((resolve, reject) => {
      navigator
        .requestMIDIAccess()
        .then((access) => {
          const inputs = access.inputs.values();
          const outputs = access.outputs.values();

          for (const input of inputs) this.initializeInput(input);
          for (const output of outputs) this.initializeOutput(output);

          access.addEventListener("statechange", ({ port }) => {
            if (port.type === "input") {
              if (port.state === "connected") this.initializeInput(port);
              else this.teardownInput(port);
            } else {
              if (port.state === "connected") this.initializeOutput(port);
              else this.teardownOutput(port);
            }
          });
          resolve();
        })
        .catch(reject);
    });
  }

  notify(message, name) {
    Object.values(this.outputs).forEach((output) => {
      if (output.name === name || !name) output.send(message);
    });
  }

  initializeInput(input) {
    if (this.inputs[input.id]) return;
    this.sendEvent(input);
    this.inputs[input.id] = input;
    input.addEventListener("midimessage", ({ data }) =>
      this.sendEvent(input, data)
    );
  }

  initializeOutput(output) {
    this.sendEvent(output);
    this.outputs[output.id] = output;
  }

  teardownInput(input) {
    if (!this.inputs[input.id]) return;
    this.sendEvent(input);
    delete this.inputs[input.id];
  }

  teardownOutput(output) {
    if (!this.outputs[output.id]) return;
    this.sendEvent(output);
    delete this.outputs[output.id];
  }

  sendEvent(device, data) {
    this.onEvent(new MIDIEvent(device, data));
  }
}
