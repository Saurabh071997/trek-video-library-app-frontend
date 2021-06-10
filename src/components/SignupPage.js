import './LoginPage.css'
import {Link} from 'react-router-dom'

export const SignupPage = () => {
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
                ></input>
                <label>Email</label>
              </div>
    
              <div className="floating-label ">
                <input
                  className="floating-input floating-input-outlined"
                  type="password"
                  placeholder=" "
                ></input>
                <label>Password</label>
              </div>
            
              <div className="floating-label ">
                <input
                  className="floating-input floating-input-outlined"
                  type="password"
                  placeholder=" "
                ></input>
                <label>Confirm Password</label>
              </div>

              <div className="align-center">
                <div className="page-nav-txt">Already a User?
                    <Link to ='/login'> <span className="page-nav-link">Login </span> </Link>
                </div>

                <button
                  className="btn btn-contained-secondary"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </>
      );
}