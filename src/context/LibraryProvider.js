import {
  createContext,
  useContext,
  useEffect,
  useReducer
} from "react";
import axios from "axios";
import { ACTIONS, libraryReducer } from "./libraryReducer";
import { useAuth } from "./AuthProvider"
import {useToast} from "./ToastProvider"

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {

  const {
    authState: { accessToken }, handleError
  } = useAuth();

  const {toastDispatch} = useToast();

  const [state, dispatch] = useReducer(libraryReducer, {
    categoryList: [],
    videoList: [],
    playlist: [],
    watchLaterVideos: [],
    likedVideos: [],
    selectedCategory: null,
    isLoading: false

  });

  useEffect(() => {
    (async function () {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
      try {
        let response = await axios.get(
          "https://trek-video-lib-backend.saurabhkamboj.repl.co/categories"
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
          "https://trek-video-lib-backend.saurabhkamboj.repl.co/videos"
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

  useEffect(()=>{
    accessToken && getWatchLaterVideos();
    accessToken && getLikedVideos()
    // eslint-disable-next-line
  },[accessToken])

  async function getLikedVideos() {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.get(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/likedvideo/users`,
        {headers:{authorization: `Bearer ${accessToken}`}}
      );

      if (response.status === 200) {
        let {
          data: { data }
        } = response;
        let { videoList } = data;

        // localStorage?.setItem("likedVideos", JSON.stringify(videoList));

        dispatch({
          TYPE: ACTIONS.SET_LIKED_VIDEOS,
          payload: { videoList }
        });
      }
    } catch (err) {
      handleError(err)
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function getWatchLaterVideos() {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.get(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/watchlater/users`,
        {headers:{authorization: `Bearer ${accessToken}`}}
      );

      if (response.status === 200) {
        let {
          data: { data }
        } = response;
        let { videoList } = data;

        // localStorage?.setItem("watchLaterVideos", JSON.stringify(videoList));

        dispatch({
          TYPE: ACTIONS.SET_WATCH_LATER_VIDEOS,
          payload: { videoList }
        });
      }
    } catch (err) {
      handleError(err)
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function getPlaylist() {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.get(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/playlist/users`,
        {headers:{authorization: `Bearer ${accessToken}`}}
      );
      if (response.status === 200) {
        let {
          data: { data }
        } = response;
        let { _playlists } = data;
        // localStorage?.setItem("playlist", JSON.stringify(_playlists));
        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });
      }
    } catch (err) {
      handleError(err);
      
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }


  async function handleAddToLikedVideos({ videoId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.post(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/likedvideo/users`,
        {
          videoId: videoId
        },{headers:{authorization: `Bearer ${accessToken}`}}
      );

      if (response.status === 201 || response.status === 200) {
        dispatch({ TYPE: ACTIONS.ADD_TO_LIKED_VIDEOS, payload: { videoId } });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Added to liked videos" }
        });
      }
    } catch (err) {
      handleError(err)
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleRemovefromLikedVideos({ videoId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.delete(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/likedvideo/users`,
        {
          data: {
            videoId: videoId
          },
          headers:{ authorization: `Bearer ${accessToken}`}
        }
      );

      if (response.status === 200) {
        dispatch({
          TYPE: ACTIONS.REMOVE_FROM_LIKED_VIDEOS,
          payload: { videoId }
        });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Removed from liked videos" }
        });
      }
    } catch (err) {
      handleError(err)
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleAddToWatchLaterVideos({ videoId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.post(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/watchlater/users`,
        { videoId: videoId },
        {headers:{authorization: `Bearer ${accessToken}`}}
      );

      if (response.status === 201 || response.status === 200) {
        dispatch({
          TYPE: ACTIONS.ADD_TO_WATCH_LATER_VIDEOS,
          payload: { videoId }
        });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Added to Watch Later" }
        });
      }
    } catch (err) {
      handleError(err)
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleRemovefromWatchLaterVideos({ videoId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.delete(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/watchlater/users`,
        {
          data: {
            videoId: videoId
          },
          headers:{ authorization: `Bearer ${accessToken}`}
        }
      );

      if (response.status === 200) {
        dispatch({
          TYPE: ACTIONS.REMOVE_FROM_WATCH_LATER_VIDEOS,
          payload: { videoId }
        });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Removed from Watch Later" }
        });
      }
    } catch (err) {
      handleError(err)
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleCreatePlaylist({ playlistname }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.post(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/playlist/users`,
        {
          playlistname: playlistname,
          action: "CREATE_PLAYLIST"
        }, 
        {headers:{authorization: `Bearer ${accessToken}`}}
      );

      if (response.status === 201) {
        let {
          data: { data }
        } = response;
        let { _playlists } = data;
        // localStorage?.setItem("playlist", JSON.stringify(_playlists));

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: `${playlistname} created` }
        });
      }
    } catch (err) {
      handleError(err)
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleRemovePlaylist({ playlistId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.delete(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/playlist/users`,
        {
          data: {
            playlistId: playlistId
          },
          headers:{authorization: `Bearer ${accessToken}`}
        }
      );

      if (response.status === 200) {
        let {
          data: { data }
        } = response;
        let { _playlists } = data;
        // localStorage?.setItem("playlist", JSON.stringify(_playlists));

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: `playlist deleted successfully` }
        });
      }
    } catch (err) {
      handleError(err)
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleAddVideoToPlaylist({
    playlistId,
    playlistname,
    videoId
  }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let action =
        playlistId !== undefined ? "ADD_VIDEO" : "CREATE_PLAYLIST_ADD_VIDEO";

      let response = await axios.post(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/playlist/users`,
        {
          playlistId: playlistId,
          playlistname: playlistname,
          videoId: videoId,
          action: action
        },
        {headers:{authorization: `Bearer ${accessToken}`}}
      );

      if (response.status === 200 || response.status === 201) {
        let {
          data: { data }
        } = response;
        let { _playlists } = data;

        // localStorage?.setItem("playlist", JSON.stringify(_playlists));

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: {
            toggle: true,
            message: `Video added to playlist successfully`
          }
        });
      }
    } catch (err) {
      handleError(err)
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleRemoveVideoFromPlaylist({
    playlistId,
    videoId
  }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.post(
        `https://trek-video-lib-backend.saurabhkamboj.repl.co/playlist/users`,
        {
          playlistId: playlistId,
          videoId: videoId,
          action: "REMOVE_VIDEO"
        },
        {headers:{authorization: `Bearer ${accessToken}`}}
      );

      if (response.status === 200) {
        let {
          data: { data }
        } = response;
        let { _playlists } = data;

        // localStorage?.setItem("playlist", JSON.stringify(_playlists));

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: {
            toggle: true,
            message: `Video removed successfully`
          }
        });
      }
    } catch (err) {
      handleError(err)
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  return (
    <LibraryContext.Provider
      value={{
        state,
        dispatch,
        getLikedVideos,
        getWatchLaterVideos,
        getPlaylist,
        handleAddToLikedVideos,
        handleRemovefromLikedVideos,
        handleAddToWatchLaterVideos,
        handleRemovefromWatchLaterVideos,
        handleCreatePlaylist,
        handleRemovePlaylist,
        handleAddVideoToPlaylist,
        handleRemoveVideoFromPlaylist
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  return useContext(LibraryContext);
}
