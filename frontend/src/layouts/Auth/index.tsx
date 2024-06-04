import { Box } from "@mui/material";
import "./style.css";

type PROP_TYPE = {
  children: React.ReactNode;
};

const AuthWrapper = ({ children }: PROP_TYPE) => {
  return (
    <Box className="auth-wrapper-container">
      <Box className="auth-wrapper-left">
        <img
          src="https://media.tenor.com/p0G_bmA2vSYAAAAd/login.gif"
          className="auth-left-image"
        />
      </Box>
      <Box className="children-container">
        <Box className="form-container">{children}</Box>
      </Box>
    </Box>
  );
};

export default AuthWrapper;
