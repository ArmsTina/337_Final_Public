import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../App.css";

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  // gets user information to build leaderboard
  const getScores = async () => {
    try {
      let update = await fetch("/leaderboard", {
        method: "POST",
      });
      let userInfo = await update.json();
      setLeaderboardData(userInfo);
    } catch (error) {
      alert("Error, please try again.");
    }
  };

  useEffect(() => {
    getScores();
    const intervalId = setInterval(getScores, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="leaderboard-page">
      <Header />
      <h1>Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{player.username}</td>
              <td>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="back-to-games">
        <a href="/wordle" className="button-link">
          Back to Wordle
        </a>
      </div>
    </div>
  );
};

export default LeaderboardPage;
