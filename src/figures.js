export default class Shape {
  constructor(row, col, color) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.isVertical = false;
  }

  moveLeft() {
    this.col -= 1;
  }

  moveRight() {
    this.col += 1;
  }

  moveDown() {
    this.row += 1;
  }
}

export class Square extends Shape {
  getCells() {
    return [
      [this.row, this.col],
      [this.row, this.col + 1],
      [this.row + 1, this.col],
      [this.row + 1, this.col + 1],
    ];
  }
  rotateFlg() {
    this.isVertical;
  }
  getBottomCells() {
    return [
      [this.row + 1, this.col],
      [this.row + 1, this.col + 1],
    ];
  }

  getLeftCells() {
    return [
      [this.row, this.col],
      [this.row + 1, this.col],
    ];
  }

  getRightCells() {
    return [
      [this.row, this.col + 1],
      [this.row + 1, this.col + 1],
    ];
  }
}

export class Stick extends Shape {
  getCells() {
    return this.isVertical
      ? [
          [this.row, this.col],
          [this.row + 1, this.col],
        ]
      : [
          [this.row, this.col],
          [this.row, this.col + 1],
        ];
  }

  rotateFlg() {
    this.isVertical = !this.isVertical;
  }

  getBottomCells() {
    return this.isVertical ? [[this.row + 1, this.col]] : this.getCells();
  }

  getLeftCells() {
    return this.isVertical
      ? [
          [this.row, this.col],
          [this.row + 1, this.col],
        ]
      : [[this.row, this.col]];
  }

  getRightCells() {
    return this.isVertical
      ? [
          [this.row, this.col],
          [this.row + 1, this.col],
        ]
      : [[this.row, this.col + 1]];
  }
}

export class BrokenStick extends Shape {
  constructor(row, col, color) {
    super(row, col, color);
    this.isVertical = true; // Initial orientation
  }

  getCells() {
    return this.isVertical
      ? [
          [this.row, this.col],
          [this.row + 1, this.col],
          [this.row + 1, this.col + 1],
          [this.row + 2, this.col + 1],
        ]
      : [
          [this.row, this.col],
          [this.row, this.col + 1],
          [this.row + 1, this.col + 1],
          [this.row + 1, this.col + 2],
        ];
  }

  rotateFlg() {
    this.isVertical = !this.isVertical;
  }

  getBottomCells() {
    return this.isVertical
      ? [
          [this.row + 1, this.col],
          [this.row + 2, this.col + 1],
        ]
      : [
          [this.row + 1, this.col + 1],
          [this.row + 1, this.col + 2],
        ];
  }

  getLeftCells() {
    return this.isVertical
      ? [
          [this.row, this.col], // top-left
          [this.row + 1, this.col], // middle-left
        ]
      : [
          [this.row, this.col], // top-left
        ];
  }

  getRightCells() {
    return this.isVertical
      ? [
          [this.row + 1, this.col + 1], // middle-right
          [this.row + 2, this.col + 1], // bottom-right
        ]
      : [
          [this.row + 1, this.col + 2], // bottom-right
        ];
  }
}
