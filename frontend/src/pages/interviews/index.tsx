import {
  Box,
  Button,
  CircularProgress,
  Pagination,
  Skeleton,
} from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import {
  createInterview,
  getAllInterviews,
  updateInterview,
} from "../../api/interview.api";
import notification from "../../configs/notification";
import {
  Interview_TYPE,
  setInterviews,
} from "../../store/interview/interviewReducer";
import { RootState } from "../../store/store";
import CompanyCard from "../../components/CompanyCard";
import { setLoading } from "../../store/global/globalReducer";
import { FaPlus } from "react-icons/fa";
import CustomModal from "../../components/Modal";
import {
  formatDateString,
  formatInputDate,
} from "../../services/utils/formatDate";

export type INTERVIEW_FORM_TYPE = {
  companyName: string;
  date: string;
};

const Interviews = () => {
  const [value, setValue] = useState<string>("");
  const [updateSlug, setUpdateSlug] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  const [initLoad, setinitLoad] = useState<boolean>(false);
  const [formData, setFormData] = useState<INTERVIEW_FORM_TYPE>({
    companyName: "",
    date: "",
  });
  const [updateMode, setUpdateMode] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  const { interviews } = useSelector(
    (state: RootState) => state.interviewReducer
  );

  const getInterviews = async (page: number = 1, searchValue: string = "") => {
    setinitLoad(true);
    const data = await getAllInterviews(page, searchValue);
    dispatch(setInterviews(data.data));
    setTotalPage(data.totalPages);
    setCurrentPage(page);
    setinitLoad(false);
  };

  const onLoad = async () => {
    try {
      await getInterviews();
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
    dispatch(setLoading(false));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue: string = event.target.value;
    setValue(newValue);
    getInterviews(1, newValue);
  };

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setUpdateMode(false);
    setFormData({ companyName: "", date: "" });
    setOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (load) {
      return;
    }
    setLoad(true);
    if (updateMode) {
      handleUpdate();
    } else {
      if (!formData.companyName.trim() || !formData.date.trim()) {
        notification.error("Please fill all the required fields!");
      }
      try {
        const newFormattedDate = formatDateString(formData.date);
        const data = await createInterview({
          ...formData,
          date: newFormattedDate,
        });
        let updatedInterviews = interviews;

        if (updatedInterviews !== null) {
          updatedInterviews = [data, ...updatedInterviews];
        } else {
          updatedInterviews = [data];
        }
        dispatch(setInterviews(updatedInterviews));
        handleClose();
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.message", error.message);
          notification.error(error.message);
        }
      }
    }
    setLoad(false);
  };

  const handleClickUpdate = (data: INTERVIEW_FORM_TYPE, slug: string) => {
    setUpdateMode(true);
    setUpdateSlug(slug);
    setFormData(data);
    setOpen(true);
  };

  const checkIsDisabled = (): boolean => {
    let check =
      formData.companyName.trim() === "" || formData.date.trim() === "";
    if (updateMode) {
      const updatingData = interviews?.filter(
        (interview) => interview.slug === updateSlug
      );
      if (updatingData?.length) {
        check =
          check ||
          (formData.companyName.trim() === updatingData[0].companyName.trim() &&
            formatDateString(formData.date.trim()) ===
              updatingData[0].date.trim());
      }
    }
    return check;
  };

  const handleUpdate = async () => {
    const newData: any = {};
    const updatingData = interviews?.filter(
      (interview) => interview.slug === updateSlug
    );
    if (updatingData?.length) {
      if (formData.companyName.trim() !== updatingData[0].companyName.trim()) {
        newData["companyName"] = formData.companyName.trim();
      }
      if (
        formatDateString(formData.date.trim()) !== updatingData[0].date.trim()
      ) {
        newData["date"] = formatDateString(formData.date.trim());
      }
    }
    const data: Interview_TYPE = await updateInterview(newData, updateSlug);
    const updatedData: Interview_TYPE[] | null = !interviews
      ? null
      : interviews?.map((interview) => {
          if (interview.slug === data.slug) {
            return data;
          }
          return interview;
        });
    dispatch(setInterviews(updatedData));
    setOpen(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Box>
      <CustomModal open={open} handleClose={handleClose}>
        <Box className="form-card">
          <Box className="form-title">Add New Interview</Box>
          <Box>
            <form className="interview-form-container" onSubmit={handleSubmit}>
              <label
                className="interview-add-form-label"
                htmlFor="company-name"
              >
                Company Name*
              </label>
              <input
                name="companyName"
                required
                value={formData.companyName}
                className="interview-add-form-input"
                id="company-name"
                placeholder="Enter Company Name"
                onChange={handleFormChange}
              />
              <label
                className="interview-add-form-label"
                htmlFor="interview-date"
              >
                Interview Date*
              </label>
              <input
                required
                name="date"
                data-date=""
                data-date-format="DD/MM/YYYY"
                value={formatInputDate(formData.date)}
                id="interview-date"
                className="interview-add-form-input"
                type="date"
                onChange={handleFormChange}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={checkIsDisabled()}
              >
                {load ? (
                  <CircularProgress sx={{ color: "white" }} />
                ) : updateMode ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      </CustomModal>
      <Box className="interview-header">
        <input
          id="interviewsearch-input"
          value={value}
          onChange={handleChange}
          placeholder="search..."
        />
        <Button
          id="add-new-interview-btn"
          variant="outlined"
          onClick={() => setOpen(true)}
        >
          <FaPlus />
          Add New Interview
        </Button>
      </Box>
      <Box className="interviews-container">
        {initLoad ? (
          [...Array(3)].map(() => (
            <Skeleton variant="rectangular" width={"60%"} height={200} />
          ))
        ) : interviews?.length ? (
          interviews?.map((interview) => (
            <CompanyCard
              date={interview.date}
              companyName={interview.companyName}
              slug={interview.slug}
              handleClickUpdate={handleClickUpdate}
            />
          ))
        ) : (
          <Box className="no-record-container">
            <img src="https://www.rajasthanndaacademy.com/assets/images/no-record-found.png" />
          </Box>
        )}
      </Box>
      <Pagination
        page={currentPage}
        count={totalPage}
        onChange={(_, page) => {
          getInterviews(page);
        }}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      />
    </Box>
  );
};

export default Interviews;
