import { Square, Stick, BrokenStick } from "./figures.js";

export default class Board {
  constructor(nrow, ncol, defaultColor, activeColor, speedLevel) {
    this.nrow = nrow;
    this.ncol = ncol;
    this.defaultColor = defaultColor;
    this.activeColor = activeColor;
    this.speedLevel = speedLevel;
    this.currentInterval = null;
    this.currentPiece = null;
    this.board = this.createEmptyBoard(); // initializing board with zeros
    this.domBoard = this.createDOMBoard(); // create a DOM object for the board
    this.setupControls();
    this.score = 0;
  }

  createEmptyBoard() {
    let arr = [];
    for (let i = 0; i < this.nrow; i++) {
      let row = new Array(this.ncol).fill(0);
      arr.push(row);
    }
    return arr;
  }

  createDOMBoard() {
    // creating a DOM object for each cell in my matrix with ability to access with data-row and data-col
    let board = document.querySelector(".game__board");

    // Set the grid template columns and rows based on ncol and nrow
    board.style.gridTemplateColumns = `repeat(${this.ncol}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${this.nrow}, 1fr)`;

    for (let i = 0; i < this.nrow; i++) {
      for (let j = 0; j < this.ncol; j++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", i);
        cell.setAttribute("data-col", j);
        cell.style.backgroundColor = this.defaultColor;
        board.appendChild(cell);
      }
    }
    return board;
  }

  getCell(row, col) {
    return document.querySelector(`.game__board .cell[data-row='${row}'][data-col='${col}']`);
  }

  updateCell(row, col) {
    // turning the cell into active cell, by changing its color and status from 0 to 1
    let cell = this.getCell(row, col);
    cell.style.backgroundColor = this.activeColor;
    this.board[row][col] = 1;
  }

  clearCell(row, col) {
    // turning it back to inactive status (from 1 to 0 and from active color to default)
    let cell = this.getCell(row, col);
    // console.log(cell);
    cell.style.backgroundColor = this.defaultColor;
    this.board[row][col] = 0;
  }

  createNewPiece() {
    let randomColumn = this.getRandomColumn();

    if (this.canSpawnNewShape(randomColumn)) {
      this.currentPiece = this.createShape(randomColumn);
      this.drawShape();
      this.movePieceToStop();
    } else {
      this.showGameOver();
    }
  }

  getRandomColumn() {
    return Math.floor(Math.random() * (this.ncol - 1));
  }

  canSpawnNewShape(column) {
    return this.board[0][column] === 0;
  }

  getRandomShape() {
    const shapeTypes = [Square, Stick, BrokenStick];
    return shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
  }

  createShape(column) {
    const PieceType = this.getRandomShape();
    return new PieceType(0, column, this.activeColor);
  }

  drawShape() {
    let cells = this.currentPiece.getCells();
    cells.forEach(([row, col]) => {
      this.updateCell(row, col);
    });
  }

  showGameOver() {
    document.querySelector(".game-over-screen").style.display = "flex";
  }

  moveShapeLeft() {
    if (this.canMoveLeft()) {
      this.clearCurrentShape();
      this.currentPiece.moveLeft();
      this.drawShape();
    }
  }

  canMoveLeft() {
    let leftCells = this.currentPiece.getLeftCells();
    return !leftCells.some(([row, col]) => col <= 0 || this.board[row][col - 1] === 1);
  }

  clearCurrentShape() {
    this.currentPiece.getCells().forEach(([r, c]) => {
      this.clearCell(r, c);
    });
  }

  moveShapeRight() {
    if (this.canMoveRight()) {
      this.clearCurrentShape();
      this.currentPiece.moveRight();
      this.drawShape();
    }
  }
  canMoveRight() {
    let rightCells = this.currentPiece.getRightCells();
    return !rightCells.some(([row, col]) => col >= this.ncol - 1 || this.board[row][col + 1] === 1);
  }

  setupKeyboardControls() {
    document.addEventListener("keydown", (e) => {
      this.handleKeyPress(e);
    });
  }

  setupButtonControls() {
    [".controls__start-button", ".restart-button"].forEach((buttonId) => {
      document.querySelector(buttonId).addEventListener("click", () => {
        this.resetGame();
      });
    });
  }

