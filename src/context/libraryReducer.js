export const ACTIONS = {
    SET_CATEGORY: "SET_CATEGORY",
    SET_VIDEO_LIST: "SET_VIDEO_LIST",
    SET_PLAYLIST: "SET_PLAYLIST",
    SET_LIKED_VIDEOS: "SET_LIKED_VIDEOS",
    SET_WATCH_LATER_VIDEOS: "SET_WATCH_LATER_VIDEOS",
    SELECT_CATEGORY: "SELECT_CATEGORY",
    ADD_TO_LIKED_VIDEOS: "ADD_TO_LIKED_VIDEOS",
    REMOVE_FROM_LIKED_VIDEOS: "REMOVE_FROM_LIKED_VIDEOS",
    ADD_TO_WATCH_LATER_VIDEOS: "ADD_TO_WATCH_LATER_VIDEOS",
    REMOVE_FROM_WATCH_LATER_VIDEOS: "REMOVE_FROM_WATCH_LATER_VIDEOS",
    TOGGLE_LOADER: "TOGGLE_LOADER",
    TOGGLE_TOAST: "TOGGLE_TOAST"
  };
  
  export const libraryReducer = (state, action) => {
    switch (action.TYPE) {
      case "SET_CATEGORY":
        return { ...state, categoryList: action.payload.categories };
  
      case "SET_VIDEO_LIST":
        return { ...state, videoList: action.payload.videos };
  
      case "SELECT_CATEGORY":
        return { ...state, selectedCategory: action.payload.categoryId };
  
      case "SET_PLAYLIST":
        return { ...state, playlist: action.payload._playlists };
  
      case "SET_LIKED_VIDEOS":
        return { ...state, likedVideos: action.payload.videoList };
  
      case "ADD_TO_LIKED_VIDEOS":
        state = {
          ...state,
          likedVideos: [...state.likedVideos, { __video: action.payload.videoId }]
        };
        localStorage?.setItem("likedVideos", JSON.stringify(state.likedVideos));
        return state;
  
      case "REMOVE_FROM_LIKED_VIDEOS":
        state = {
          ...state,
          likedVideos: state.likedVideos.filter(
            // eslint-disable-next-line
            ({ __video }) => __video != action.payload.videoId
          )
        };
  
        localStorage?.setItem("likedVideos", JSON.stringify(state.likedVideos));
        return state;
  
      case "SET_WATCH_LATER_VIDEOS":
        return { ...state, watchLaterVideos: action.payload.videoList };
  
      case "ADD_TO_WATCH_LATER_VIDEOS":
        state = {
          ...state,
          watchLaterVideos: [
            ...state.watchLaterVideos,
            { __video: action.payload.videoId }
          ]
        };
        localStorage?.setItem(
          "watchLaterVideos",
          JSON.stringify(state.watchLaterVideos)
        );
        return state;
  
      case "REMOVE_FROM_WATCH_LATER_VIDEOS":
        state = {
          ...state,
          watchLaterVideos: state.watchLaterVideos.filter(
            // eslint-disable-next-line
            ({ __video }) => __video != action.payload.videoId
          )
        };
        localStorage?.setItem(
          "watchLaterVideos",
          JSON.stringify(state.watchLaterVideos)
        );
        return state;
  
      case "TOGGLE_LOADER":
        return { ...state, isLoading: action.payload.toggle };
  
      case "TOGGLE_TOAST":
        return {
          ...state,
          toastActive: action.payload.toggle,
          toastMessage: action.payload.message
        };
      default:
        return state;
    }
  }
  