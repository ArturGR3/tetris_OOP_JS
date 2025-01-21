export default class Board {
  constructor(nrow, ncol, defaultColor, activeColor, speedLevel) {
    this.nrow = nrow;
    this.ncol = ncol;
    this.defaultColor = defaultColor; // when the cell is not active
    this.activeColor = activeColor; // when the cell is active
    this.speedLevel = speedLevel; // how fast the items are dropping
    this.currentInterval = null; // Track current interval
    this.board = this.createEmptyBoard(); // initializing board with zeros
    this.domBoard = this.createDOMBoard(); // create a DOM object for the board
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

  createNewPiece() {
    // creating a new piece
    let randomColumn = Math.floor(Math.random() * this.ncol); // create a random column to start

    if (this.canSpawnNewPiece(randomColumn)) {
      this.updateCell(0, randomColumn); // Activate the cell at row 0
      this.moveCellToStop(0, randomColumn);
    } else {
      console.log("Game Over! Top row blocked at column", randomColumn);
      document.getElementById("gameOverScreen").style.display = "flex";
      document.getElementById("startButton").style.display = "none";
    }
  }

  moveCellToStop(row, col) {
    // Clear any existing interval

    this.currentInterval = setInterval(() => {
      if (this.stopMove(row + 1, col)) {
        // if end of the board encountered or active cell encountered
        clearInterval(this.currentInterval); // stop moving objects
        this.currentInterval = null; // reset the interval back to null
        this.createNewPiece(); // create new piece
      } else {
        this.moveCell(row, col);
        row++;
      }
    }, this.speedLevel);
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
