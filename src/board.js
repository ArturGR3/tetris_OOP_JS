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
    this.setupControls(); // Setup keys strokes
    this.score = 0;
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
    // console.log(cell);
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
      let pieceType = [Square, Stick, BrokenStick][Math.floor(Math.random() * 3)];
      this.currentPiece = new pieceType(0, randomColumn, this.activeColor);
      this.drawPiece();
      this.movePieceToStop();
    } else {
      document.getElementById("game-over-screen").style.display = "flex";
    }
  }

  canMoveLeft() {
    let leftCells = this.currentPiece.getLeftCells();
    // Check if any left cell would hit wall or another piece
    return !leftCells.some(
      ([row, col]) =>
        col <= 0 || // boarder check
        this.board[row][col - 1] === 1 // occupied check
    );
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
    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.moveLeft();
          break;
        case "ArrowRight":
          this.moveRight();
          break;
        case "Shift":
          this.rotatePiece();
          break;
      }
    });

    // Button controls
    ["start-button", "restart-button"].forEach((buttonId) => {
      document.getElementById(buttonId).addEventListener("click", () => {
        this.resetGame();
      });
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
        this.removeRowIfFilled();
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

  canRotate() {
    if (!this.currentPiece) return false;

    // Check potential new positions
    this.currentPiece.isVertical = !this.currentPiece.isVertical;
    const newPositions = this.currentPiece.getCells();
    this.currentPiece.isVertical = !this.currentPiece.isVertical;

    // Only check for boundaries and collisions with other pieces
    return !newPositions.some(
      ([row, col]) =>
        row < 0 || row >= this.nrow || col < 0 || col >= this.ncol || (this.board[row][col] === 1 && !this.isPartOfCurrentPiece(row, col))
    );
  }

  // Helper method to check if a position is part of current piece
  isPartOfCurrentPiece(row, col) {
    return this.currentPiece.getCells().some(([r, c]) => r === row && c === col);
  }

  rotatePiece() {
    console.log(this.canRotate());
    if (this.currentPiece && this.canRotate()) {
      // Only rotate if we can
      this.currentPiece.getCells().forEach(([r, c]) => {
        this.clearCell(r, c);
      });
      this.currentPiece.rotatePiece();
      this.drawPiece();
    }
  }

  scoring() {
    this.score++;
    let scoreDom = document.getElementById("score-points");
    scoreDom.innerText = this.score;
  }

  removeRowIfFilled() {
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i].every((cell) => cell === 1)) {
        // full row completion
        this.scoring();
        this.board[i].fill(0);
        this.board = [this.board[i], ...this.board.slice(0, i), ...this.board.slice(i + 1)];

        // Now update all cells visually to match the new board state
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
    }
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
    document.getElementById("game-over-screen").style.display = "none";

    // unhide the main board
    this.domBoard.style.display = "grid";

    // start a new game
    this.createNewPiece();
  }
}
