import React, { useState } from "react";
import loginPagePic from "../../assets/images/login.svg";
/* import "../../entry.css"; */
import styles from "./entry.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../api/authApi";

function LoginPage() {
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);

  const [emailorPhone, setEmailorPhone] = useState("");
  const [pass, setPass] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({
        emailOrPhone: emailorPhone,
        password: pass,
      });

      alert("Login successful responses: " + JSON.stringify(result));
      console.log("Login response:", result);
      if (result.success) {
        console.log("Login successful");
        navigate("/chatroom"); // Change '/chatroom' to the correct path for your chatroom route
      } else {
        console.log("Login failed", result.message);
        // Optionally, handle login failure (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error during login", error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  const handleForgotPassword = async (e) => {
    try {
      const result = await authApi.forgotPassword(emailorPhone);
      console.log("Forgot password response:", result);
    } catch (error) {
      console.error("Error during password reset", error);
      // Optionally, handle error (e.g., show an error message)
    }
  };

  return (
    <div>
      <div
        className={`${styles.entry}  d-flex align-items-center justify-content-center`}
      >
        <div
          className={`${styles.container} d-flex flex-column justify-content-center bg-white rounded-4 position-relative`}
        >
          <div className=" row h-100 align-items-center">
            <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center">
              <h1 className={`${styles["entry-heading"]} mb-3`}>
                Chat App <span>Login</span>
              </h1>
              <img
                src={loginPagePic}
                alt="Chat App Logo"
                className={`${styles["entry-img"]}`}
              />
            </div>
            <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center">
              <form
                onSubmit={handleSubmit}
                className={`${styles.login} d-flex flex-column align-items-center`}
              >
                <h6
                  className={`${styles["entry-form-heading"]} text-center mb-3`}
                >
                  Login with Email and Password
                </h6>

                <div className={`${styles["input-box"]} rounded-pill bg-light`}>
                  <div className={`${styles.icon}`}>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter Your Email to Login*"
                    value={emailorPhone}
                    onChange={(e) => setEmailorPhone(e.target.value)}
                  />
                </div>

                <div className={`${styles["input-box"]} rounded-pill bg-light`}>
                  <div className={`${styles.icon}`}>
                    <FontAwesomeIcon icon={faKey} />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    id="password"
                    placeholder="Enter Your Password to Login*"
                    value={pass}
                    autoComplete="current-password"
                    onChange={(e) => {
                      setPass(e.target.value);
                    }}
                  />

                  <button
                    type="button"
                    id="togglePassword"
                    className={`${styles["show-password-btn"]}`}
                  >
                    {!showPass && (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        onClick={() => setShowPass(true)}
                      />
                    )}
                    {showPass && (
                      <FontAwesomeIcon
                        icon={faEye}
                        onClick={() => setShowPass(false)}
                      />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  className="d-block text-white text-start "
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>

                <button
                  type="submit"
                  className={`${styles["submit-btn"]} mt-2 rounded-pill`}
                >
                  Login
                </button>
              </form>
              <div className={`${styles.note} mt-3 text-white`}>
                Don't Have an Account?{" "}
                <a href="/signup" className="text-decoration-underline">
                  Signup
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
