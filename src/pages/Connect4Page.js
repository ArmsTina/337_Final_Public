import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Connect4Page = () => {
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    setGameOver(false);
  };

  return (
    <div className="connect4-page">
      <Header />
      <h1>Connect 4</h1>
      <div className="connect4-board">
        {Array.from({ length: 7 * 6 }).map((_, index) => (
          <div key={index} className="connect4-cell" />
        ))}
      </div>
      <div className="connect4-controls">
        <button className="play-again-button" onClick={handlePlayAgain}>
          Play Again
        </button>
        <button>Change Difficulty</button>
      </div>
      {gameOver && (
        <div className="popup">
          <h2>Game Over</h2>
          <button onClick={handlePlayAgain}>New Game</button>
        </div>
      )}
    </div>
  );
};

export default Connect4Page;
