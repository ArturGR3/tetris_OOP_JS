import { Shape, Square, Stick, BrokenStick, Coordinate } from "./figures";

type BoardGrid = number[][];

export default class Board {
  private currentInterval: number | null;
  private currentPiece: Shape | null;
  private board: BoardGrid;
  private domBoard: HTMLElement;
  private score: number;

  constructor(private nrow: number, private ncol: number, private defaultColor: string, private activeColor: string, private speedLevel: number) {
    this.currentInterval = null;
    this.score = 0;
    this.currentPiece = null;
    this.board = this.createEmptyBoard();
    this.domBoard = this.createDOMBoard();
    this.setupControls();
  }

  // --- Board Initialization
  createEmptyBoard(): BoardGrid {
    let arr = [];
    for (let i = 0; i < this.nrow; i++) {
      let row = new Array(this.ncol).fill(0);
      arr.push(row);
    }
    return arr;
  }

  createDOMBoard(): HTMLElement {
    let board: HTMLElement | null = document.querySelector(".game__board");

    if (!board) {
      throw new Error("Board element not found");
    }

    board.style.gridTemplateColumns = `repeat(${this.ncol}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${this.nrow}, 1fr)`;

    for (let i = 0; i < this.nrow; i++) {
      for (let j = 0; j < this.ncol; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", i.toString());
        cell.setAttribute("data-col", j.toString());
        cell.style.backgroundColor = this.defaultColor;
        board.appendChild(cell);
      }
    }
    return board;
  }

  createNewPiece(): void {
    let randomColumn: number = this.getRandomColumn();

    if (this.canSpawnNewShape(randomColumn)) {
      this.currentPiece = this.createRandomShape(randomColumn);
      this.drawShape();
      this.movePieceToStop();
    } else {
      this.showGameOver();
    }
  }

  moveShapeLeft(): void {
    if (this.canMoveLeft() && this.currentPiece) {
      this.clearCurrentShape();
      this.currentPiece.moveLeft();
      this.drawShape();
    }
  }

  moveShapeRight(): void {
    if (this.canMoveRight() && this.currentPiece) {
      this.clearCurrentShape();
      this.currentPiece.moveRight();
      this.drawShape();
    }
  }

  moveCurrentShapeDown(): void {
    if (this.currentPiece) {
      this.currentPiece.getCells().forEach(([r, c]) => {
        this.clearCell(r, c);
      });
      this.currentPiece.moveDown();
      this.drawShape();
    }
  }

  rotateShape(): void {
    if (this.currentPiece && this.canRotate()) {
      this.clearCurrentShape();
      this.currentPiece.rotateFlg();
      this.drawShape();
    }
  }

  handlePieceMovement(): void {
    if (this.willCollide()) {
      this.handleCollision();
    } else {
      this.moveCurrentShapeDown();
    }
  }

  willCollide(): boolean {
    if (this.currentPiece) {
      let bottomCells: [number, number][] = this.currentPiece.getBottomCells();
      return bottomCells.some(([r, c]) => this.stopMove(r + 1, c));
    }
    return false;
  }

  handleCollision(): void {
    this.stopInterval();
    this.removeRowIfFilled();
    this.createNewPiece();
  }

  removeRowIfFilled(): void {
    for (let row = 0; row < this.board.length; row++) {
      if (this.isRowComplete(row)) {
        this.scoreIt();
        this.collapseWhenComplete(row);
        this.updateVisualBoard();
      }
    }
  }

  resetGame(): void {
    this.resetIntervals();
    this.resetBoardState();
    this.resetVisualBoard();
    this.hideGameOverScreen();
    this.showGameBoard();
    this.createNewPiece();
  }

  getCell(row: number, col: number): HTMLElement {
    const cell = document.querySelector(`.game__board .cell[data-row='${row}'][data-col='${col}']`) as HTMLElement;
    if (!cell) {
      throw new Error(`Cell at row ${row}, col ${col} not found`);
    }
    return cell;
  }

  activateCell(row: number, col: number): void {
    let cell = this.getCell(row, col);
    cell.style.backgroundColor = this.activeColor;
    this.board[row][col] = 1;
  }

  clearCell(row: number, col: number): void {
    let cell = this.getCell(row, col);
    cell.style.backgroundColor = this.defaultColor;
    this.board[row][col] = 0;
  }

  getRandomColumn(): number {
    return Math.floor(Math.random() * (this.ncol - 1));
  }

  canSpawnNewShape(column: number): boolean {
    return this.board[0][column] === 0;
  }

  createRandomShape(column: number): Shape {
    const shapeTypes = [Square, Stick, BrokenStick];
    const RandomShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    return new RandomShape(0, column, this.activeColor);
  }

