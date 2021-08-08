import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import "./LikedVideos.css";
import { useLibrary } from "../../context/LibraryProvider";
import { VideoCard } from "../VideoCard";
import { Loader } from "../Loader";

export const PlaylistContent = () => {
  const { playlistId } = useParams();
  const {
    state: { playlist, videoList, isLoading },
    getPlaylist,
  } = useLibrary();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getPlaylist();
    // eslint-disable-next-line
  }, []);

  const selectedPlaylist = playlist?.find(({ _id }) => _id === playlistId);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="page-block-layout">
      <div className="page-head" style={{ color: "#0EA5E9" }}>
        {selectedPlaylist?.__playlistname}
      </div>
      {selectedPlaylist?.videoList?.length > 0 ? (
        <div className="page-block-container">
          {selectedPlaylist?.videoList.map(({ __video }) => {
            const video = videoList?.find(({ _id }) => _id === __video);
            return (
              <div key={__video} className="width300">
                <Link to={`/playlist/${selectedPlaylist?._id}/${video?._id}`}>
                  <VideoCard video={video} />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-container">
          <span style={{ color: "#D4D4D4", fontSize: "2rem" }}>
            {" "}
            No videos available
          </span>
          <Link to="/categories" style={{ textDecoration: "none" }}>
            <div className="btn-empty">Watch videos -&gt;</div>
          </Link>
        </div>
      )}
    </div>
  );
};
