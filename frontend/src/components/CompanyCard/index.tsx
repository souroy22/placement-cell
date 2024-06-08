import { Box, Button } from "@mui/material";
import { MdDateRange } from "react-icons/md";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { INTERVIEW_FORM_TYPE } from "../../pages/interviews";

type PROP_TYPES = {
  companyName: string;
  date: string;
  slug: string;
  handleClickUpdate: (data: INTERVIEW_FORM_TYPE, slug: string) => void;
};

const CompanyCard = ({
  companyName,
  date,
  slug,
  handleClickUpdate,
}: PROP_TYPES) => {
  const navigate = useNavigate();

  return (
    <Box className="company-card">
      <Box className="company-card-left">
        <img
          className="company-logo"
          src="https://cdn.dribbble.com/users/2830303/screenshots/5618517/600x400_1x.jpg"
        />
        <Box className="company-details">
          <Box className="company-name">{companyName}</Box>
          <Box>
            <MdDateRange />
            {date}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: "20px" }}>
        <Button
          variant="outlined"
          className="applyBtn"
          onClick={() => navigate(`/result/${slug}`)}
        >
          View Details
        </Button>
        <Button
          variant="outlined"
          className="updatebtn"
          onClick={() => handleClickUpdate({ companyName, date }, slug)}
        >
          Update
        </Button>
        <Button
          variant="outlined"
          className="deleteBtn"
          onClick={() => navigate(`/result/${slug}`)}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default CompanyCard;
