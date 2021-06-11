import { createContext, useContext,  useState } from "react";
import {useNavigate} from 'react-router-dom'
import axios from "axios";
import {useToast} from './ToastProvider'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const { accessToken: savedToken } = JSON.parse(
    localStorage?.getItem("accessToken")
  ) || { accessToken: null };

  const {toastDispatch} = useToast()
  const navigate = useNavigate()

  const [authState, setAuthState] = useState({
    currentUser: null,
    accessToken:savedToken
  });


  async function getUserDetails(){
    try{
      let response = await axios.get(`https://trek-video-lib-backend.saurabhkamboj.repl.co/user/details`,
      {headers:{authorization: `Bearer ${authState.accessToken}`}})

      if(response.status === 200){
        let {data: {data}} = response
        setAuthState(authState=> ({...authState, currentUser: data}))
      }

    }catch(err){
      if(err?.response?.status === 403){
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "User Session Expired" }
        }); 
        logoutUser()
        navigate('/login')
      }else if(err?.response?.status === 401){
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Unauthorised Access" }
        }); 
        logoutUser()
        navigate('/login')
      }else{
        console.error(err)
      }
    }
  }


  async function loginUserWithCredentials(email, password) {
    try {
      let response = await axios.post(
        "https://trek-video-lib-backend.saurabhkamboj.repl.co/login",
        {
          usermail: email,
          userpassword: password
        }
      );

      if (response.status === 200) {
        let {data: {loggedInUser, accessToken}} = response
        setAuthState(authState => ({...authState, currentUser:loggedInUser, accessToken}))
        localStorage?.setItem('accessToken', JSON.stringify({accessToken}))
        navigate('/')
      }

    } catch (err) {
      if(err?.response?.status === 400 || err?.response?.status === 401){
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Invalid Credentials" }
        }); 
      }else{
        console.error(err)
      }

    }
  }

  async function handleUserSignUp(email, password){
    try{
      let response = await axios.post("https://trek-video-lib-backend.saurabhkamboj.repl.co/signup", {
        email:email, 
        password:password
      })

      if(response.status === 201){
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Account Created Successfully" }
        });
        
        navigate('/login')

      }

    }catch(err){
      if(err?.response?.status===409){
        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "User already exists" }
        });
      }else{
        console.error(err)
      }
    }
  }

  async function logoutUser() {
    localStorage?.removeItem("accessToken");

    setAuthState((authState) => ({
      ...authState,
      currentUser: null,
      accessToken:null
    }));
  }

  function handleError(err){
    if(err?.response?.status === 403){
      toastDispatch({
        TYPE: "TOGGLE_TOAST",
        payload: { toggle: true, message: "User Session Expired" }
      }); 
      logoutUser()
      navigate('/login')
    }else if(err?.response?.status === 401){
      toastDispatch({
        TYPE: "TOGGLE_TOAST",
        payload: { toggle: true, message: "Unauthorised Access" }
      }); 
      logoutUser()
      navigate('/login')
    }else{
      console.error(err)
    }
  }

  return (
    <AuthContext.Provider
      value={{ authState, loginUserWithCredentials, logoutUser, handleUserSignUp, getUserDetails, handleError}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = ()=> {
  return useContext(AuthContext);
}

