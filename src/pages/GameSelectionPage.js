import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const GameSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="game-selection-page">
      <Header />
      <div className="main-section">
        <h1>Game Selection</h1>
        <div className="game-options">
          <div className="game-card">
            <h2>Connect 4</h2>
            <select>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button onClick={() => navigate("/connect4")}>Play</button>
          </div>
          <div className="game-card">
            <h2>Wordle</h2>
            <select>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button onClick={() => navigate("/wordle")}>Play</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSelectionPage;
