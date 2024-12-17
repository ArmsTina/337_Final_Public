import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/check-login-status")
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn) {
          setModalMessage("You are already logged in.");
          setShowModal(true);
          setTimeout(() => navigate("/wordle"), 1000);
        }
      });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.trim() !== "" && password.trim() !== "") {
      try {
        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
          setModalMessage(data.message);
          setShowModal(true);
          setTimeout(() => navigate("/wordle"), 1000);
        } else {
          setModalMessage(data.message || "Invalid username or password.");
          setShowModal(true);
        }
      } catch (err) {
        setModalMessage("Error, please try again.");
        setShowModal(true);
      }
    } else {
      setModalMessage("Please fill all fields.");
      setShowModal(true);
    }
  };

  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="login-page">
      <h1>Login Page</h1>
      <div className="login-form">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-group">
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleCreateAccount}>Create Account</button>
        </div>
      </div>
      <div className="help-link">
        <p>
          Need Help? Visit the <Link to="/help">Help Page</Link>.
        </p>
      </div>

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Login</h5>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
