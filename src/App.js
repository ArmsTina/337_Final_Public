import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import GameSelectionPage from "./pages/GameSelectionPage";
import Connect4Page from "./pages/Connect4Page";
import WordlePage from "./pages/WordlePage";
import CreateAccountPage from "./pages/CreateAccountPage";
import HelpPage from "./pages/HelpPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AccountSettingsPage from "./pages/SettingsPage";

//havent connected the end game pop but the page exists
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/games" element={<GameSelectionPage />} />
        <Route path="/connect4" element={<Connect4Page />} />
        <Route path="/wordle" element={<WordlePage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/account-settings" element={<AccountSettingsPage />} />
        {/* If a user try to access to invalid URL, redirect them to LoginPage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
