import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../Modal.css'
import './Playlist.css'
import { useAuth } from "../../context/AuthProvider";
import { useLibrary } from "../../context/LibraryProvider";
import { ACTIONS } from "../../context/libraryReducer";
// import { Loader } from "../components/Loader";
import plus_icon from "../../images/plus.svg";
import video_icon from "../../images/video.svg";
import cross_color_icon from "../../images/cross-color.svg";

export const Playlist = () => {
  const {
    authState: { currentUser }
  } = useAuth();

  const {
    state: { playlist },
    dispatch,
    handleCreatePlaylist,
    handleRemovePlaylist
  } = useLibrary();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let _playlists = JSON.parse(localStorage?.getItem("playlist"));

    _playlists?.length > 0 &&
      dispatch({ TYPE: ACTIONS.SET_PLAYLIST, payload: { _playlists } });
  }, [dispatch]);

  const PlaylistCreationModal = () => {
    const [newPlaylist, setNewPlayList] = useState(null);
    const errorMsg =
      "Playlist with this name already Exist !! Try something else. ";
    const [showErrorMsg, setErrorMsg] = useState(false);

    return (
      <div className="modal-div">
        <div className="modal-sub-div">
          <div className="modal-head"> Create New Playlist </div>
          <input
            className="modal-input"
            onChange={(e) => {
              const inputName = e.target.value;
              if (
                playlist.find(
                  ({ __playlistname }) => __playlistname === inputName
                )
              ) {
                setErrorMsg(true);
              } else {
                setErrorMsg(false);
                setNewPlayList(inputName);
              }
            }}
          ></input>

          {showErrorMsg && (
            <div style={{ color: "red", fontSize: "1rem" }}>{errorMsg}</div>
          )}

          <div className="modal-btn-flex">
            <button
              disabled={
                showErrorMsg || newPlaylist === null || newPlaylist.length === 0
              }
              className="modal-btn"
              onClick={() => {
                handleCreatePlaylist({
                  userId: currentUser?._id,
                  playlistname: newPlaylist
                });
                setShowModal(false);
              }}
            >
              Create
            </button>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-width">
      {showModal && <PlaylistCreationModal />}
      <div>
        <div className="page-head">PlayLists</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "0ren auto"
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "0.5rem 1rem",
              marginBottom: "1rem"
            }}
          >
            <button className="btn-add" onClick={() => setShowModal(true)}>
              <img src={plus_icon} alt="img" className="btn-img" />
            </button>
            <div className="btn-txt"> Create Playlist </div>
          </div>

          {playlist.map(({ _id, __playlistname }) => {
            return (
              <div key={_id} className="item-playlist">
                <div style={{ display: "flex" }}>
                  <img src={video_icon} alt="img" className="img-play" />

                  <Link to={`/playlist/${_id}`}>
                    <div className="txt-play">{__playlistname}</div>
                  </Link>
                </div>

                <div style={{ display: "flex" }}>
                  <button
                    className="btn-delete"
                    onClick={() => {
                      handleRemovePlaylist({
                        userId: currentUser?._id,
                        playlistId: _id
                      });
                    }}
                  >
                    <img
                      src={cross_color_icon}
                      alt="img"
                      className="img-delete"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
