import { Box, Button, Skeleton, Tooltip } from "@mui/material";
import "./style.css";
import {
  createBatch,
  deleteBatch,
  getAllBatches,
  updateBatch,
} from "../../api/batch.api";
import notification from "../../configs/notification";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBatches } from "../../store/bactch/batchReducer";
import { RootState } from "../../store/store";
import { setLoading } from "../../store/global/globalReducer";
import { FaPlus, FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CustomModal from "../../components/Modal";
import ConfirmationPopup from "../../components/ConfirmationPopup";

const Batches = () => {
  const [initLoad, setInitLoad] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openDeletePopup, setOpenDeletePopup] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [newBatchName, setNewBatchName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");

  const dispatch = useDispatch();

  const { batches } = useSelector((state: RootState) => state.batchReducer);

  const onLoad = async () => {
    dispatch(setLoading(true));
    setInitLoad(true);
    try {
      const data = await getAllBatches();
      dispatch(setBatches(data.data));
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
    setInitLoad(false);
    dispatch(setLoading(false));
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newValue: string = event.target.value;
    setValue(newValue);
    dispatch(setLoading(true));
    setInitLoad(true);
    try {
      const data = await getAllBatches(1, newValue);
      dispatch(setBatches(data.data));
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
    dispatch(setLoading(false));
    setInitLoad(false);
  };

  const handleUpdate = async () => {
    const data = await updateBatch(newBatchName, slug);
    if (batches) {
      const newData = batches.map((batch) => {
        if (batch.slug === data.slug) {
          return {
            name: data.name,
            slug: data.slug,
          };
        }
        return batch;
      });
      dispatch(setBatches(newData));
      setSlug("");
      setOpen(false);
      dispatch(setLoading(false));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newBatchName || !newBatchName.trim()) {
      notification.error("Please enter a batch name");
      return;
    }
    dispatch(setLoading(true));
    if (update) {
      handleUpdate();
    } else {
      try {
        const data = await createBatch(newBatchName);
        if (batches) {
          dispatch(setBatches([...batches, data]));
        } else {
          dispatch(setBatches([data]));
        }
        setNewBatchName("");
        setOpen(false);
        notification.success("New Batch created successfully");
      } catch (error) {
        if (error instanceof Error) {
          notification.error(error.message);
        }
      }
    }
    dispatch(setLoading(false));
  };

  const handleClick = async () => {
    try {
      await deleteBatch(slug);
      if (batches) {
        const newData = batches.filter((batch) => batch.slug !== slug);
        dispatch(setBatches(newData));
      }
      setOpenDeletePopup(false);
      notification.success("Batch deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        notification.error(error.message);
      }
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Box className="batches-container">
      <ConfirmationPopup
        open={openDeletePopup}
        handleClose={() => {
          setSlug("");
          setOpenDeletePopup(false);
        }}
        handleDelete={handleClick}
      />
      <CustomModal
        open={open}
        handleClose={() => {
          setSlug("");
          setOpen(false);
          setUpdate(false);
        }}
      >
        <Box className="form-card">
          <Box className="form-title">Add New Interview</Box>
          <form className="batch-form-container" onSubmit={handleSubmit}>
            <label className="batch-add-form-label">Add New Batch*</label>
            <input
              required
              value={newBatchName}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setNewBatchName(event.target.value);
              }}
              className="batch-add-form-input"
              placeholder="Enter new batch"
            />
            <Button
              variant="contained"
              type="submit"
              disabled={!newBatchName.trim()}
            >
              {update ? "Update" : "Add"}
            </Button>
          </form>
        </Box>
      </CustomModal>
      <Box className="batches-header">
        <input
          id="batches-search-input"
          value={value}
          onChange={handleChange}
          placeholder="search..."
        />
        <Button
          id="add-new-batches-btn"
          variant="outlined"
          onClick={() => setOpen(true)}
        >
          <FaPlus />
          Add New Batch
        </Button>
      </Box>
      {initLoad ? (
        <Box className="skeleton-container">
          {[...Array(10)].map(() => (
            <Skeleton variant="rectangular" width={100} height={"100px"} />
          ))}
        </Box>
      ) : !batches || !batches.length ? (
        <Box className="no-record-container">
          <img src="https://www.rajasthanndaacademy.com/assets/images/no-record-found.png" />
        </Box>
      ) : (
        <Box className="batches-card-container">
          {batches.map((batch) => (
            <Box key={batch.slug} className="batch-card">
              <Box className="icons-container">
                <Tooltip title="Edit">
                  <FaUserEdit
                    className="edit-student-icon"
                    onClick={() => {
                      setSlug(batch.slug);
                      setUpdate(true);
                      setNewBatchName(batch.name);
                      setOpen(true);
                    }}
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <MdDelete
                    className="delete-student-icon"
                    onClick={() => {
                      setSlug(batch.slug);
                      setOpenDeletePopup(true);
                    }}
                  />
                </Tooltip>
              </Box>
              {batch.name}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Batches;
