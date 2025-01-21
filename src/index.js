/// Tetris Game

import Board from "./board.js";

// console.log("Board");
const newBoard = new Board(10, 10, "grey", "red", 10);

// newBoard.domBoard.addEventListener("click", (e) => {
//   //   e.target.style.backgroundColor = "black";
//   newBoard.updateCell(
//     e.target.getAttribute("data-row"),
//     e.target.getAttribute("data-col")
//   );
//   e.target.style.backgroundColor = "black";
// });

document.getElementById("restartButton").addEventListener("click", () => {
  newBoard.resetGame();
});

document.getElementById("startButton").addEventListener("click", () => {
  newBoard.resetGame();
});
// newBoard.moveCellToStop(0, 1, 500);

// newBoard.moveCellToStop(0, 1);
// newBoard.createNewPiece();
