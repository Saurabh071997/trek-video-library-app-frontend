import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { ACTIONS, libraryReducer } from "./libraryReducer";
import { useAuth } from "./AuthProvider";
import { useToast } from "./ToastProvider";
import { API_URL } from "./config";

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const {
    authState: { accessToken },
  } = useAuth();

  const { toastDispatch } = useToast();

  const [state, dispatch] = useReducer(libraryReducer, {
    categoryList: [],
    videoList: [],
    playlist: [],
    watchLaterVideos: [],
    likedVideos: [],
    selectedCategory: null,
    isLoading: false,
  });

  useEffect(() => {
    (async function () {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
      try {
        let response = await axios.get(`${API_URL}/categories`);

        if (response.status === 200) {
          let {
            data: { data: categories },
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
        let response = await axios.get(`${API_URL}/videos`);

        if (response.status === 200) {
          let {
            data: { data: videos },
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
    accessToken && getWatchLaterVideos();
    accessToken && getLikedVideos();
    // eslint-disable-next-line
  }, [accessToken]);

  async function getLikedVideos() {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.get(`${API_URL}/likedvideo/users`);

      if (response.status === 200) {
        let {
          data: { data },
        } = response;
        let { videoList } = data;

        dispatch({
          TYPE: ACTIONS.SET_LIKED_VIDEOS,
          payload: { videoList },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function getWatchLaterVideos() {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.get(`${API_URL}/watchlater/users`);

      if (response.status === 200) {
        let {
          data: { data },
        } = response;
        let { videoList } = data;

        dispatch({
          TYPE: ACTIONS.SET_WATCH_LATER_VIDEOS,
          payload: { videoList },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function getPlaylist() {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.get(`${API_URL}/playlist/users`);

      if (response.status === 200) {
        let {
          data: { data },
        } = response;
        let { _playlists } = data;
        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleAddToLikedVideos({ videoId }) {
    try {
      let response = await axios.post(`${API_URL}/likedvideo/users`, {
        videoId: videoId,
      });

      if (response.status === 201 || response.status === 200) {
        dispatch({ TYPE: ACTIONS.ADD_TO_LIKED_VIDEOS, payload: { videoId } });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Added to liked videos" },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemovefromLikedVideos({ videoId }) {
    try {
      let response = await axios.delete(`${API_URL}/likedvideo/users`, {
        data: {
          videoId: videoId,
        },
      });

      if (response.status === 200) {
        dispatch({
          TYPE: ACTIONS.REMOVE_FROM_LIKED_VIDEOS,
          payload: { videoId },
        });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Removed from liked videos" },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddToWatchLaterVideos({ videoId }) {
    try {
      let response = await axios.post(`${API_URL}/watchlater/users`, {
        videoId: videoId,
      });

      if (response.status === 201 || response.status === 200) {
        dispatch({
          TYPE: ACTIONS.ADD_TO_WATCH_LATER_VIDEOS,
          payload: { videoId },
        });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Added to Watch Later" },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemovefromWatchLaterVideos({ videoId }) {
    try {
      let response = await axios.delete(`${API_URL}/watchlater/users`, {
        data: {
          videoId: videoId,
        },
      });

      if (response.status === 200) {
        dispatch({
          TYPE: ACTIONS.REMOVE_FROM_WATCH_LATER_VIDEOS,
          payload: { videoId },
        });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: "Removed from Watch Later" },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreatePlaylist({ playlistname }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.post(`${API_URL}/playlist/users`, {
        playlistname: playlistname,
        action: "CREATE_PLAYLIST",
      });

      if (response.status === 201) {
        let {
          data: { data },
        } = response;
        let { _playlists } = data;

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: `${playlistname} created` },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleRemovePlaylist({ playlistId }) {
    dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: true } });
    try {
      let response = await axios.delete(`${API_URL}/playlist/users`, {
        data: {
          playlistId: playlistId,
        },
      });

      if (response.status === 200) {
        let {
          data: { data },
        } = response;
        let { _playlists } = data;

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: { toggle: true, message: `playlist deleted successfully` },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ TYPE: ACTIONS.TOGGLE_LOADER, payload: { toggle: false } });
    }
  }

  async function handleAddVideoToPlaylist({
    playlistId,
    playlistname,
    videoId,
  }) {
    try {
      let action =
        playlistId !== undefined ? "ADD_VIDEO" : "CREATE_PLAYLIST_ADD_VIDEO";

      let response = await axios.post(`${API_URL}/playlist/users`, {
        playlistId: playlistId,
        playlistname: playlistname,
        videoId: videoId,
        action: action,
      });

      if (response.status === 200 || response.status === 201) {
        let {
          data: { data },
        } = response;
        let { _playlists } = data;

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: {
            toggle: true,
            message: `Video added to playlist successfully`,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRemoveVideoFromPlaylist({ playlistId, videoId }) {
    try {
      let response = await axios.post(`${API_URL}/playlist/users`, {
        playlistId: playlistId,
        videoId: videoId,
        action: "REMOVE_VIDEO",
      });

      if (response.status === 200) {
        let {
          data: { data },
        } = response;
        let { _playlists } = data;

        dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });

        toastDispatch({
          TYPE: "TOGGLE_TOAST",
          payload: {
            toggle: true,
            message: `Video removed successfully`,
          },
        });
      }
    } catch (err) {
      console.error(err);
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
        handleRemoveVideoFromPlaylist,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  return useContext(LibraryContext);
};
