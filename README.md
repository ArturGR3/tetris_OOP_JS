# Tetris OOP JS

## Project Overview

This project is a basic Tetris game implemented in JavaScript with a focus on Object-Oriented Programming (OOP) principles. You can play it [here](https://arturgr3.github.io/tetris_OOP_JS/).

## Features

- **Object-Oriented Design**: The game is structured using classes to represent different game components, such as the board and the various Tetris shapes. Currently it has 3 shapes, but the code is designed to easily add more.
- **Single Responsibility Principle**: Each class and function is designed to handle a specific aspect of the game, making the codebase easier to understand and extend.
- **Responsive Design**: The game interface is styled using viewport units to ensure it looks good on different screen sizes.
- **Interactive Gameplay**: Players can control the Tetris pieces using keyboard inputs, and the game provides visual feedback for actions like moving and rotating pieces.
- **Score Tracking**: The game keeps track of the player's score and displays it on the screen. So far it is a simple counter of lines cleared.
- **Game Over**: The game ends when a piece reaches the top row of the board.

## Code Structure

- **HTML**: The `index.html` file sets up the basic structure of the game interface. It uses semantic tags to make it more accessible.
- **CSS**: The `style.css` file contains styles for the game layout and elements, ensuring a cohesive and responsive design. The board is represented as a grid using CSS grid. The size of the board could be easily changed from JS file and the rest of the functions will work as expected.
- **JavaScript**: The game logic is implemented in several JavaScript files:
  - `src/board.js`: Initializes the game board and manages the piece interactions like moving, rotating, and checking for collisions (bottom, left, right). It also handles the game logic for clearing lines and checking for game over.
  - `src/figures.js`: Defines the different Tetris coordinates and their left, right, and bottom positions. It also defines the shape of its rotated shape.
  - `src/main.js`: Initializes the game and sets up the board.

## Key dynamics of the game

- **Initializing the board**: When initializing the board we define it's active state by having a matrix of 0s and 1s. 0s are the inactive cells and 1s are the active ones. We also create a DOM element for each cell and use it to color the cells when the piece is moving.
- **Next piece**: The next piece is selected randomly from the available shapes and placed at the start of the board on the random column.
- **Movement of the piece**: The piece is moved by changing the coordinates of the piece's cells every x milliseconds. X represents the speed of the game.
- **Checking for collisions**: When checking for collisions we need to check if the piece is moving into a position where it would collide with another piece or the board's border. We do this by checking the matrix of the board and the piece's coordinates. Shapes are defined by their coordinates and the way they are rotated.
- **Left & Right**: When moving left or right we need to check if the piece is moving into a position where it would collide with another piece or the board's border. We do this by checking the matrix of the board and the piece's coordinates. Every shape has a method to return the coordinates of the piece's left/right/bottom cells and when it is rotated.
- **Rotating**: When rotating we need to check if the piece is moving into a position where it would collide with another piece or the board's border. We do this by checking the matrix of the board and the piece's coordinates.
- **Clearing lines**: When clearing lines we need to check if a line is full of 1s. If it is, we need to remove it from the board and move all the lines above it down by one row and add a new row at the top.
- **Game over**: When checking for game over we need to check if the piece has reached the bottom of the board. If it has, we need to end the game.

## Future Improvements

- Implement additional Tetris shapes and features.
- Implement dropping effect with **Arrow Dropdown**.
- Introduce different speed levels and board sizes.
- Add high scoring tracking.
- Add sound effects.
- Show next piece on the right side of the screen.