  drawShape(): void {
    if (this.currentPiece) {
      let cells = this.currentPiece.getCells();
      cells.forEach(([row, col]) => {
        this.activateCell(row, col);
      });
    }
  }

  showGameOver() {
    const gameOverScreen = document.querySelector(".game-over-screen") as HTMLElement | null;
    if (gameOverScreen) {
      gameOverScreen.style.display = "flex";
    }
  }

  canMoveLeft(): boolean {
    if (this.currentPiece) {
      let leftCells = this.currentPiece.getLeftCells();
      return !leftCells.some(([row, col]) => col <= 0 || this.board[row][col - 1] === 1);
    }
    return false;
  }

  clearCurrentShape(): void {
    if (this.currentPiece) {
      this.currentPiece.getCells().forEach(([r, c]) => {
        this.clearCell(r, c);
      });
    }
  }

  canMoveRight(): boolean {
    if (this.currentPiece) {
      let rightCells = this.currentPiece.getRightCells();
      return !rightCells.some(([row, col]) => col >= this.ncol - 1 || this.board[row][col + 1] === 1);
    }
    return false;
  }

  setupKeyboardControls(): void {
    document.addEventListener("keydown", (e) => {
      this.handleKeyPress(e);
    });
  }

  setupButtonControls(): void {
    [".controls__start-button", ".restart-button"].forEach((buttonId) => {
      const button = document.querySelector(buttonId);
      if (button) {
        button.addEventListener("click", () => {
          this.resetGame();
        });
      }
    });
  }

  handleKeyPress(e: KeyboardEvent): void {
    const keyActions: { [key: string]: () => void } = {
      ArrowLeft: () => this.moveShapeLeft(),
      ArrowRight: () => this.moveShapeRight(),
      Shift: () => this.rotateShape(),
    };

    if (keyActions[e.key]) {
      keyActions[e.key]();
    }
  }

  setupControls(): void {
    this.setupKeyboardControls();
    this.setupButtonControls();
  }

  movePieceToStop(): void {
    this.startInterval();
  }

  startInterval(): void {
    this.currentInterval = setInterval(() => {
      this.handlePieceMovement();
    }, this.speedLevel);
  }

  stopMove(row: number, col: number) {
    return row >= this.nrow || this.board[row][col] === 1;
  }

  stopInterval(): void {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
  }

  canRotate(): boolean {
    if (!this.currentPiece) {
      return false;
    }

    const newPositions: Coordinate[] = this.getRotatedPositions();
    return this.isValidRotation(newPositions);
  }

  getRotatedPositions(): Coordinate[] {
    if (this.currentPiece) {
      this.currentPiece.isVertical = !this.currentPiece.isVertical;
      const positions = this.currentPiece.getCells();
      this.currentPiece.isVertical = !this.currentPiece.isVertical;
      return positions;
    }
    return [];
  }

  isValidRotation(positions: Coordinate[]): boolean {
    return !positions.some(([row, col]) => this.isOutOfBounds(row, col) || this.hasCollision(row, col));
  }

  isOutOfBounds(row: number, col: number): boolean {
    return row < 0 || row >= this.nrow || col < 0 || col >= this.ncol;
  }

  hasCollision(row: number, col: number): boolean {
    return this.board[row][col] === 1 && !this.isPartOfCurrentPiece(row, col);
  }

  isPartOfCurrentPiece(row: number, col: number): boolean {
    if (this.currentPiece) {
      return this.currentPiece.getCells().some(([r, c]) => r === row && c === col);
    }
    return false;
  }

  scoreIt(): void {
    this.score++;
    let scoreDom = document.querySelector(".score-points") as HTMLElement | null;
    if (scoreDom) {
      scoreDom.innerText = this.score.toString();
    }
  }

  isRowComplete(row: number): boolean {
    return this.board[row].every((cell) => cell === 1);
  }

  collapseWhenComplete(row: number): void {
    this.board[row].fill(0);
    this.board = [this.board[row], ...this.board.slice(0, row), ...this.board.slice(row + 1)];
  }

  updateVisualBoard(): void {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 1) {
          this.activateCell(row, col);
        } else {
          this.clearCell(row, col);
        }
      }
    }
  }

  resetIntervals(): void {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
  }

  resetBoardState(): void {
    this.board = this.createEmptyBoard();
  }

  resetVisualBoard() {
    const cells = document.querySelectorAll<HTMLElement>(".cell");
    cells.forEach((cell) => (cell.style.backgroundColor = this.defaultColor));
  }

  hideGameOverScreen() {
    const gameOver = document.querySelector(".game-over-screen") as HTMLElement | null;
    if (gameOver) {
      gameOver.style.display = "none";
    }
  }

  showGameBoard() {
    this.domBoard.style.display = "grid";
  }
}
