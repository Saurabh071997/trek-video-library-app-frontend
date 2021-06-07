import {
    createContext,
    useContext,
    useEffect,
    useReducer
  } from "react";
  import axios from "axios";
  import { ACTIONS, libraryReducer } from "./libraryReducer";

  
export const LibraryContext = createContext();
  
export const LibraryProvider = ({ children }) => {
   
    const [state, dispatch] = useReducer(libraryReducer, {
      categoryList: [],
      videoList: [],
      playlist: [],
      watchLaterVideos: [],
      likedVideos: [],
      selectedCategory: null,
      isLoading: false,
      toastActive: false,
      toastMessage: ""
    });
  
    useEffect(() => {
      (async function () {
        dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
        try {
          let response = await axios.get(
            "https://trek-video-lib.saurabhkamboj.repl.co/categories"
          );
  
          if (response.status === 200) {
            let {
              data: { data: categories }
            } = response;
            dispatch({ TYPE: ACTIONS.SET_CATEGORY, payload: { categories } });
          }
        } catch (err) {
          console.error(err);
        } finally {
          dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
        }
      })();
    }, []);
  
    useEffect(() => {
      (async function () {
        dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
        try {
          let response = await axios.get(
            "https://trek-video-lib.saurabhkamboj.repl.co/videos"
          );
  
          if (response.status === 200) {
            let {
              data: { data: videos }
            } = response;
            dispatch({ TYPE: ACTIONS.SET_VIDEO_LIST, payload: { videos } });
          }
        } catch (err) {
          console.error(err);
        } finally {
          dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
        }
      })();
    }, []);
  
  
  
    return (
      <LibraryContext.Provider
        value={{
          state,
          dispatch
        }}
      >
        {children}
      </LibraryContext.Provider>
    );
}
  
export const useLibrary = () => {
    return useContext(LibraryContext);
}
  