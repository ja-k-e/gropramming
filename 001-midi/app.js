import { MIDI } from "./script/MIDI.js";

// Uncomment the log on line 23 to figure out these values for yourself.
const KNOB = 9;
const PAD = 48;
const DEVICE = "MPD218 Port A";

let ratio = 1;
let on = false;
const $text = document.getElementById("text");

const midi = new MIDI(handleEvent);
midi.initialize().then(() => {
  console.log("initialized!");
  draw();
  animate();
  notify();
  // This is the fun pad pattern. Replace with an array of your own pad numbers!
  // notifyAnimation([48, 49, 50, 51, 47, 43, 39, 38, 37, 36, 40, 44]);
});

function handleEvent(event) {
  // Uncomment this to see every event from every controller
  // console.log(event);
  const { device, type, a, b } = event;

  if (device.name !== DEVICE) return;
  if (type === "mode_change" && a.value === KNOB) {
    ratio = b.ratio;
  } else if (type === "note_on" && a.value === PAD) {
    on = true;
  } else if (type === "note_off" && a.value === PAD) {
    on = false;
  } else if (type === "aftertouch" && on) {
    ratio = a.ratio;
  }
}

function animate() {
  requestAnimationFrame(animate);
  $text.style.setProperty("--ratio", ratio);
}

function draw() {
  $text.innerHTML = `
    <div><span>${"gro".split("").join("</span><span>")}</span></div>
    <div><span>${"pramming!".split("").join("</span><span>")}</span></div>
  `;
}

function notify() {
  const loop = () => {
    const noteOff = 128;
    const noteOn = 144;
    if (!on) midi.notify([noteOn, PAD, 127], DEVICE);
    setTimeout(() => {
      if (!on) midi.notify([noteOff, PAD, 0], DEVICE);
    }, 100);
  };
  setInterval(loop, 200);
}

// function notifyAnimation(steps) {
//   const noteOff = 128;
//   const noteOn = 144;
//   const outputs = Object.values(midi.outputs);
//   outputs.forEach((output) => {
//     const loop = (steps, index) => {
//       const note = steps[index % steps.length];
//       output.send([noteOn, note, 127]);
//       setTimeout(() => output.send([noteOff, note, 127]), 100);
//       setTimeout(() => loop(steps, index + 1), 100);
//     };
//     loop(steps, 0);
//   });
// }
