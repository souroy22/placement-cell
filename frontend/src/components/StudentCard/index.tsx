import { Box } from "@mui/material";
import "./style.css";
import { Student_TYPE } from "../../store/student/studentReducer";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ConfirmationPopup from "../ConfirmationPopup";
import { useState } from "react";

type PROP_TYPES = {
  data: Student_TYPE;
  handleClickUpdate?: (slug: string) => void;
  slug?: string;
  showupdateIcons?: boolean;
  handleDelete?: (slug: string) => void;
};

const StudentCard = ({
  data,
  handleClickUpdate,
  slug,
  showupdateIcons = false,
  handleDelete,
}: PROP_TYPES) => {
  const {
    name,
    email,
    college,
    status,
    dsaScore,
    webdScore,
    reactScore,
    batch,
  } = data;

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (slug) {
      handleDelete && handleDelete(slug);
    }
  };

  return (
    <Box className="student-card">
      <ConfirmationPopup
        open={open}
        handleClose={() => setOpen(false)}
        handleDelete={handleClick}
      />
      {showupdateIcons ? (
        <Box className="icons-container">
          <FaUserEdit
            className="edit-student-icon"
            onClick={() => {
              if (slug) {
                handleClickUpdate && handleClickUpdate(slug);
              }
            }}
          />
          <MdDelete
            className="delete-student-icon"
            onClick={() => {
              setOpen(true);
            }}
          />
        </Box>
      ) : null}
      <Box>{name}</Box>
      <Box>Email: {email}</Box>
      <Box>College Name: {college}</Box>
      <Box>DSA Score: {dsaScore}</Box>
      <Box>Web Dev Score: {webdScore}</Box>
      <Box>ReactJS Score: {reactScore}</Box>
      <Box>Batch Name: {batch.name}</Box>
      <Box>Staus: {status === "not_placed" ? "NOT PLACED" : "PLACED"}</Box>
    </Box>
  );
};

export default StudentCard;
