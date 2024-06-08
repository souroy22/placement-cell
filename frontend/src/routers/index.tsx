import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { Box, CircularProgress } from "@mui/material";
import Result from "../pages/results";
const LoginForm = lazy(() => import("../components/LoginForm"));
const SignupForm = lazy(() => import("../components/SignupForm"));
const Interviews = lazy(() => import("../pages/interviews"));
const Students = lazy(() => import("../pages/students"));

const RouterComponent = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ zIndex: 10000 }} />
        </Box>
      }
    >
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Navigate to="/interviews" />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/students" element={<Students />} />
          <Route path="/result/:slug" element={<Result />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouterComponent;
