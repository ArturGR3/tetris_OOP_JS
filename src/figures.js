export default class Piece {
  constructor(row, col, color) {
    this.row = row;
    this.col = col;
    this.color = color;
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
    return [
      [this.row, this.col], // top-left
      [this.row, this.col + 1], // top-right
      // [this.row, this.col + 2], // bottom-left
      // [this.row, this.col + 3], // bottom-right
    ];
  }

  getBottomCells() {
    // For a Line, the bottom cells are all sells
    return this.getCells();
  }
}

export class BrokenStick extends Piece {
  getCells() {
    return [
      [this.row, this.col],
      [this.row + 1, this.col],
      [this.row + 1, this.col + 1],
      [this.row + 2, this.col + 1],
    ];
  }

  getBottomCells() {
    // For a Line, the bottom cells are all sells
    return [
      [this.row + 1, this.col],
      [this.row + 2, this.col + 1],
    ];
  }
}
