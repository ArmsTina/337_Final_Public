import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const HelpPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="help-page">
      <div className="help-container">
        <h1>Help & How to Use</h1>
        <p>
          Welcome to our gaming website! Here’s a quick guide to get started:
        </p>

        <section>
          <h2>Login and Account Creation</h2>
          <ul>
            <li>
              If you already have an account, enter your username and password
              then click Login.
            </li>
            <li>
              To create an account, click Create Account and fill in your
              details.
            </li>
          </ul>
        </section>

        <section>
          <h2>Playing Wordle</h2>
          <ul>
            <li>Guess the 5-letter word within 6 tries.</li>
            <li>Letters in the correct position are highlighted.</li>
            <li>Click Play Again to start a new game.</li>
          </ul>
        </section>

        <section>
          <h2>Additional Features</h2>
          <ul>
            <li>Visit the Leaderboard page to view top player scores.</li>
            <li>Use the Account Settings page to update your password.</li>
          </ul>
        </section>

        <button className="button-link" onClick={goBack}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default HelpPage;
