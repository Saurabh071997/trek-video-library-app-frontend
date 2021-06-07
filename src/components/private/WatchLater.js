import { Link } from "react-router-dom";
import { useEffect } from "react";
import './LikedVideos.css'
import { useLibrary } from "../../context/LibraryProvider";
import { ACTIONS } from "../../context/libraryReducer";
import { VideoCard } from "../VideoCard";
// import { Loader } from "../components/Loader";

export const WatchLater = () => {
  const {
    state: { watchLaterVideos, videoList },
    dispatch
  } = useLibrary();

  useEffect(() => {
    let videoList = JSON.parse(localStorage?.getItem("watchLaterVideos"));

    videoList?.length > 0 &&
      dispatch({
        TYPE: ACTIONS.SET_WATCH_LATER_VIDEOS,
        payload: { videoList }
      });
  }, [dispatch]);

  return (
    <div className="page-layout">
      <div className="page-head">Watch Later</div>
      {watchLaterVideos?.length > 0 ? (
        <div className="page-container">
          {watchLaterVideos.map(({ __video }) => {
            let video = videoList?.find(({ _id }) => _id === __video);
            return (
              <Link to={`/watchlater/${video?._id}`} key={__video}>
                <VideoCard video={video} />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-container">
          <span style={{ color: "#D4D4D4", fontSize: "2rem" }}>
            {" "}
            Nothing here yet{" "}
          </span>
          <Link to="/categories" style={{ textDecoration: "none" }}>
            <div className="btn-empty">Watch videos -&gt;</div>
          </Link>
        </div>
      )}
    </div>
  );
}
