import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthWrapper from "../layouts/Auth";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const PublicRoute = () => {
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.userReducer);

  if (!user) {
    return (
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    );
  }

  return (
    <Navigate
      to={location.state?.prevUrl || "/"}
      state={{ prevUrl: location.pathname }}
    />
  );
};

export default PublicRoute;
