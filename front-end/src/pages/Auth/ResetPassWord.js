// Route: /reset-password/[token]
// File: pages/reset-password/[token].jsx (Next.js App Router) or src/pages/ResetPassword.jsx (React Router)
import styles from "./entry.module.css"; // Adjust the path as necessary

import { useParams, useNavigate } from "react-router-dom"; // or useRouter for Next.js
import { useState } from "react";
import axios from "axios";
import authApi from "../../api/authApi";

const ResetPassword = () => {
  const { token } = useParams(); // or useRouter().query.token for Next.js
  console.log(token);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await authApi.resetPassword(token, password);
      setSuccess("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className={`${styles.resetContainer}`}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
    </div>
  );
};

export default ResetPassword;
