// import { Link } from "react-router-dom";
import './Home.css'
import arrow from "../images/right.svg";
import { useWindowSize } from "../context/useWindowSize";
// import { useLibrary } from "../context/LibraryProvider";
// import { Loader } from "./Loader";

export const Home = () => {
  const [, width] = useWindowSize();
//   const {
//     state: { isLoading }
//   } = useLibrary();

  let bg_img =
    "https://www.iesfilmfestival.com/wp-content/uploads/2020/12/sports.jpg";

  return  (
    <div className="div-home">
      <div className="div-home-img">
        <img src={bg_img} alt="home" className="img-home" />
      </div>

      <div className="div-home-txt">
        <div className="txt-medium">Feel</div>
        <div className="txt-small">the</div>
        <div className="txt-large">Rush</div>
      </div>

      {/* <Link to="/categories"> */}
        <div className={width > 600 ? "div-home-nav" : "div-home-sub"}>
          <div className="div-home-nav-txt">Explore</div>

          <div className="stage">
            <img src={arrow} className="link-image bounce" alt="img" />
          </div>
        </div>
      {/* </Link> */}
    </div>
  );
}
