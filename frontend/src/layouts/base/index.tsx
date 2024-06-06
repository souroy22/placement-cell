import { ReactNode } from "react";
import { Box } from "@mui/material";

type PROP_TYPES = {
  children: ReactNode;
};

const Base = ({ children }: PROP_TYPES) => {
  return (
    <Box
      sx={{
        marginTop: "60px",
        padding: "20px",
        height: "calc(100svh - 60px)",
        width: "100svw",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

export default Base;
