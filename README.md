# Tetris OOP JS

## Project Overview

This project is a minimalist Tetris game implemented in JavaScript with a focus on Object-Oriented Programming (OOP) principles.

## Features

- **Object-Oriented Design**: The game is structured using classes to represent different game components, such as the board and the various Tetris shapes.
- **Single Responsibility Principle**: Each class and function is designed to handle a specific aspect of the game, making the codebase easier to understand and extend.
- **Responsive Design**: The game interface is styled using CSS to ensure it looks good on different screen sizes.
- **Interactive Gameplay**: Players can control the Tetris pieces using keyboard inputs, and the game provides visual feedback for actions like moving and rotating pieces.

## Code Structure

- **HTML**: The `index.html` file sets up the basic structure of the game interface.
- **CSS**: The `style.css` file contains styles for the game layout and elements, ensuring a cohesive and responsive design.
- **JavaScript**: The game logic is implemented in several JavaScript files:
  - `src/board.js`: Manages the game board and piece interactions.
  - `src/figures.js`: Defines the different Tetris shapes and their behaviors.
  - `src/main.js`: Initializes the game and sets up the board.

## Getting Started

To run the game locally, follow these steps:

1. Clone the repository to your local machine.
2. Open the `index.html` file in a web browser.
3. Use the keyboard controls to start playing:
   - **Arrow Left**: Move piece left
   - **Arrow Right**: Move piece right
   - **Shift**: Rotate piece

## Future Improvements

- Implement additional Tetris shapes and features.
- Implement dropping effect with **Arrow Drop**.
- Introduce different speed levels.
- Add high scoring tracking.

## Acknowledgments

This project was inspired by the classic Tetris game and serves as a practice in applying OOP principles and web development skills.
