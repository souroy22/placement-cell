import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../store/store";
import Base from "../layouts/base";

const PrivateRoute = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.userReducer);

  if (!!user) {
    return (
      <Base>
        <Outlet />
      </Base>
    );
  }
  return <Navigate to="/signin" state={{ prevUrl: location.pathname }} />;
};

export default PrivateRoute;
