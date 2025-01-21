export default class Piece {
  constructor(row, col, color) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.isVertical = false;
  }

  // Common method that each shape will implement
  getBottomCells() {
    throw new Error("Each shape must implement getBottomCells");
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

export class Square extends Piece {
  getCells() {
    return [
      [this.row, this.col], // top-left
      [this.row, this.col + 1], // top-right
      [this.row + 1, this.col], // bottom-left
      [this.row + 1, this.col + 1], // bottom-right
    ];
  }
  rotatePiece() {
    this.isVertical;
  }
  getBottomCells() {
    // For a square, the bottom cells are the bottom two cells
    return [
      [this.row + 1, this.col], // bottom-left
      [this.row + 1, this.col + 1], // bottom-right
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

export class Stick extends Piece {
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

  rotatePiece() {
    this.isVertical = !this.isVertical;
  }

  getBottomCells() {
    // For a Line, the bottom cells are all cells
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

export class BrokenStick extends Piece {
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

  rotatePiece() {
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
          // [this.row + 1, this.col + 1], // bottom-left
        ];
  }

  getRightCells() {
    return this.isVertical
      ? [
          [this.row + 1, this.col + 1], // middle-right
          [this.row + 2, this.col + 1], // bottom-right
        ]
      : [
          // [this.row, this.col + 1], // top-right
          [this.row + 1, this.col + 2], // bottom-right
        ];
  }
}
