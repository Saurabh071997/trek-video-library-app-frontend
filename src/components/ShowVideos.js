import { Link } from "react-router-dom"
import './ShowVideos.css'
import { useLibrary } from "../context/LibraryProvider"
import { VideoCard } from "./VideoCard"

export const getFilteredData = (videoList, selectedCategory) => {
  return videoList.filter(({ _category }) =>
    selectedCategory !== null ? _category === selectedCategory : true
  );
}

export const ShowVideos = () => {
  const {
    state: { videoList, categoryList, selectedCategory }
  } = useLibrary();

  const filteredData = getFilteredData(videoList, selectedCategory);
  const category = categoryList.find(({ _id }) => _id === selectedCategory);

  return (
    <div>
      <div className="page-head">{category?.name}</div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredData.map((videoItem) => {
          return (
            <div className="card-margin">
              <Link to={`/video/${videoItem._id}`} key={videoItem._id} >
                <VideoCard video={videoItem} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
