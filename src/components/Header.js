import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        navigate("/");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/wordle" className="nav-link">
              Wordle
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className="nav-link">
              Leaderboard
            </Link>
          </li>
          <li>
            <Link to="/account-settings" className="nav-link">
              Account Settings
            </Link>
          </li>
          <li>
            <Link to="/help" className="nav-link">
              Help
            </Link>
          </li>
          <li
            className="nav-link"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            Logout
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
