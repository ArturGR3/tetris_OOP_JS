import { Square, Stick, BrokenStick } from "./figures.js";

export default class Board {
  constructor(nrow, ncol, defaultColor, activeColor, speedLevel) {
    this.nrow = nrow;
    this.ncol = ncol;
    this.defaultColor = defaultColor; // when the cell is not active
    this.activeColor = activeColor; // when the cell is active
    this.speedLevel = speedLevel; // how fast the items are dropping
    this.currentInterval = null; // Track current interval
    this.currentPiece = null;
    this.board = this.createEmptyBoard(); // initializing board with zeros
    this.domBoard = this.createDOMBoard(); // create a DOM object for the board
    this.setupControls();
    this.startRestart();
  }

  createEmptyBoard() {
    // creating a matrix with Os with nrow and ncol
    let arr = [];
    for (let i = 0; i < this.nrow; i++) {
      let row = new Array(this.ncol).fill(0);
      arr.push(row);
    }
    return arr;
  }

  createDOMBoard() {
    // creating a DOM object for each cell in my matrix with ability to access with data-row and data-col
    let board = document.getElementById("board");
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
    return document.querySelector(`#board .cell[data-row='${row}'][data-col='${col}']`);
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
    console.log(cell);
    cell.style.backgroundColor = this.defaultColor;
    this.board[row][col] = 0;
  }

  moveCell(row, col) {
    // moving cell vertically
    this.clearCell(row, col);
    this.updateCell(row + 1, col);
  }

  stopMove(row, col) {
    // if we hit the end of the block or next cell is active
    return row >= this.nrow || this.board[row][col] === 1;
  }

  canSpawnNewPiece(column) {
    // Checks if the new position/spawn is empty
    return this.board[0][column] === 0;
  }
  drawPiece() {
    // Get all cells of the piece (for square, this is 4 positions)
    let cells = this.currentPiece.getCells();

    // Update each cell
    cells.forEach(([row, col]) => {
      this.updateCell(row, col);
    });
  }

  createNewPiece() {
    // creating a new piece
    let randomColumn = Math.floor(Math.random() * (this.ncol - 1)); // create a random column to start (might be changed for a given Piece)

    if (this.canSpawnNewPiece(randomColumn)) {
      //   let pieceType = [Square, Stick, BrokenStick][Math.floor(Math.random() * 3)];
      let pieceType = Square;
      this.currentPiece = new pieceType(0, randomColumn, this.activeColor);
      console.log(this.currentPiece);
      this.drawPiece(); // New method we'll create
      this.movePieceToStop(); // We'll modify this
    } else {
      console.log("Game Over! Top row blocked at column", randomColumn);
      document.getElementById("gameOverScreen").style.display = "flex";
      document.getElementById("startButton").style.display = "none";
    }
  }

  canMoveLeft() {
    let leftCells = this.currentPiece.getLeftCells();
    // Check if any left cell would hit wall or another piece
    return !leftCells.some(([row, col]) => col <= 0 || this.board[row][col - 1] === 1);
  }

  moveLeft() {
    if (this.canMoveLeft()) {
      // Clear all current cells
      this.currentPiece.getCells().forEach(([r, c]) => {
        this.clearCell(r, c);
      });

      // Move piece left
      this.currentPiece.col -= 1;

      // Draw in new position
      this.drawPiece();
    }
  }

  canMoveRight() {
    let rightCells = this.currentPiece.getRightCells();
    // Check if any left cell would hit wall or another piece
    return !rightCells.some(([row, col]) => col >= this.ncol - 1 || this.board[row][col + 1] === 1);
  }

  moveRight() {
    if (this.canMoveRight()) {
      // Clear all current cells
      this.currentPiece.getCells().forEach(([r, c]) => {
        this.clearCell(r, c);
      });

      // Move piece left
      this.currentPiece.col += 1;

      // Draw in new position
      this.drawPiece();
    }
  }

  setupControls() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.moveLeft();
      }
      if (e.key === "ArrowRight") {
        this.moveRight();
      }
    });
  }

  movePieceToStop() {
    this.currentInterval = setInterval(() => {
      // Get bottom cells from the piece itself
      let bottomCells = this.currentPiece.getBottomCells();

      // Check if any bottom cell would hit something in next position
      let willHit = bottomCells.some(([r, c]) => this.stopMove(r + 1, c));

      if (willHit) {
        clearInterval(this.currentInterval);
        this.currentInterval = null;
        this.createNewPiece();
      } else {
        // Clear current position
        this.currentPiece.getCells().forEach(([r, c]) => {
          this.clearCell(r, c);
        });

        // Move piece down
        this.currentPiece.moveDown();

        // Draw in new position
        this.drawPiece();
      }
    }, this.speedLevel);
  }

  startRestart() {
    ["startButton", "restartButton"].forEach((buttonId) => {
      document.getElementById(buttonId).addEventListener("click", () => {
        this.resetGame();
      });
    });
  }

  resetGame() {
    // Clear any running interval
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
    // clear up the board
    this.board = this.createEmptyBoard();

    // find all the cells and change the color to default
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => (cell.style.backgroundColor = this.defaultColor));

    // hide the gameOver screen
    document.getElementById("gameOverScreen").style.display = "none";

    // unhide the main board
    this.domBoard.style.display = "grid";

    // start a new game
    this.createNewPiece();
  }
}
