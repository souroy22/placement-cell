import { Box, Button } from "@mui/material";
import { MdDateRange } from "react-icons/md";
import "./style.css";

type PROP_TYPES = {
  companyName: string;
  date: string;
};

const CompanyCard = ({ companyName, date }: PROP_TYPES) => {
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

      <Box>
        <Button variant="outlined" className="applyBtn">
          View Details
        </Button>
      </Box>
    </Box>
  );
};

export default CompanyCard;
