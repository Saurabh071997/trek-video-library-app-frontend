import { Link, useNavigate } from "react-router-dom";
import "./UserProfile.css";
import { useAuth } from "../../context/AuthProvider";
import { useLibrary } from "../../context/LibraryProvider";
import phone from "../../images/phone-icon.svg";
import mail_icon from "../../images/mail.svg";
import { Loader } from "../Loader";
import { useEffect } from "react";

export const UserProfile = () => {
  const {
    authState: { currentUser },
    logoutUser,
    getUserDetails,
  } = useAuth();

  const {
    state: { isLoading },
  } = useLibrary();

  let profile_img =
    "https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png";

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="profile-block">
      <div className="profile-img">
        <img src={profile_img} className="user-img" alt="profile-img" />
      </div>
      <div className="profile-name">

        {
          currentUser?.firstname ? 
          currentUser?.firstname+" "+currentUser?.lastname 
          : <span className="txt-empty"> -- </span>
        }
      </div>

      <div className="link-edit">
        <Link to='/editprofile' > <span style={{color:"#0284C7"}}>Edit Profile</span></Link>
      </div>

      <hr />

      <div className="profile-contact">
        <img src={phone} className="profile-info-img" alt="img" />
       
        {
          currentUser?.contact ?
          currentUser?.contact : 
          <span className="txt-empty"> -- </span>
        }
      </div>
      <div className="profile-mail">
        <img src={mail_icon} className="profile-info-img" alt="img" />
        {currentUser?.email}
      </div>

      <button
        className="btn-logout"
        onClick={() => {
          logoutUser();
          navigate("/");
        }}
      >
        Log out
      </button>
    </div>
  );
};
