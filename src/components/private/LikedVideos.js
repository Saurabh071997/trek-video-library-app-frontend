import { Link } from "react-router-dom"
import { useEffect } from "react"
import "./LikedVideos.css"
import { useLibrary } from "../../context/LibraryProvider"
import { VideoCard } from "../VideoCard"
import {Loader} from "../Loader"

export const LikedVideos = () => {
  const {
    state: { likedVideos, videoList, isLoading },
     getLikedVideos,getWatchLaterVideos

  } = useLibrary();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  useEffect(()=> {
    getLikedVideos();
    getWatchLaterVideos();
    // eslint-disable-next-line
  },[])

  return isLoading ? <Loader/> : (
    <div className="page-layout">
      <div className="page-head">Liked Videos</div>
      {likedVideos?.length > 0 ? (
        <div className="page-container">
          {likedVideos.map(({ __video }) => {
            let video = videoList?.find(({ _id }) => _id === __video);
            return (
              <Link to={`/likedvideo/${video?._id}`} key={__video}>
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
