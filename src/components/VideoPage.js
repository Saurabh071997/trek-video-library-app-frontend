import { Link, useParams, useNavigate } from "react-router-dom"
import { useReducer, useState } from "react"
import "./VideoPage.css"
import "./Modal.css"
import { useWindowSize } from "../context/useWindowSize"
import { useLibrary } from "../context/LibraryProvider"
import { useAuth } from "../context/AuthProvider"
import { Loader } from "./Loader"
import { VideoCard } from "../components/VideoCard"
import watch from "../images/watch_later.svg"
import watch_color_icon from "../images/watch-color.svg"
import wish_icon from "../images/wishlist.svg"
import wish_color_icon from "../images/wish-color.svg"
import lib_icon from "../images/playlist-add.svg"
import cross from "../images/cross-icon.svg"
import cross_color_icon from "../images/cross-color.svg"

export const modalReducer = (state, action) => {
  switch (action.TYPE) {
    case "SHOW_LOGIN_MODAL":
      return { ...state, showLoginModal: true };
    case "HIDE_LOGIN_MODAL":
      return { ...state, showLoginModal: false };
    case "SHOW_PLAYLIST_MODAL":
      return { ...state, showPlaylistModal: true };
    case "HIDE_PLAYLIST_MODAL":
      return { ...state, showPlaylistModal: false };
    default:
      return state;
  }
}

