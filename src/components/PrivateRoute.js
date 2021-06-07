import { Route, Navigate } from "react-router-dom";

export const PrivateRoute = ({ path, ...props }) => {
  
  return JSON.parse(localStorage?.getItem("user"))?.userLoggedIn ? (
    <Route {...props} path={path} />
  ) : (
    <Navigate state={{ from: path }} replace to="/login" />
  );
}
