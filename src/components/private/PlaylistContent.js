import { useParams, Link } from "react-router-dom";
import './LikedVideos.css'
import { useLibrary } from "../../context/LibraryProvider";
import { VideoCard } from "../VideoCard";


export const PlaylistContent = () => {
  const { playlistId } = useParams();
  const {
    state: { playlist, videoList }
  } = useLibrary();

  const selectedPlaylist = playlist?.find(({ _id }) => _id === playlistId);

  return (
    <div className="page-layout">
      <div className="page-head">{selectedPlaylist?.__playlistname}</div>
      <div className="page-container">
        {selectedPlaylist?.videoList.map(({ __video }) => {
          const video = videoList?.find(({ _id }) => _id === __video);
          return (
            <Link
              to={`/playlist/${selectedPlaylist?._id}/${video?._id}`}
              key={video?._id}
            >
              <VideoCard video={video} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