export const VideoOptions = ({ videoId }) => {
  const {
    authState: { userLoggedIn, currentUser }
  } = useAuth();

  const { playlistId } = useParams();
  const navigate = useNavigate();

  const {
    state: { likedVideos, watchLaterVideos, playlist},
    handleAddToLikedVideos,
    handleRemovefromLikedVideos,
    handleAddToWatchLaterVideos,
    handleRemovefromWatchLaterVideos,
    handleAddVideoToPlaylist,
    handleRemoveVideoFromPlaylist
  } = useLibrary();

  const [modalState, modalDispatch] = useReducer(modalReducer, {
    showLoginModal: false,
    showPlaylistModal: false
  });

  const PlaylistModal = () => {
    const [playlistType, setPlaylistType] = useState(null);
    const playlistErrorMsg = "Please select/create a playlist !!";
    const [playlistError, setPlaylistError] = useState(false);
    const errorMsg =
      "Playlist with this name already Exist !! Try something else. ";
    const [showErrorMsg, setErrorMsg] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState({
      playlistId: undefined,
      playlistName: undefined
    });
    return (
      <div className="modal-div">
        <div className="modal-sub-div">
          <div className="modal-head"> Add to Playlist</div>
          <div className="modal-btn-flex">
            <button
              className="modal-btn"
              onClick={() => {
                setPlaylistType("NEW");
                setCurrentPlaylist({
                  ...currentPlaylist,
                  playlistId: undefined,
                  playlistName: undefined
                });
                setPlaylistError(false);
              }}
            >
              Create New
            </button>
            <button
              className="modal-btn"
              onClick={() => {
                setPlaylistType("OLD");
                setCurrentPlaylist({
                  ...currentPlaylist,
                  playlistId: undefined,
                  playlistName: undefined
                });
                setPlaylistError(false);
              }}
            >
              Add to Existing
            </button>
          </div>

          {playlistType === "NEW" && (
            <input
              className="modal-input"
              onChange={(e) => {
                const inputName = e.target.value;
                if (
                  playlist?.find(
                    ({ __playlistname }) => __playlistname === inputName
                  )
                ) {
                  setErrorMsg(true);
                } else {
                  setErrorMsg(false);
                  setCurrentPlaylist({
                    ...currentPlaylist,
                    playlistId: undefined,
                    playlistName: inputName
                  });
                }
              }}
            ></input>
          )}

          {playlistType === "OLD" && (
            <div className="modal-flex-col">
              {playlist?.map(({ _id, __playlistname }) => {
                return (
                  <div key={_id}>
                    <button
                      className="modal-btn-playlist"
                      onClick={() => {
                        setCurrentPlaylist({
                          ...currentPlaylist,
                          playlistId: _id,
                          playlistName: __playlistname
                        });
                      }}
                    >
                      {__playlistname}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {playlistError && (
            <div style={{ color: "red", fontSize: "1rem" }}>
              {playlistErrorMsg}
            </div>
          )}

          {showErrorMsg && (
            <div style={{ color: "red", fontSize: "1rem" }}>{errorMsg}</div>
          )}

          <div className="modal-btn-flex" style={{ marginTop: "1.5rem" }}>
            <button
              className="modal-btn"
              disabled={playlistError || showErrorMsg}
              onClick={() => {
                if (
                  // currentPlaylist.playlistId === undefined ||
                  currentPlaylist.playlistName === undefined
                ) {
                  setPlaylistError(true);
                } else {
                  handleAddVideoToPlaylist({
                    userId: currentUser?._id,
                    playlistId: currentPlaylist?.playlistId,
                    playlistname: currentPlaylist?.playlistName,
                    videoId: videoId
                  });
                  modalDispatch({ TYPE: "HIDE_PLAYLIST_MODAL" });
                }
              }}
            >
              {" "}
              ADD{" "}
            </button>

            <button
              className="modal-btn"
              onClick={() => modalDispatch({ TYPE: "HIDE_PLAYLIST_MODAL" })}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  const LoginModal = () => {
    return (
      <div className="modal-div">
        <div className="modal-sub-div">
          <div
            style={{
              color: "black",
              fontSize: "1.5rem",
              padding: "0.5rem",
              margin: "0rem auto"
            }}
          >
            Login to continue with this action
          </div>
          <Link to="/login">
            <div style={{ textAlign: "center" }}>
              <button
                style={{
                  color: "white",
                  backgroundColor: "black",
                  fontSize: "1.15rem",
                  padding: "0.5rem",
                  margin: "0rem auto",
                  border: "none",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                Login
              </button>
            </div>
          </Link>
          <button
            style={{
              position: "absolute",
              right: "0.5em",
              top: "0.5em",
              border: "none",
              outline: "none",
              cursor: "pointer"
            }}
            onClick={() => modalDispatch({ TYPE: "HIDE_LOGIN_MODAL" })}
          >
            <img
              src={cross}
              alt="img"
              style={{
                height: "1rem",
                width: "1rem"
              }}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {modalState.showLoginModal && <LoginModal />}
      {modalState.showPlaylistModal && <PlaylistModal />}

      <div
        className="card-btn-flex"
        style={{
          position: "absolute",
          right: "0em",
          top: "0em",
          padding: "0rem",
          height: "auto"
        }}
      >
        <button
          type="button"
          title="Add to Playlist"
          className="btn-icon margin-025"
          onClick={() => {
            if (userLoggedIn) {
              modalDispatch({ TYPE: "SHOW_PLAYLIST_MODAL" });
            } else {
              modalDispatch({ TYPE: "SHOW_LOGIN_MODAL" });
            }
          }}
        >
          <img src={lib_icon} className="img25x25" alt="category_icon" />
        </button>

        {userLoggedIn &&
        watchLaterVideos?.find(({ __video }) => __video === videoId) ? (
          <button
            type="button"
            className="btn-icon margin-025"
            title="watch later"
            onClick={() => {
              if (userLoggedIn) {
                handleRemovefromWatchLaterVideos({
                  userId: currentUser?._id,
                  videoId
                });
              } else {
                modalDispatch({ TYPE: "SHOW_LOGIN_MODAL" });
              }
            }}
          >
            <img
              src={watch_color_icon}
              className="img25x25"
              alt="category_icon"
            />
          </button>
        ) : (
          <button
            type="button"
            className="btn-icon margin-025"
            title="watch later"
            onClick={() => {
              if (userLoggedIn) {
                handleAddToWatchLaterVideos({
                  userId: currentUser?._id,
                  videoId
                });
              } else {
                modalDispatch({ TYPE: "SHOW_LOGIN_MODAL" });
              }
            }}
          >
            <img src={watch} className="img25x25" alt="category_icon" />
          </button>
        )}

        {userLoggedIn &&
        likedVideos?.find(({ __video }) => __video === videoId) ? (
          <button
            type="button"
            className="btn-icon margin-025"
            title="liked"
            onClick={() => {
              if (userLoggedIn) {
                handleRemovefromLikedVideos({
                  userId: currentUser?._id,
                  videoId
                });
              } else {
                modalDispatch({ TYPE: "SHOW_LOGIN_MODAL" });
              }
            }}
          >
            <img
              src={wish_color_icon}
              className="img25x25"
              alt="category_icon"
            />
          </button>
        ) : (
          <button
            type="button"
            className="btn-icon margin-025"
            title="liked"
            onClick={() => {
              if (userLoggedIn) {
                handleAddToLikedVideos({ userId: currentUser?._id, videoId });
              } else {
                modalDispatch({ TYPE: "SHOW_LOGIN_MODAL" });
              }
            }}
          >
            <img src={wish_icon} className="img25x25" alt="category_icon" />
          </button>
        )}

        {playlistId && (
          <button
            type="button"
            title="Remove from playlist"
            className="btn-icon margin-025"
            onClick={() => {
              handleRemoveVideoFromPlaylist({
                userId: currentUser?._id,
                playlistId,
                videoId
              });
              navigate(`/playlist/${playlistId}`);
            }}
          >
            <img src={cross_color_icon} alt="img" className="img20x20" />
          </button>
        )}
      </div>
    </>
  );
}

export const VideoContent = ({ video }) => {
  const {
    state: { videoList }
  } = useLibrary();

  const [, width] = useWindowSize();

  return (
    <div className="video-page-block">
      <div className="video-block">
        <iframe
          src={video?.embedUrl}
          title="video-title"
          frameBorder="0"
          showinfo="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          className="video-responsive"
        ></iframe>

        <div className="video-content-block">
          <div className="video-title">{video?.name}</div>

          <div className="display-flex">
            <div className="video-info">{video?.date}</div>
            <VideoOptions videoId={video?._id} />
          </div>

          <div className="video-author">
            <img
              src={video?.authorImgUrl}
              alt="img"
              className="video-author-img"
            />
            <div className="video-author-info">{video?.authorName}</div>
          </div>

          <div className="video-desc">{video?.description}</div>
        </div>
      </div>

      <div className="video-sub-block">
        <div className="video-sub-block-head"> Similar Videos</div>
        <div
          className={
            width <= 600
              ? "video-sub-block-content-x"
              : "video-sub-block-content-y"
          }
        >
          {videoList.map((videoItem) => {
            if (
              videoItem._id !== video?._id &&
              videoItem._category === video?._category
            ) {
              return (
                <Link to={`/video/${videoItem._id}`} key={videoItem._id}>
                  <VideoCard video={videoItem} />
                </Link>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export const VideoPage = () => {
  const { videoId } = useParams();
  const {
    state: { videoList, isLoading }
  } = useLibrary(); 

  const video = videoList?.find(({ _id }) => _id === videoId);

  return  isLoading ? <Loader/> : <VideoContent video={video} />;
}
