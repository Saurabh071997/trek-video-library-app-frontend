import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "./ToastProvider";
import { API_URL } from "./config";

export const AuthContext = createContext();

function setupAuthHeaderForServiceCalls(token) {
  if (token) {
    delete axios.defaults.headers.common["Authorization"];
    return (axios.defaults.headers.common["Authorization"] = `Bearer ${token}`);
  }
  delete axios.defaults.headers.common["Authorization"];
}

function setupAuthExceptionHandler(logoutUser, navigate, toastDispatch) {
  const UNAUTHORIZED = 401;
  const FORBIDDEN = 403;
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === UNAUTHORIZED) {
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Unauthorised Access" },
        });
        logoutUser();
        navigate("/login");
      } else if (error?.response?.status === FORBIDDEN) {
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "User Session Expired" },
        });
        logoutUser();
        navigate("/login");
      } else if (error?.response?.status === 500) {
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Something went wrong" },
        });
        console.error(error);
        navigate("/error");
      }

      return Promise.reject(error);
    }
  );
}

export const AuthProvider = ({ children }) => {
  const { accessToken: savedToken } = JSON.parse(
    localStorage?.getItem("accessToken")
  ) || { accessToken: null };

  savedToken && setupAuthHeaderForServiceCalls(savedToken);

  const { toastDispatch } = useToast();
  const navigate = useNavigate();

  const [authState, setAuthState] = useState({
    currentUser: null,
    accessToken: savedToken,
    authLoader: false,
  });

  useEffect(() => {
    // authState?.accessToken &&
    setupAuthExceptionHandler(logoutUser, navigate, toastDispatch);
    // eslint-disable-next-line
  }, []);

  async function getUserDetails() {
    try {
      let response = await axios.get(`${API_URL}/user/details`);

      if (response.status === 200) {
        let {
          data: { data },
        } = response;
        setAuthState((authState) => ({ ...authState, currentUser: data }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loginUserWithCredentials(email, password) {
    setAuthState((authState) => ({ ...authState, authLoader: true }));
    try {
      let response = await axios.post(`${API_URL}/login`, {
        usermail: email,
        userpassword: password,
      });

      if (response.status === 200) {
        let {
          data: { loggedInUser, accessToken },
        } = response;

        setupAuthHeaderForServiceCalls(accessToken);

        setAuthState((authState) => ({
          ...authState,
          currentUser: loggedInUser,
          accessToken,
        }));

        localStorage?.setItem("accessToken", JSON.stringify({ accessToken }));
        navigate("/categories");
      }
    } catch (err) {
      if (err?.response?.status === 400 || err?.response?.status === 401) {
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Invalid Credentials" },
        });
      } else {
        console.error(err);
        navigate("/error");
      }
    } finally {
      setAuthState((authState) => ({ ...authState, authLoader: false }));
    }
  }

  async function handleUserSignUp(email, password) {
    setAuthState((authState) => ({ ...authState, authLoader: true }));
    try {
      let response = await axios.post(`${API_URL}/signup`, {
        email: email,
        password: password,
      });

      if (response.status === 201) {
        let {
          data: { newUser, accessToken },
        } = response;

        setupAuthHeaderForServiceCalls(accessToken);
        
        setAuthState((authState) => ({
          ...authState,
          currentUser: newUser,
          accessToken,
        }));

        localStorage?.setItem("accessToken", JSON.stringify({ accessToken }));

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Account Created Successfully" },
        });
        navigate("/categories");
      }
    } catch (err) {
      if (err?.response?.status === 409) {
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "User already exists" },
        });
      } else {
        console.error(err);
        navigate("/error");
      }
    } finally {
      setAuthState((authState) => ({ ...authState, authLoader: false }));
    }
  }

  async function updateUserProfile(firstname, lastname, contact) {
    try {
      let response = await axios.post(`${API_URL}/user/details`, {
        firstname,
        lastname,
        contact,
      });

      if (response.status === 200) {
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Profile Updated" },
        });
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function logoutUser() {
    localStorage?.removeItem("accessToken");

    setAuthState((authState) => ({
      ...authState,
      currentUser: null,
      accessToken: null,
      authLoader: false,
    }));

    setupAuthHeaderForServiceCalls(null);
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        loginUserWithCredentials,
        logoutUser,
        handleUserSignUp,
        getUserDetails,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
