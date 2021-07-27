import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./LoginPage.css";
import { useAuth } from "../context/AuthProvider";

export const LoginPage = () => {
  const {
    authState: { authLoader },
    loginUserWithCredentials,
  } = useAuth();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const guestLogin = () => {
    loginUserWithCredentials("guest@mail.com", "123456789");
  };

  return (
    <>
      <div className="component-head">Login</div>
      <div className="login-block">
        <div className="floating-form">
          <div className="floating-label ">
            <input
              className="floating-input floating-input-outlined"
              type="text"
              placeholder=" "
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <label>Email</label>
          </div>

          <div className="floating-label ">
            <input
              className="floating-input floating-input-outlined"
              type="password"
              placeholder=" "
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <label>Password</label>
          </div>
          <div className="align-center">
            <button
              className={authLoader ? "btn-login btn-disabled" : "btn-login"}
              onClick={() => {
                loginUserWithCredentials(email, password);
              }}
            >
              {authLoader ? (
                <CircularProgress
                  style={{
                    color: "#F1F5F9",
                    height: "1.5rem",
                    width: "1.5rem",
                  }}
                />
              ) : (
                "Login"
              )}
            </button>

            <div
              style={{
                textAlign: "center",
                color: "#3B82F6",
                fontSize: "1.15rem",
              }}
            >
              Or
            </div>

            <button
              className={authLoader ? "btn-login btn-disabled" : "btn-login"}
              onClick={guestLogin}
              style={{ fontSize: "1.15rem" }}
            >
              {authLoader ? (
                <CircularProgress
                  style={{
                    color: "#F1F5F9",
                    height: "1.5rem",
                    width: "1.5rem",
                  }}
                />
              ) : (
                "Login as Guest"
              )}
            </button>

            <div className="page-nav-txt">
              New User?
              <Link to="/signup">
                <span className="page-nav-link">Create Account</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
