import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  TextField,
} from "@mui/material";
import "./style.css";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { apply, getResults } from "../../api/result.api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import StudentCard from "../../components/StudentCard";
import { setResults } from "../../store/result/resultReducer";
import notification from "../../configs/notification";
import CustomModal from "../../components/Modal";
import { getNotAppliedStudents } from "../../api/student.api";

const Result = () => {
  const [initLoad, setInitLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);

  const { slug } = useParams();

  const { results } = useSelector((state: RootState) => state.resultReducer);

  const dispatch = useDispatch();

  const onLoad = async () => {
    setInitLoad(true);
    try {
      if (slug) {
        const data = await getResults(slug);
        dispatch(setResults(data.data));
      }
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
    setInitLoad(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoad(true);
    if (slug && selectedStudent) {
      try {
        const data = await apply(slug, selectedStudent);
        if (results) {
          dispatch(setResults([...results, data]));
        } else {
          dispatch(setResults([data]));
        }
        setOpen(false);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.message", error.message);
          notification.error(error.message);
        }
      }
    }
    setLoad(false);
  };

  useEffect(() => {
    onLoad();
    return () => {
      dispatch(setResults(null));
    };
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
                New Student*
              </label>
              <Autocomplete
                disablePortal
                fullWidth
                options={students}
                getOptionLabel={(option: any) => option.name}
                className="interview-add-form-input"
                id="company-name"
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name
                }
                loading={isLoading}
                onChange={(_, option: any) => {
                  setSelectedStudent(option.slug);
                }}
                onOpen={async () => {
                  setIsLoading(true);
                  if (slug) {
                    const notAppliedstudents = await getNotAppliedStudents(
                      slug
                    );
                    setStudents(notAppliedstudents);
                  }
                  setIsLoading(false);
                }}
                onClose={() => {
                  setStudents([]);
                }}
                sx={{ outline: "none", border: "none !important" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder="Add new student"
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                sx={{ marginTop: "20px" }}
                variant="contained"
                disabled={!selectedStudent?.trim()}
              >
                {load ? <CircularProgress sx={{ color: "white" }} /> : "Apply"}
              </Button>
            </form>
          </Box>
        </Box>
      </CustomModal>
      <Box className="result-header">
        <h1>Applied Students</h1>
        <Box>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Apply
          </Button>
        </Box>
      </Box>
      <Box>
        {initLoad ? (
          <Box sx={{ display: "flex", gap: "30px" }}>
            {[...Array(3)].map(() => (
              <Skeleton variant="rectangular" height={300} width={300} />
            ))}
          </Box>
        ) : !results || !results.length ? (
          <Box className="no-record-container">
            <img src="https://www.rajasthanndaacademy.com/assets/images/no-record-found.png" />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: "30px",
              flexWrap: "wrap",
              overflowY: "auto",
              height: "calc(100svh - 200px)",
              padding: "40px",
            }}
          >
            {results?.map((result) => (
              <StudentCard data={result.student} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Result;
