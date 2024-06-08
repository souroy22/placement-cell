import { Box } from "@mui/material";
import "./style.css";
import { Student_TYPE } from "../../store/student/studentReducer";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

type PROP_TYPES = {
  data: Student_TYPE;
  handleClickUpdate: (slug: string) => void;
  slug: string;
};

const StudentCard = ({ data, handleClickUpdate, slug }: PROP_TYPES) => {
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

  return (
    <Box className="student-card">
      <Box className="icons-container">
        <FaUserEdit
          className="edit-student-icon"
          onClick={() => handleClickUpdate(slug)}
        />
        <MdDelete className="delete-student-icon" />
      </Box>
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
