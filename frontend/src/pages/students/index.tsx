import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Pagination,
  Skeleton,
  TextField,
} from "@mui/material";
import "./style.css";
import {
  createNewStudent,
  deleteStudent,
  getAllStudents,
  updateStudentData,
} from "../../api/student.api";
import notification from "../../configs/notification";
import { setStudents } from "../../store/student/studentReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import StudentCard from "../../components/StudentCard";
import { FaPlus } from "react-icons/fa";
// import InfiniteScroll from "react-infinite-scroll-component";
import CustomModal from "../../components/Modal";
import { getAllBatches } from "../../api/batch.api";

const initialFormData = {
  name: "",
  email: "",
  college: "",
  batchSlug: "",
  dsaScore: undefined,
  webdScore: undefined,
  reactScore: undefined,
  batch: undefined,
};

const Students = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentBatchPage, setBatchCurrentPage] = useState(1);
  const [totalBatchPages, setBatchTotalPages] = useState(1);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState<boolean>(false);
  const [initLoad, setinitLoad] = useState<boolean>(false);
  const [batches, setBatches] = useState<any>([]);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [updateMode, setUpdateMode] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const dispatch = useDispatch();

  console.log(`${currentBatchPage}, ${totalBatchPages}`);

  // const optionsContainerRef = useRef<HTMLDivElement | null>(null);

  const { students } = useSelector((state: RootState) => state.studentReducer);

  const getStudents = async (page: number = 1, searchValue: string = "") => {
    try {
      const data = await getAllStudents(page, searchValue);
      dispatch(setStudents(data.data));
      setCurrentPage(page);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  const fetchBatches = async (page: number = 1, searchValue: string = "") => {
    try {
      const data = await getAllBatches(page, searchValue);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  // const loadMoreBatch = async () => {
  //   const newData: any = await fetchBatches(currentBatchPage + 1);
  //   setBatches([...batches, ...newData.data]);
  //   setCurrentPage(currentBatchPage + 1);
  // };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    getStudents(1, event.target.value);
  };

  const onLoad = async () => {
    setinitLoad(true);
    await getStudents();
    const data = await fetchBatches();
    setBatches(data.data);
    setBatchCurrentPage(1);
    setBatchTotalPages(data.totalPages);
    setinitLoad(false);
  };

  const handleClose = () => {
    setSelectedSlug(null);
    setUpdateMode(false);
    setOpen(false);
    setFormData(initialFormData);
  };

  const updateStudent = async () => {
    try {
      if (selectedSlug) {
        let newFormData: any = JSON.parse(JSON.stringify(formData));
        delete newFormData["batch"];
        const data: any = {};
        const student: any = students?.filter(
          (stu) => stu.slug === selectedSlug
        );
        if (student?.length) {
          for (let key in newFormData) {
            if (newFormData[key] !== student[0][key]) {
              data[key] = newFormData[key];
            }
          }
        }

        const updatedData = await updateStudentData(selectedSlug, data);
        if (students) {
          const updatedStudents = students.map((student) => {
            if (student.slug === updatedData.slug) {
              return updatedData;
            } else {
              return student;
            }
          });
          dispatch(setStudents(updatedStudents));
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.message", error.message);
        notification.error(error.message);
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setLoad(true);
    event.preventDefault();
    if (updateMode) {
      updateStudent();
    } else {
      try {
        const data = await createNewStudent(formData);
        if (students) {
          dispatch(setStudents([...students, data]));
        } else {
          dispatch(setStudents([data]));
        }
        notification.success("Student added successfully");
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.message", error.message);
          notification.error(error.message);
        }
      }
    }
    handleClose();
    // setOpen(false);
    setLoad(false);
  };

  const handleClickUpdate = (slug: string) => {
    setSelectedSlug(slug);
    const data: any = students
      ? students?.filter((student) => student.slug === slug)
      : null;
    setOpen(true);
    if (data?.length) {
      setFormData({ ...data[0], batchSlug: data[0].batch.slug });
    }
    setUpdateMode(true);
  };

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const isDisabled = (): boolean => {
    let check = false;
    let newObj = JSON.parse(JSON.stringify(formData));
    delete newObj["batch"];
    const formValues = Object.values(newObj);
    for (let val of formValues) {
      if (!val) {
        check = true;
        break;
      } else if (typeof val === "string" && !val.trim()) {
        check = true;
        break;
      } else if (typeof val === "number" && val <= 0) {
        check = true;
        break;
      }
    }
    if (updateMode) {
      const student = students?.filter((stu) => stu.slug === selectedSlug);
      if (student && student.length) {
        let newStudent = {
          ...JSON.parse(JSON.stringify(student[0])),
          batchSlug: student[0].batch.slug,
        };
        for (let stu in newObj) {
          if (Number(newObj[stu])) {
            newObj[stu] = Number(newObj[stu]);
          }
        }
        delete newStudent["batch"];
        // delete newStudent["slug"];
        console.log("newObj", newObj);
        console.log("student[0]", newStudent);
        check = JSON.stringify(newObj) === JSON.stringify(newStudent);
      }
    }
    return check;
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteStudent(slug);
      if (students) {
        const filteredData = students.filter(
          (student) => student.slug !== slug
        );
        dispatch(setStudents(filteredData));
      } else {
        dispatch(setStudents(null));
      }
      notification.success("Student deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.message", error.message);
        notification.error(error.message);
      }
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  // const handleSelected = (_: any, value: any) => {
  //   // Handle the selected value
  //   console.log("Selected value: ", value);
  // };

  // const ListboxComponent = forwardRef<HTMLDivElement, any>((props, ref) => (
  //   <div
  //     style={{ height: 200, display: "flex", flexDirection: "column-reverse" }}
  //     id="combo-box-demo-listbox"
  //   >
  //     <InfiniteScroll
  //       dataLength={totalBatchPages * 7}
  //       next={loadMoreBatch}
  //       hasMore={currentBatchPage < totalBatchPages}
  //       loader={<div>Loading...</div>}
  //       height={200}
  //       scrollableTarget="combo-box-demo-listbox"
  //       {...props}
  //     >
  //       <List>
  //         {batches &&
  //           batches.map((value: any) => (
  //             <ListItem disablePadding>
  //               <ListItemButton
  //                 onMouseDown={(event: any) => handleSelected(event, value)}
  //               >
  //                 <ListItemText primary={value.name} />
  //               </ListItemButton>
  //             </ListItem>
  //           ))}
  //         {batches && batches.length === 0 && (
  //           <ListItem disablePadding>
  //             <ListItemButton disabled>
  //               <ListItemText primary="No items available" />
  //             </ListItemButton>
  //           </ListItem>
  //         )}
  //       </List>
  //     </InfiniteScroll>
  //   </div>
  // ));

  // const PopperComponent = forwardRef<HTMLDivElement, any>((props, ref) => (
  //   <div {...props} ref={ref} />
  // ));

  return (
    <Box>
      <CustomModal open={open} handleClose={handleClose}>
        <Box className="form-card">
          <Box className="form-title">Add New Interview</Box>
          <Box>
            <form className="student-form-container" onSubmit={handleSubmit}>
              <label className="student-add-form-label" htmlFor="student-name">
                Student Name*
              </label>
              <input
                name="name"
                required
                value={formData.name}
                className="student-add-form-input"
                id="student-name"
                placeholder="Enter Student Name"
                onChange={handleFormChange}
              />
              <label className="student-add-form-label" htmlFor="student-email">
                Student Email*
              </label>
              <input
                name="email"
                required
                value={formData.email}
                id="student-email"
                placeholder="Enter Student Email"
                className="student-add-form-input"
                onChange={handleFormChange}
              />
              <label
                className="student-add-form-label"
                htmlFor="student-college"
              >
                Student College*
              </label>
              <input
                name="college"
                required
                value={formData.college}
                id="student-college"
                placeholder="Enter Student College"
                className="student-add-form-input"
                onChange={handleFormChange}
              />
              <label className="student-add-form-label" htmlFor="student-batch">
                Student Batch*
              </label>
              <Autocomplete
                disablePortal
                fullWidth
                id="combo-box-demo"
                options={batches}
                onChange={(_, option: any) => {
                  setFormData({ ...formData, batchSlug: option.slug });
                }}
                getOptionLabel={(option: any) => option.name}
                defaultValue={formData.batch || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder="Enter Student Batch"
                  />
                )}
                // PaperComponent={ListboxComponent}
                // PopperComponent={PopperComponent}
              />
              <label
                className="student-add-form-label"
                htmlFor="student-dsaScore"
              >
                Student DSA Mark*
              </label>
              <input
                name="dsaScore"
                type="number"
                required
                value={formData.dsaScore}
                id="student-dsaScore"
                placeholder="Enter DSA Mark"
                className="student-add-form-input"
                onChange={handleFormChange}
              />
              <label
                className="student-add-form-label"
                htmlFor="student-webdScore"
              >
                Student Web Dev Mark*
              </label>
              <input
                name="webdScore"
                type="number"
                required
                value={formData.webdScore}
                id="student-webdScore"
                placeholder="Enter Web Dev Mark"
                className="student-add-form-input"
                onChange={handleFormChange}
              />
              <label
                className="student-add-form-label"
                htmlFor="student-reactScore"
              >
                Student ReactJS Mark*
              </label>
              <input
                name="reactScore"
                type="number"
                required
                value={formData.reactScore}
                id="student-reactScore"
                placeholder="Enter ReactJS Mark"
                className="student-add-form-input"
                onChange={handleFormChange}
              />
              <Button
                sx={{ marginTop: "20px" }}
                type="submit"
                variant="contained"
                disabled={isDisabled()}
              >
                {load ? (
                  <CircularProgress sx={{ color: "white" }} />
                ) : updateMode ? (
                  "Update Student"
                ) : (
                  "Add Student"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      </CustomModal>
      <Box>
        <Box className="student-header">
          <input
            id="student-search-input"
            value={value}
            onChange={handleChange}
            placeholder="search..."
          />
          <Button
            id="add-new-student-btn"
            variant="outlined"
            onClick={() => setOpen(true)}
          >
            <FaPlus />
            Add New Student
          </Button>
        </Box>
        <Box className="students-container">
          {initLoad ? (
            <Box sx={{ display: "flex", gap: "30px" }}>
              {[...Array(4)].map(() => (
                <Skeleton variant="rectangular" height={300} width={300} />
              ))}
            </Box>
          ) : !students || !students.length ? (
            <Box className="no-record-container">
              <img src="https://www.rajasthanndaacademy.com/assets/images/no-record-found.png" />
            </Box>
          ) : (
            students?.map((student) => (
              <StudentCard
                key={student.slug}
                data={student}
                handleClickUpdate={handleClickUpdate}
                slug={student.slug}
                showupdateIcons={true}
                handleDelete={handleDelete}
              />
            ))
          )}
        </Box>
      </Box>
      <Pagination
        page={currentPage}
        count={totalPages}
        onChange={(_, page) => {
          getStudents(page);
        }}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      />
    </Box>
  );
};

export default Students;
