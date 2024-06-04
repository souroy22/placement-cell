import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const RouterComponent = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/signin" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<div>Home Page</div>} />
      </Route>
    </Routes>
  );
};

export default RouterComponent;
