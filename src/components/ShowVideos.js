import { Link, useParams } from "react-router-dom"
import {useEffect} from 'react'
import "./ShowVideos.css"
import { useLibrary } from "../context/LibraryProvider"
import { VideoCard } from "./VideoCard"
import {Loader} from "./Loader"

export const getFilteredData = (videoList, selectedCategory) => {
  return videoList.filter(({ _category }) =>
    selectedCategory !== null ? _category === selectedCategory : true
  );
}

export const ShowVideos = () => {
  const {
    state: { videoList, categoryList, isLoading }
  } = useLibrary();

  let {categoryId : selectedCategory} = useParams()

  const filteredData = getFilteredData(videoList, selectedCategory);
  const category = categoryList.find(({ _id }) => _id === selectedCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return isLoading ? <Loader/> :(
    <div>
      <div className="page-head">{category?.name}</div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredData.map((videoItem) => {
          return (
            <div className="card-margin" key={videoItem._id}>
              <Link to={`/video/${videoItem._id}`}  >
                <VideoCard video={videoItem} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
