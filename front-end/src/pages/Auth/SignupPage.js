import React, { useState } from "react";
import signup from "../../assets/images/signup.svg";
import styles from "./entry.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faKey,
  faUser,
  faPhoneFlip,
  faLock,
  faCakeCandles,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import authApi from "../../api/authApi";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function SignupPage() {
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [dob, setDob] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState("BD");
  const [countryCode, setCountryCode] = useState("880");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // A simple array of country codes (you can expand it with more countries)
  const countries = getCountries().map((country) => ({
    name: country,
    code: getCountryCallingCode(country),
  }));

  const navigate = useNavigate();

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle country code selection
  const handleCountrySelect = (country, code) => {
    setSelectedCountry(country);
    setCountryCode(code);
    setIsDropdownOpen(false); // Close the dropdown after selecting
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDob((prevDob) => ({
      ...prevDob,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { signup } = authApi;

    if (pass !== confPass) {
      alert("Password is not same!!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", `+${countryCode}${phone}`);
      formData.append("password", pass);
      formData.append("dateOfBirth", `${dob.year}-${dob.month}-${dob.day}`);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const result = await signup(formData);

      if (result.success) {
        await login({
          emailOrPhone: email,
          password: pass,
        });
        console.log("Login successful");
        navigate("/chatroom");
      } else {
        console.log("Login failed", result.message);
      }
    } catch (error) {
      if (error.existingUser) {
        alert("User Already Exist with this email or phone");
      }
      console.error("Error during login", error);
    }
  };

  return (
    <div
      className={`${styles.entry} ${styles.entrySignup} d-flex align-items-center justify-content-center`}
    >
      <div
        className={`${styles.container} d-flex flex-column justify-content-center bg-white rounded-4 position-relative py-4`}
      >
        <div className=" row h-100 align-items-center">
          <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
            <h1 className={`${styles["entry-heading"]} mb-3`}>
              Chat App <span>Signup</span>
            </h1>
            <img src={signup} alt="Chat App Logo" className={`${styles["entry-img"]}`} />
          </div>
          <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
            <form
              onSubmit={handleSubmit}
              className={`${styles.login} d-flex flex-column align-items-center`}
            >
              <h6
                className={`${styles["entry-form-heading"]} text-center mb-3`}
              >
                Signup with Your Info
              </h6>

              <div className={`${styles["input-box"]} rounded-pill bg-light`}>
                <div className={`${styles.icon}`}>
                  <FontAwesomeIcon icon={faUser} />
                  <i className="fa-solid fa-user"></i>
                </div>
                <input
                  type="text"
                  placeholder="Enter Your Username *"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className={`${styles["input-box"]} rounded-pill bg-light`}>
                <div className={`${styles.icon}`}>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <input
                  type="email"
                  placeholder="Enter Your Email *"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>

              <div
                className={`${styles["input-box"]} rounded-pill bg-light position-relative`}
              >
                <div className={`${styles.icon}`}>
                  <FontAwesomeIcon icon={faPhoneFlip} />
                  <i className="fa-solid fa-phone-flip"></i>
                </div>
                <div
                  className={`${styles["country-box"]}`}
                  onClick={toggleDropdown}
                >
                  {selectedCountry} {countryCode} &#11206;{" "}
                  {/* Display the selected country code */}
                </div>

                {/* Dropdown list */}
                {isDropdownOpen && (
                  <div className={`${styles["country-dropdown"]}`}>
                    {countries.map((country) => (
                      <div
                        key={country.code}
                        className={`${styles["country-option"]} mb-2`}
                        onClick={() =>
                          handleCountrySelect(country.name, country.code)
                        }
                      >
                        {country.name} {country.code}
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="number"
                  placeholder="Enter Your Phone *"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className={`${styles["input-box"]} rounded-pill bg-light`}>
                <div className={`${styles.icon}`}>
                  <FontAwesomeIcon icon={faKey} />
                  <i className="fa-solid fa-key"></i>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  placeholder="Enter Your Password *"
                  value={pass}
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

              <div className={`${styles["input-box"]} rounded-pill bg-light`}>
                <div className={`${styles.icon}`}>
                  <FontAwesomeIcon icon={faLock} />
                  <i className="fa-solid fa-lock"></i>
                </div>
                <input
                  type="password"
                  id="password"
                  placeholder="Retype Password *"
                  value={confPass}
                  onChange={(e) => {
                    setConfPass(e.target.value);
                  }}
                />
              </div>

              <div className={`${styles["input-box"]} rounded-pill bg-light`}>
                <div className={`${styles.icon}`}>
                  <FontAwesomeIcon icon={faCakeCandles} />
                  <i className="fa-solid fa-cake-candles"></i>
                </div>
                <input
                  type="text"
                  placeholder="DD"
                  required
                  className={`${styles["dob-day"]}`}
                  name="day"
                  value={dob.day}
                  onChange={handleChange}
                />{" "}
                /
                <input
                  type="text"
                  placeholder="MM"
                  required
                  className={`${styles["dob-month"]}`}
                  name="month"
                  value={dob.month}
                  onChange={handleChange}
                />{" "}
                /
                <input
                  type="text"
                  placeholder="YYYY"
                  required
                  className={`${styles["dob-year"]}`}
                  name="year"
                  value={dob.year}
                  onChange={handleChange}
                />
              </div>

              <div className={`${styles["input-box"]} rounded-pill bg-light`}>
                <div className={`${styles.icon} me-3`}>
                  <FontAwesomeIcon icon={faCamera} />
                  <i className="fa-solid fa-camera"></i>
                </div>
                <input
                  type="file"
                  name="profilePicture"
                  id="profilePicture"
                  placeholder="Choose Profile Picture"
                  className={`${styles["dp-upload"]}`}
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
              </div>

              <button className={`${styles["submit-btn"]} mt-2 rounded-pill`}>
                Signup
              </button>
            </form>
            <div className={`${styles.note} mt-3 text-white`}>
              Already Have an Account?{" "}
              <a href="/login" className="text-decoration-underline">
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