  handleKeyPress(e) {
    const keyActions = {
      ArrowLeft: () => this.moveShapeLeft(),
      ArrowRight: () => this.moveShapeRight(),
      Shift: () => this.rotatePiece(),
    };

    if (keyActions[e.key]) {
      keyActions[e.key]();
    }
  }

  setupControls() {
    this.setupKeyboardControls();
    this.setupButtonControls();
  }

  movePieceToStop() {
    this.startInterval();
  }

  startInterval() {
    this.currentInterval = setInterval(() => {
      this.handlePieceMovement();
    }, this.speedLevel);
  }

  handlePieceMovement() {
    if (this.willCollide()) {
      this.handleCollision();
    } else {
      this.moveCurrentPieceDown();
    }
  }

  willCollide() {
    let bottomCells = this.currentPiece.getBottomCells();
    return bottomCells.some(([r, c]) => this.stopMove(r + 1, c));
  }

  stopMove(row, col) {
    return row >= this.nrow || this.board[row][col] === 1;
  }

  handleCollision() {
    this.stopInterval();
    this.removeRowIfFilled();
    this.createNewPiece();
  }

  stopInterval() {
    clearInterval(this.currentInterval);
    this.currentInterval = null;
  }

  moveCurrentPieceDown() {
    this.currentPiece.getCells().forEach(([r, c]) => {
      this.clearCell(r, c);
    });
    this.currentPiece.moveDown();
    this.drawShape();
  }

  canRotate() {
    if (!this.currentPiece) {
      return false;
    }

    const newPositions = this.getRotatedPositions();
    return this.isValidRotation(newPositions);
  }

  getRotatedPositions() {
    this.currentPiece.isVertical = !this.currentPiece.isVertical;
    const positions = this.currentPiece.getCells();
    this.currentPiece.isVertical = !this.currentPiece.isVertical;
    return positions;
  }

  isValidRotation(positions) {
    return !positions.some(([row, col]) => this.isOutOfBounds(row, col) || this.hasCollision(row, col));
  }

  isOutOfBounds(row, col) {
    return row < 0 || row >= this.nrow || col < 0 || col >= this.ncol;
  }

  hasCollision(row, col) {
    return this.board[row][col] === 1 && !this.isPartOfCurrentPiece(row, col);
  }

  // Helper method to check if a position is part of current piece
  isPartOfCurrentPiece(row, col) {
    return this.currentPiece.getCells().some(([r, c]) => r === row && c === col);
  }

  rotatePiece() {
    if (this.currentPiece && this.canRotate()) {
      // Only rotate if we can
      this.clearCurrentShape();
      this.currentPiece.rotatePiece();
      this.drawShape();
    }
  }

  // --- Completing the roww
  removeRowIfFilled() {
    for (let row = 0; row < this.board.length; row++) {
      if (this.isRowComplete(row)) {
        this.scoreIt();
        this.collapseWhenComplete(row);
        this.updateVisualBoard();
      }
    }
  }

  scoreIt() {
    this.score++;
    let scoreDom = document.querySelector(".score-points");
    scoreDom.innerText = this.score;
  }

  isRowComplete(row) {
    return this.board[row].every((cell) => cell === 1);
  }

  collapseWhenComplete(row) {
    this.board[row].fill(0);
    this.board = [this.board[row], ...this.board.slice(0, row), ...this.board.slice(row + 1)];
  }

  updateVisualBoard() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 1) {
          this.updateCell(row, col);
        } else {
          this.clearCell(row, col);
        }
      }
    }
  }
  // --- Completing the roww

  resetGame() {
    this.resetIntervals();
    this.resetBoardState();
    this.resetVisualBoard();
    this.hideGameOverScreen();
    this.showGameBoard();
    this.createNewPiece();
  }

  resetIntervals() {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
  }

  resetBoardState() {
    this.board = this.createEmptyBoard();
  }

  resetVisualBoard() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => (cell.style.backgroundColor = this.defaultColor));
  }

  hideGameOverScreen() {
    document.querySelector(".game-over-screen").style.display = "none";
  }

  showGameBoard() {
    this.domBoard.style.display = "grid";
  }
}
