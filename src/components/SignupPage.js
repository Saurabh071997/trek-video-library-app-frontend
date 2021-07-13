import "./LoginPage.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";

export const ShowErrorMessage = ({ message }) => {
  return (
    <div
      style={{ color: "#EF4444", margin: "0.5rem auto", fontSize: "1rem" }}
      className="align-center"
    >
      {message}
    </div>
  );
};

export const SignupPage = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const errorTypes = {
    emailFormatError: "emailFormatError",
    passwordMismatchError: "passwordMismatchError",
    passwordLengthError: "passwordLengthError",
    emptyPasswordError: "emptyPasswordError",
  };

  const { handleUserSignUp } = useAuth();

  const validateSignup = async () => {
    let regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regex.test(email)) {
      setError(errorTypes.emailFormatError);
    } else if (!password || !confirmPassword) {
      setError(errorTypes.emptyPasswordError);
    } else if (password !== confirmPassword) {
      setError(errorTypes.passwordMismatchError);
    } else if (
      password &&
      password.length < 8 &&
      confirmPassword &&
      confirmPassword.length < 8
    ) {
      setError(errorTypes.passwordLengthError);
    } else {
      handleUserSignUp(email, password);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="component-head">Create Account</div>
      <div className="login-block">
        <div className="floating-form">
          <div className="floating-label ">
            <input
              className="floating-input floating-input-outlined"
              type="text"
              placeholder=" "
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
            ></input>
            <label>Email</label>
          </div>

          {error === errorTypes.emailFormatError && (
            <ShowErrorMessage message="Email must be of type something@something.com" />
          )}

          <div className="floating-label ">
            <input
              className="floating-input floating-input-outlined"
              type="password"
              placeholder=" "
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
            ></input>
            <label>Password</label>
          </div>

          <div className="floating-label ">
            <input
              className="floating-input floating-input-outlined"
              type="password"
              placeholder=" "
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
              }}
            ></input>
            <label>Confirm Password</label>
          </div>

          {error === errorTypes.emptyPasswordError && (
            <ShowErrorMessage message="Passwords cannot be empty" />
          )}

          {error === errorTypes.passwordMismatchError && (
            <ShowErrorMessage message="Passwords Failed to Match" />
          )}

          {error === errorTypes.passwordLengthError && (
            <ShowErrorMessage message="Password length must be more than 8 characters" />
          )}

          <div className="align-center">
            <div className="page-nav-txt">
              Already a User?
              <Link to="/login">
                {" "}
                <span className="page-nav-link">Login </span>{" "}
              </Link>
            </div>

            <button className="btn-login" onClick={validateSignup}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
