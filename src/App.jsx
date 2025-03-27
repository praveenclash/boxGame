import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const colors = ["red", "blue", "magenta"];
const initialGrid = [
  ["red", "blue", "magenta"],
  ["magenta", "red", "blue"],
  ["blue", "magenta", "red"]
];

export default function App() {
  const [grid, setGrid] = useState(initialGrid);
  const [draggedColor, setDraggedColor] = useState(null);
  const [draggedRow, setDraggedRow] = useState(null);
  const [draggedCol, setDraggedCol] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !win) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true); // Game over if time reaches 0
    }
  }, [timeLeft, gameOver, win]);

  const handleDragStart = (row, col) => {
    if (gameOver || win) return; // Prevent dragging if game is over
    setDraggedColor(grid[row][col]);
    setDraggedRow(row);
    setDraggedCol(col);
  };

  const handleDrop = (row, col) => {
    if (draggedColor !== null && !gameOver && !win) {
      const newGrid = grid.map((r) => [...r]);
      newGrid[draggedRow][draggedCol] = newGrid[row][col];
      newGrid[row][col] = draggedColor;
      setGrid(newGrid);
      checkWin(newGrid);
    }
  };

  const checkWin = (grid) => {
    let allColumnsMatch = true;

    for (let col = 0; col < grid[0].length; col++) {
      const firstColor = grid[0][col];
      if (!grid.every((row) => row[col] === firstColor)) {
        allColumnsMatch = false;
        break;
      }
    }

    if (allColumnsMatch) {
      setWin(true);
      setTimeLeft(0); // Stop the timer immediately
    }
  };

  const restartGame = () => {
    setGrid(initialGrid);
    setGameOver(false);
    setWin(false);
    setTimeLeft(30);
  };

  return (
    <div className="container text-center mt-4">
      <h2 className="fw-bold">Time Left: {timeLeft} seconds</h2>
      {win ? (
        <>
          <h1 className="text-success fw-bold">You Win!</h1>
          <button onClick={restartGame} className="btn btn-primary mt-3">Restart</button>
        </>
      ) : gameOver ? (
        <>
          <h1 className="text-danger fw-bold">Game Over!</h1>
          <button onClick={restartGame} className="btn btn-primary mt-3">Restart</button>
        </>
      ) : (
        <div className="d-flex flex-column align-items-center mt-3">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="d-flex">
              {row.map((color, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="border border-dark m-1"
                  style={{ width: "60px", height: "60px", backgroundColor: color }}
                  draggable={!gameOver && !win}
                  onDragStart={() => handleDragStart(rowIndex, colIndex)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(rowIndex, colIndex)}
                ></div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
