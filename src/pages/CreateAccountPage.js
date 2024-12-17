import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateAccountPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // If the user is logged in, redirect to /games
  useEffect(() => {
    fetch("/check-login-status", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn) {
          setModalMessage("You are already logged in.");
          setShowModal(true);
          setTimeout(() => navigate("/wordle"), 1000);
        }
      });
  }, [navigate]);

  // Sends POST request to the server to create an account
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (username.trim() !== "" && email.trim() !== "") {
      try {
        const response = await fetch("/create-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (data.success) {
          setModalMessage(data.message);
          setShowModal(true);
          setTimeout(() => navigate("/"), 1000);
        } else {
          setModalMessage(data.message);
          setShowModal(true);
        }
      } catch (error) {
        alert("Error, please try again.");
      }
    } else {
      setModalMessage(
        "Please enter a username, email, and password to create an account"
      );
      setShowModal(true); // Show modal if fields are empty
    }
  };

  return (
    <div className="create-account-page">
      <h1>Create Account</h1>
      <div className="create-account-form">
        {/* Sends POST request to the server */}
        <form onSubmit={handleCreateAccount}>
          <label>Username and Email has to be unique.</label>
          <label htmlFor="username">Username:</label>
          <input
            name="username"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="create-account-button">
            Create Account
          </button>
        </form>
        <button
          type="button"
          className="btn btn-secondary mt-3"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        id="errorModal"
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? "block" : "none" }}
        aria-labelledby="errorModalLabel"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="errorModalLabel">
                Information
              </h5>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => setShowModal(false)}
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

export default CreateAccountPage;
