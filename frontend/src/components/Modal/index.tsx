import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "3px !important",
};

type PROP_TYPES = {
  open: boolean;
  handleClose: () => void;
  children: ReactNode;
  width?: string | number;
};

const CustomModal = ({
  open,
  handleClose,
  children,
  width = 400,
}: PROP_TYPES) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width }}>{children}</Box>
      </Modal>
    </div>
  );
};

export default CustomModal;
