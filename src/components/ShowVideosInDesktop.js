import { Link, useParams, useNavigate} from "react-router-dom"
import { useEffect } from "react"
import "./ShowVideosInDesktop.css"
import { useLibrary } from "../context/LibraryProvider"
import { ShowVideos } from "./ShowVideos"
import {Loader} from "./Loader"


export const ShowVideosInDesktop = () => {
  const {
    state: { categoryList, isLoading }
  } = useLibrary();
  
  const navigate = useNavigate()

  let {categoryId: selectedCategory} = useParams()

  let currentCategory = categoryList?.find(
    ({ _id }) => _id === selectedCategory
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return isLoading ? <Loader/> : (
    <div className="body-container">
      <div className="sidenav">
        <ul>
          <div className="sidenav-head">Categories</div>
          {categoryList?.map(({ _id, name }) => {
            return (
              <li
                key={_id}
                onClick={() => {
                  navigate(`/videos/category/${_id}`);
                }}
              >
                {name === currentCategory?.name ? (
                  <div className="sidenav-item-active">{name} &gt;</div>
                ) : (
                  <div className="sidenav-item">{name}</div>
                )}
              </li>
            );
          })}
          <Link to="/categories" style={{ textDecoration: "none" }}>
            <div
              style={{
                color: "#0EA5E9",
                padding: "0.25rem 0rem 0.25rem 1rem",
                cursor: "pointer"
              }}
            >
              view more ...
            </div>
          </Link>
        </ul>
      </div>

      <div className="body-content">
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <ShowVideos />
        </div>
      </div>
    </div>
  );
}
