import { useNavigate } from "react-router-dom"
import "./Categories.css"
import { useLibrary } from "../context/LibraryProvider"
import { ACTIONS } from "../context/libraryReducer"
import { Loader } from "./Loader"

export const Categories = () => {
  const {
    state: { categoryList, isLoading},
    dispatch
  } = useLibrary();

  const navigate = useNavigate();

  return isLoading ? <Loader/> : (
    <div className="page-layout">
      <div className="page-head">Categories</div>
      <div className="page-container">
        {categoryList.map(({ _id, name, imgUrl }) => {
          return (
            <div
              key={_id}
              className="category-card"
              onClick={() => {
                dispatch({
                  TYPE: ACTIONS.SELECT_CATEGORY,
                  payload: { categoryId: _id }
                });

                navigate("/videos");
              }}
            >
              <img
                src={imgUrl}
                alt="category_img"
                className="category-card-img"
              />
              <div className="category-card-txt">
                <div className="category-card-txt-det">{name} </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
