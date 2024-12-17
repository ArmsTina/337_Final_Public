import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const WordlePage = () => {
  const navigate = useNavigate();
  const [gameOver, setGameOver] = useState(false);
  const gridRef = useRef(null);
  let victory = 0;
  let userObj;
  const [word, setWord] = useState(null);
  const [user, setUser] = useState(null);
  const [userArray, setUserArray] = useState(Array(30));
  const [modalMessage, setModalMessage] = useState("");
  const clickDelay = useRef(false);

  function guess(grid, start) {
    let row = "";
    for (let i = start; i < start + 5; i++) {
      row += grid[i].innerText;
    }
    if (row == word.toUpperCase()) return true;
    return false;
  }

  const getGameState = async () => {
    try {
      let status = await fetch("/check-login-status", {
        method: "POST",
      });
      userObj = await status.json();
      if (userObj.loggedIn) {
        setUser(userObj.user.username);
        setWord(userObj.user.word);
        setUserArray(userObj.user.gameState);
        return userObj.user.gameState;
      } else {
        setModalMessage("Please log in or create an account first!");
        setGameOver(true);
        navigate("/");
      }
    } catch (error) {
      setModalMessage("Error, please try again.");
      setGameOver(true);
    }
  };

  useEffect(() => {
    getGameState()
      .then((doc) => start(doc))
      .then((index) => changeIndex(index));
  }, []);

  const [index, changeIndex] = useState(null);

  function start(array) {
    for (let i = 0; i < array.length; i++) {
      if (!array[i]) return i;
    }
  }

  async function hint(grid) {
    let fullWord = word.toUpperCase();
    let letter = grid[index].innerText;
    let col = index % 5;
    if (letter == word[col].toUpperCase()) {
      grid[index].style.backgroundColor = "green";
    } else if (fullWord.indexOf(letter) != -1) {
      grid[index].style.backgroundColor = "yellow";
    }
    return;
  }

  async function cleanGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
      grid[i].style.backgroundColor = "white";
    }
    return;
  }

  const moveMade = async (key) => {
    // If a delay is active, ignore this click
    if (clickDelay.current) {
      return;
    }

    // Set delay state to prevent multiple clicks
    clickDelay.current = true;
    setTimeout(() => {
      clickDelay.current = false;
    }, 500);

    const cells = Array.from(gridRef.current.children);
    let wordleGrid = userArray;

    if (index != null) {
      wordleGrid[index] = key;
      setUserArray(wordleGrid);
      cells[index].innerText = key;
      await hint(cells);
    }

    if ((index + 1) % 5 === 0) {
      let guessStatus = guess(cells, index - 4);
      if (guessStatus) {
        victory++;
        setModalMessage("You won! Congratulations!");
        setGameOver(true);
      } else if (index === 29) {
        setModalMessage("You lost! Better luck next time.");
        setGameOver(true);
      }
    }

    if (index < 29) changeIndex(index + 1);

    try {
      let update = await fetch("/update/user/wordle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, wordleGrid, victory }),
      });
      await fetch("/update-ranking", { method: "PUT" });
      let res = await update.json();
      setWord(res.info.word);
      victory = 0;
      if (!res.info.gameState[0]) {
        startOver();
      } else {
        setUserArray(res.info.gameState);
        changeIndex(start(res.info.gameState));
      }
    } catch (error) {
      setModalMessage("Error, please try again.");
    }
  };

  const handleCloseModal = () => {
    setGameOver(false);
  };

  const startOver = async () => {
    let wordleGrid = Array(30);
    setUserArray(wordleGrid);
    await cleanGrid(Array.from(gridRef.current.children));
    setGameOver(false);
    try {
      let update = await fetch("/update/user/wordle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, wordleGrid, victory }),
      });
      let userInfo = await update.json();
    } catch (error) {
      setModalMessage("Error, please try again.");
    }
    changeIndex(0);
  };

  return (
    <div className="wordle-page">
      <Header />
      <h1>Wordle</h1>
      {gameOver && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Game Over</h5>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={startOver}
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="wordle-grid" ref={gridRef}>
        {Array.from({ length: 6 * 5 }).map((_, index) => (
          <div key={index} className="wordle-cell">
            {userArray[index]}
          </div>
        ))}
      </div>
      <div className="wordle-keyboard">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <div
            key={letter}
            className="wordle-key"
            onClick={() => moveMade(letter)}
          >
            {letter}
          </div>
        ))}
      </div>
      <p id="x"></p>
      <div className="wordle-controls">
        <button className="play-again-button" onClick={startOver}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WordlePage;
