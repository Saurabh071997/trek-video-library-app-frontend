import { createContext, useContext,useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "./ToastProvider";

export const AuthContext = createContext();

function setupAuthHeaderForServiceCalls(token) {

  if (token) {
    delete axios.defaults.headers.common["Authorization"];
    return axios.defaults.headers.common["Authorization"] = `Bearer ${token}` 
  }
  // console.log("deleting token now");
  delete axios.defaults.headers.common["Authorization"];
}

function setupAuthExceptionHandler(logoutUser, navigate, toastDispatch) {
  const UNAUTHORIZED = 401;
  const FORBIDDEN = 403;
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === UNAUTHORIZED) {
        console.log("line 25 exceptionhandler 401 ")
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Unauthorised Access" },
        });
        logoutUser();
        navigate("/login");
      }else if (error?.response?.status === FORBIDDEN) {
        console.log("line 33 exceptionhandler 403 ")
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "User Session Expired" },
        });
        logoutUser();
        navigate("/login");
      }else {
        console.log("line 41 exceptionhandler other error ")
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "NetWork Failure" },
        });
        console.error(error);
        navigate('/error');
      }

      return Promise.reject(error);
    }
  );
}


export const AuthProvider = ({ children }) => {
  const { accessToken: savedToken } = JSON.parse(
    localStorage?.getItem("accessToken")
  ) || { accessToken: null };

  savedToken && setupAuthHeaderForServiceCalls(savedToken)

  // const savedToken = JSON.parse(
  //   localStorage?.getItem("accessToken")
  // ) 


  const { toastDispatch } = useToast();
  const navigate = useNavigate();

  const [authState, setAuthState] = useState({
    currentUser: null,
    accessToken: savedToken,
  });

  useEffect(()=>{
    authState?.accessToken && setupAuthExceptionHandler(logoutUser, navigate, toastDispatch)
    // eslint-disable-next-line
  },[])


  function handleError(err) {
    if (err?.response?.status === 403) {
      toastDispatch({
        TYPE: "TOGGLE_TOAST",
        payload: { toggle: true, message: "User Session Expired" },
      });
      logoutUser();
      navigate("/login");
    } else if (err?.response?.status === 401) {
      toastDispatch({
        TYPE: "TOGGLE_TOAST",
        payload: { toggle: true, message: "Unauthorised Access" },
      });
      logoutUser();
      navigate("/login");
    } else {
      toastDispatch({
        TYPE: "TOGGLE_TOAST",
        payload: { toggle: true, message: "NetWork Failure" },
      });
      console.error(err);
      navigate('/error');
    }
  }

  async function getUserDetails() {
    try {
      // let response = await axios.get(
      //   `https://trek-video-lib-backend.saurabhkamboj.repl.co/user/details`,
      //   { headers: { authorization: `Bearer ${authState.accessToken}` } }
      // );


      let response = await axios.get(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/user/details`
      );

      if (response.status === 200) {
        let {
          data: { data },
        } = response;
        setAuthState((authState) => ({ ...authState, currentUser: data }));
      }
    } catch (err) {
      // handleError(err)
      console.log("now in catch")
      console.log(err?.response)
    }
  }

  async function loginUserWithCredentials(email, password) {
    try {
      let response = await axios.post(
        "https://trek-video-lib-backend.saurabhkamboj.repl.co/login",
        {
          usermail: email,
          userpassword: password,
        }
      );

      if (response.status === 200) {
        let {
          data: { loggedInUser, accessToken },
        } = response;
        
        setupAuthHeaderForServiceCalls(accessToken)
        // setupAuthExceptionHandler(logoutUser, navigate, toastDispatch)

        setAuthState((authState) => ({
          ...authState,
          currentUser: loggedInUser,
          accessToken,
        }));

        console.log({accessToken})
        localStorage?.setItem("accessToken", JSON.stringify({ accessToken }));
        
        navigate("/");
      }
    } catch (err) {
      if (err?.response?.status === 400 || err?.response?.status === 401) {
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Invalid Credentials" },
        });
      } else {
        console.error(err);
        navigate('/error');
      }
    }
  }

  async function handleUserSignUp(email, password) {
    try {
      let response = await axios.post(
        "https://trek-video-lib-backend.saurabhkamboj.repl.co/signup",
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 201) {
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Account Created Successfully" },
        });

        navigate("/login");
      }
    } catch (err) {
      console.log("in signup catch")
      if (err?.response?.status === 409) {
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "User already exists" },
        });
      } else {
        console.error(err);
        navigate('/error');
      }
    }
  }

  async function updateUserProfile(firstname, lastname, contact) {
    try {
      // let response = await axios.post(
      //   `https://trek-video-lib-backend.saurabhkamboj.repl.co/user/details`,
      //   {
      //     firstname,
      //     lastname,
      //     contact,
      //   },
      //   { headers: { authorization: `Bearer ${authState.accessToken}` } }
      // );

      let response = await axios.post(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/user/details`,
        {
          firstname,
          lastname,
          contact,
        }
      );

      if (response.status === 200) {
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Profile Updated" },
        });
        navigate("/profile");
      }
    } catch (err) {
      // handleError(err);
      console.log("now in catch")
      console.log(err?.response)
    }
  }

  async function logoutUser() {
    localStorage?.removeItem("accessToken");

    setAuthState((authState) => ({
      ...authState,
      currentUser: null,
      accessToken: null,
    }));

    setupAuthHeaderForServiceCalls(null)
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        loginUserWithCredentials,
        logoutUser,
        handleUserSignUp,
        getUserDetails,
        handleError,
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
