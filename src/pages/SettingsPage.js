import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AccountSettingsPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  // fetches user information to display on the page
  useEffect(() => {
    fetch("/account-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setEmail(data.email);
      });
  }, []);

  const handleSave = () => {
    if (password == newPassword) {
      setShowModal(true); // Show modal if the old password matches the new one
      return;
    }
    // Add logic to save changes to the server
    fetch("/account-settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, newPassword }),
    }).then((res) => {
      if (res.ok) {
        alert("Changes saved successfully!");
        setPassword("");
        setNewPassword("");
      } else {
        alert("Current password does not match.");
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="account-settings-page">
      <Header />
      <div className="settings-container">
        <h1>Account Settings</h1>
        <form className="settings-form">
          <div className="form-group">
            <label>Username:</label>
            <input type="text" value={username} disabled />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} disabled />
          </div>
          <div className="form-group">
            <label>Current Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="settings-buttons">
            <button type="button" onClick={handleSave}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = "/wordle")}
            >
              Cancel
            </button>
          </div>
        </form>
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
              <h5 className="modal-title">Password Error</h5>
            </div>
            <div className="modal-body">
              <p>The new password cannot be the same as the old password.</p>
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

export default AccountSettingsPage;
