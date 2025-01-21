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
}
