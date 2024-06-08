import { Box, Button } from "@mui/material";
import "./style.css";
import CustomModal from "../Modal";

type PROP_TYPES = {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
};

const ConfirmationPopup = ({ open, handleClose, handleDelete }: PROP_TYPES) => {
  return (
    <CustomModal open={open} handleClose={handleClose} width={270}>
      <Box className="popup-container">
        <Box className="popup-title">Are you sure to delete?</Box>
        <Box className="popup-action-container">
          <Box className="popup-action-section">
            <Button onClick={handleClose} color="inherit">
              cancel
            </Button>
            <Button variant="contained" onClick={handleDelete} color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </CustomModal>
  );
};

export default ConfirmationPopup;
