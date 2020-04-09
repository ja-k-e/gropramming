import { Game, MATRIX } from "./script/Game.js";

window.game = new Game();

drawMatrix();

function drawMatrix() {
  const rows = [
    [12, 13, 14, 15],
    [8, 9, 10, 11],
    [4, 5, 6, 7],
    [0, 1, 2, 3],
  ];
  const $device = document.getElementById("device");
  rows.forEach((row) => {
    const $row = document.createElement("div");
    $device.appendChild($row);
    row.forEach((index) => {
      const $button = document.createElement("button");
      const matrixValue = MATRIX[index];
      $button.innerText = matrixValue;
      $button.id = `button-${matrixValue}`;
      $row.appendChild($button);
      $button.addEventListener("mousedown", () => {
        game.onPress(matrixValue);
      });
      $button.addEventListener("mouseup", () => {
        game.onRelease(matrixValue);
      });
    });
  });
}
