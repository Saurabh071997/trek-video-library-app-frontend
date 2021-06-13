import { Link } from "react-router-dom";
import "./ErrorPage.css";

export const ErrorPage = () => {
  return (
    <div className="error-container">
      <div className="error-txt-md">OOPs!!</div>

      <div className="error-txt-sm">Something went wrong</div>
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="btn-empty" style={{color:'#0EA5E9'}}>Go to Home -&gt;</div>
      </Link>
    </div>
  );
};
