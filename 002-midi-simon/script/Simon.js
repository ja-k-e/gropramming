export class Simon {
  constructor(matrix) {
    this.matrix = matrix;
    this.reset();
  }

  reset() {
    this.pattern = [];
  }

  step() {
    this.pattern.push(
      this.matrix[Math.floor(Math.random() * this.matrix.length)]
    );
  }

  submit(pattern) {
    const compare = Array.from(this.pattern).slice(0, pattern.length);
    const success = pattern.join("-") === compare.join("-");
    const complete = pattern.length === this.pattern.length;
    return { complete, success };
  }
}
