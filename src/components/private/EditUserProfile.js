import { useState, useEffect } from "react";
import "./EditUserProfile.css";
import "./UserProfile.css";
import "../LoginPage.css";
import { useAuth } from "../../context/AuthProvider";
import { useLibrary } from "../../context/LibraryProvider";
import { Loader } from "../Loader";
import mail_icon from "../../images/mail.svg";

export const EditUserProfile = () => {
  const {
    authState: { currentUser },
    updateUserProfile,
  } = useAuth();

  const {
    state: { isLoading },
  } = useLibrary();

  const [profileState, setProfileState] = useState({
    firstname: currentUser?.firstname ? currentUser?.firstname : null,
    lastname: currentUser?.lastname ? currentUser?.lastName : null,
    contact: currentUser?.contact ? currentUser?.contact : null,
  });

  let profile_img =
    "https://mir-s3-cdn-cf.behance.net/project_modules/disp/366be133850498.56ba69ac36858.png";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="profile-block">
      <div className="profile-img">
        <img src={profile_img} className="user-img" alt="profile-img" />
      </div>

      <div className="profile-edit-form">
        <div className="floating-form">
          <div className="floating-label ">
            <input
              className="floating-input floating-input-outlined"
              type="text"
              placeholder={
                currentUser?.firstname ? currentUser?.firstname : " "
              }
              onChange={(e) =>
                setProfileState((profileState) => ({
                  ...profileState,
                  firstname: e.target.value,
                }))
              }
            ></input>
            {currentUser?.firstname ? (
              <label className="label-focus">First Name</label>
            ) : (
              <label>First Name</label>
            )}
          </div>

          <div className="floating-label ">
            <input
              className="floating-input floating-input-outlined"
              type="text"
              placeholder={currentUser?.lastname ? currentUser?.lastname : " "}
              onChange={(e) =>
                setProfileState((profileState) => ({
                  ...profileState,
                  lastname: e.target.value,
                }))
              }
            ></input>
            {currentUser?.lastname ? (
              <label className="label-focus">LastName</label>
            ) : (
              <label>Last Name</label>
            )}
          </div>

          <div className="floating-label ">
            <input
              className="floating-input floating-input-outlined"
              type="text"
              placeholder={currentUser?.contact ? currentUser?.contact : " "}
              onChange={(e) =>
                setProfileState((profileState) => ({
                  ...profileState,
                  contact: e.target.value,
                }))
              }
            ></input>
            {currentUser?.contact ? (
              <label className="label-focus">Contact</label>
            ) : (
              <label>Contact</label>
            )}
          </div>

          <div className="profile-mail" style={{ cursor: "pointer" }}>
            <img src={mail_icon} className="profile-info-img" alt="img" />
            {currentUser?.email}
          </div>
        </div>
      </div>

      <button
        className="btn-save"
        onClick={() => {
          updateUserProfile(
            profileState.firstname,
            profileState.lastname,
            profileState.contact
          );
        }}
      >
        Save
      </button>
    </div>
  );
};
