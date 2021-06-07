import { useNavigate } from "react-router-dom";
import './UserProfile.css'
import { useAuth } from "../../context/AuthProvider";
import phone from "../../images/phone-icon.svg";
import mail_icon from "../../images/mail.svg";


export const UserProfile = () => {
  const {
    authState: { currentUser },
    logoutUser
  } = useAuth();

  let profile_img =
    "https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png";

  const navigate = useNavigate();

  return (
    <div className="profile-block">
      <div className="profile-img">
        <img src={profile_img} className="user-img" alt="profile-img" />
      </div>
      <div className="profile-name">
        {currentUser?.firstname} {currentUser?.lastname}
      </div>

      <hr />

      <div className="profile-contact">
        <img src={phone} className="profile-info-img" alt="img" />
        {currentUser?.contact}
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
}
