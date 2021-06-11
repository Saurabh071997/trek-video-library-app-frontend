import { useParams, Link } from "react-router-dom"
import {useEffect} from 'react'
import "./LikedVideos.css"
import { useLibrary } from "../../context/LibraryProvider"
import { VideoCard } from "../VideoCard"
import {Loader} from "../Loader"


export const PlaylistContent = () => {
  const { playlistId } = useParams();
  const {
    state: { playlist, videoList, isLoading },
    getPlaylist
  } = useLibrary();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(()=>{
    getPlaylist();
   // eslint-disable-next-line
  },[])

  const selectedPlaylist = playlist?.find(({ _id }) => _id === playlistId);

  return isLoading ? <Loader/> : (
    <div className="page-layout">
      <div className="page-head">{selectedPlaylist?.__playlistname}</div>
      <div className="page-container">
        {selectedPlaylist?.videoList.map(({ __video }) => {
          const video = videoList?.find(({ _id }) => _id === __video);
          return (
            <div key={__video}>
            <Link
              to={`/playlist/${selectedPlaylist?._id}/${video?._id}`}
            >
              <VideoCard video={video} />
            </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
