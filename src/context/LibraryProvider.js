import {
  createContext,
  useContext,
  useEffect,
  useReducer
} from "react";
import axios from "axios";
import { ACTIONS, libraryReducer } from "./libraryReducer";
import { useAuth } from "./AuthProvider";

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const {
    authState: { currentUser }
  } = useAuth();

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

  useEffect(() => {
    async function getLikedVideos() {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
      try {
        let response = await axios.get(
          `https://trek-video-lib.saurabhkamboj.repl.co/likedvideo/${currentUser?._id}`
        );

        if (response.status === 200) {
          let {
            data: { data }
          } = response;
          let { videoList } = data;

          localStorage?.setItem("likedVideos", JSON.stringify(videoList));

          dispatch({
            TYPE: ACTIONS.SET_LIKED_VIDEOS,
            payload: { videoList }
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
      }
    }

    currentUser && getLikedVideos();
  }, [currentUser]);

  useEffect(() => {
    async function getWatchLaterVideos() {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
      try {
        let response = await axios.get(
          `https://trek-video-lib.saurabhkamboj.repl.co/watchlater/${currentUser?._id}`
        );

        if (response.status === 200) {
          let {
            data: { data }
          } = response;
          let { videoList } = data;

          localStorage?.setItem("watchLaterVideos", JSON.stringify(videoList));

          dispatch({
            TYPE: ACTIONS.SET_WATCH_LATER_VIDEOS,
            payload: { videoList }
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
      }
    }

    currentUser && getWatchLaterVideos();
  }, [currentUser]);

  useEffect(() => {
    async function getPlaylist() {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
      try {
        let response = await axios.get(
          `https://trek-video-lib.saurabhkamboj.repl.co/playlist/${currentUser?._id}`
        );
        if (response.status === 200) {
          let {
            data: { data }
          } = response;
          let { _playlists } = data;
          localStorage?.setItem("playlist", JSON.stringify(_playlists));
          dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });
        }
      } catch (err) {
        console.error(err);
      } finally {
        dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
      }
    }

    currentUser && getPlaylist();
  }, [currentUser]);

  async function handleAddToLikedVideos({ userId, videoId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.post(
        `https://trek-video-lib.saurabhkamboj.repl.co/likedvideo/${userId}`,
        {
          videoId: videoId
        }
      );

      if (response.status === 201 || response.status === 200) {
        dispatch({ TYPE: ACTIONS.ADD_TO_LIKED_VIDEOS, payload: { videoId } });

        dispatch({
          TYPE: ACTIONS.TOGGLE_TOAST,
          payload: { toggle: true, message: "Added to liked videos" }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleRemovefromLikedVideos({ userId, videoId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.delete(
        `https://trek-video-lib.saurabhkamboj.repl.co/likedvideo/${userId}`,
        {
          data: {
            videoId: videoId
          }
        }
      );

      if (response.status === 200) {
        dispatch({
          TYPE: ACTIONS.REMOVE_FROM_LIKED_VIDEOS,
          payload: { videoId }
        });

        dispatch({
          TYPE: ACTIONS.TOGGLE_TOAST,
          payload: { toggle: true, message: "Removed from liked videos" }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleAddToWatchLaterVideos({ userId, videoId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.post(
        `https://trek-video-lib.saurabhkamboj.repl.co/watchlater/${userId}`,
        {
          videoId: videoId
        }
      );

      if (response.status === 201 || response.status === 200) {
        dispatch({
          TYPE: ACTIONS.ADD_TO_WATCH_LATER_VIDEOS,
          payload: { videoId }
        });

        dispatch({
          TYPE: ACTIONS.TOGGLE_TOAST,
          payload: { toggle: true, message: "Added to Watch Later" }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleRemovefromWatchLaterVideos({ userId, videoId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.delete(
        `https://trek-video-lib.saurabhkamboj.repl.co/watchlater/${userId}`,
        {
          data: {
            videoId: videoId
          }
        }
      );

      if (response.status === 200) {
        dispatch({
          TYPE: ACTIONS.REMOVE_FROM_WATCH_LATER_VIDEOS,
          payload: { videoId }
        });

        dispatch({
          TYPE: ACTIONS.TOGGLE_TOAST,
          payload: { toggle: true, message: "Removed from Watch Later" }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleCreatePlaylist({ userId, playlistname }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.post(
        `https://trek-video-lib.saurabhkamboj.repl.co/playlist/${userId}`,
        {
          playlistname: playlistname,
          action: "CREATE_PLAYLIST"
        }
      );

      if (response.status === 201) {
        let {
          data: { data }
        } = response;
        let { _playlists } = data;
        localStorage?.setItem("playlist", JSON.stringify(_playlists));

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        dispatch({
          TYPE: ACTIONS.TOGGLE_TOAST,
          payload: { toggle: true, message: `${playlistname} created` }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleRemovePlaylist({ userId, playlistId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.delete(
        `https://trek-video-lib.saurabhkamboj.repl.co/playlist/${userId}`,
        {
          data: {
            playlistId: playlistId
          }
        }
      );

      if (response.status === 200) {
        let {
          data: { data }
        } = response;
        let { _playlists } = data;
        localStorage?.setItem("playlist", JSON.stringify(_playlists));

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        dispatch({
          TYPE: ACTIONS.TOGGLE_TOAST,
          payload: { toggle: true, message: `playlist deleted successfully` }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleAddVideoToPlaylist({
    userId,
    playlistId,
    playlistname,
    videoId
  }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let action =
        playlistId !== undefined ? "ADD_VIDEO" : "CREATE_PLAYLIST_ADD_VIDEO";

      let response = await axios.post(
        `https://trek-video-lib.saurabhkamboj.repl.co/playlist/${userId}`,
        {
          playlistId: playlistId,
          playlistname: playlistname,
          videoId: videoId,
          action: action
        }
      );

      if (response.status === 200 || response.status === 201) {
        let {
          data: { data }
        } = response;
        let { _playlists } = data;

        localStorage?.setItem("playlist", JSON.stringify(_playlists));

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        dispatch({
          TYPE: ACTIONS.TOGGLE_TOAST,
          payload: {
            toggle: true,
            message: `Video added to playlist successfully`
          }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleRemoveVideoFromPlaylist({
    userId,
    playlistId,
    videoId
  }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.post(
        `https://trek-video-lib.saurabhkamboj.repl.co/playlist/${userId}`,
        {
          playlistId: playlistId,
          videoId: videoId,
          action: "REMOVE_VIDEO"
        }
      );

      if (response.status === 200) {
        let {
          data: { data }
        } = response;
        let { _playlists } = data;

        localStorage?.setItem("playlist", JSON.stringify(_playlists));

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        dispatch({
          TYPE: ACTIONS.TOGGLE_TOAST,
          payload: {
            toggle: true,
            message: `Video removed successfully`
          }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  return (
    <LibraryContext.Provider
      value={{
        state,
        dispatch,
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
