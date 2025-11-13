import React, { useState } from "react";

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple placeholder password. Change in production.
    if (password === "viaadmin") {
      onLogin();
    } else {
      setError("Incorrect password. Try 'viaadmin' for this demo.");
    }
  };

  return (
    <div className="login-card">
      <h1>Admin Login</h1>
      <p>Enter the admin password to edit menu and allergen data.</p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
        </label>
        {error && <small style={{ color: "#b00020" }}>{error}</small>}
        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
