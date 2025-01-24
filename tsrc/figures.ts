export type Coordinate = [number, number];

export abstract class Shape {
  constructor(public row: number, public col: number, public color: string, public isVertical: boolean = false) {}

  abstract getBottomCells(): Coordinate[];
  abstract getCells(): Coordinate[];
  abstract getLeftCells(): Coordinate[];
  abstract getRightCells(): Coordinate[];
  abstract rotateFlg(): void;

  moveLeft(): void {
    this.col -= 1;
  }

  moveRight(): void {
    this.col += 1;
  }

  moveDown(): void {
    this.row += 1;
  }
}

export class Square extends Shape {
  getCells(): Coordinate[] {
    return [
      [this.row, this.col],
      [this.row, this.col + 1],
      [this.row + 1, this.col],
      [this.row + 1, this.col + 1],
    ];
  }
  rotateFlg(): void {
    this.isVertical;
  }
  getBottomCells(): Coordinate[] {
    return [
      [this.row + 1, this.col],
      [this.row + 1, this.col + 1],
    ];
  }

  getLeftCells(): Coordinate[] {
    return [
      [this.row, this.col],
      [this.row + 1, this.col],
    ];
  }

  getRightCells(): Coordinate[] {
    return [
      [this.row, this.col + 1],
      [this.row + 1, this.col + 1],
    ];
  }
}

export class Stick extends Shape {
  getCells(): Coordinate[] {
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

  rotateFlg(): void {
    this.isVertical = !this.isVertical;
  }

  getBottomCells(): Coordinate[] {
    return this.isVertical ? [[this.row + 1, this.col]] : this.getCells();
  }

  getLeftCells(): Coordinate[] {
    return this.isVertical
      ? [
          [this.row, this.col],
          [this.row + 1, this.col],
        ]
      : [[this.row, this.col]];
  }

  getRightCells(): Coordinate[] {
    return this.isVertical
      ? [
          [this.row, this.col],
          [this.row + 1, this.col],
        ]
      : [[this.row, this.col + 1]];
  }
}

export class BrokenStick extends Shape {
  getCells(): Coordinate[] {
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

  rotateFlg(): void {
    this.isVertical = !this.isVertical;
  }

  getBottomCells(): Coordinate[] {
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

  getLeftCells(): Coordinate[] {
    return this.isVertical
      ? [
          [this.row, this.col],
          [this.row + 1, this.col],
        ]
      : [[this.row, this.col]];
  }

  getRightCells(): Coordinate[] {
    return this.isVertical
      ? [
          [this.row + 1, this.col + 1],
          [this.row + 2, this.col + 1],
        ]
      : [[this.row + 1, this.col + 2]];
  }
}
