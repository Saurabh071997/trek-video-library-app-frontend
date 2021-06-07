import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    userLoggedIn: false,
    currentUser: null
  });

  useEffect(() => {
    const loginStatus = JSON.parse(localStorage?.getItem("user"));
    loginStatus?.userLoggedIn &&
      setAuthState((authState) => ({
        ...authState,
        userLoggedIn: true,
        currentUser: loginStatus?.userCredentials
      }));
  }, []);

  async function loginUserWithCredentials(email, password) {
    try {
      let response = await axios.post(
        "https://trek-video-lib.saurabhkamboj.repl.co/login",
        {
          usermail: email,
          userpassword: password
        }
      );

      if (response.status === 201) {
        const {
          data: { userLogin, loggedInUser }
        } = response;

        setAuthState((authState) => ({
          ...authState,
          userLoggedIn: userLogin,
          currentUser: loggedInUser
        }));

        localStorage?.setItem(
          "user",
          JSON.stringify({
            userLoggedIn: true,
            userCredentials: loggedInUser
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function logoutUser() {
    localStorage?.removeItem("user");
    localStorage?.removeItem("playlist");
    localStorage?.removeItem("likedVideos");
    localStorage?.removeItem("watchLaterVideos");

    setAuthState((authState) => ({
      ...authState,
      userLoggedIn: false,
      currentUser: null
    }));
  }

  return (
    <AuthContext.Provider
      value={{ authState, loginUserWithCredentials, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = ()=> {
  return useContext(AuthContext);
}
