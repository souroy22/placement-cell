import express from "express";
import studentControllers from "../controllers/studentControllers";
import { verifyToken } from "../middlewares/verifyToken";
import { paginateMiddleware } from "../utils/pagination";

const studentRouters = express.Router();

studentRouters.post("/add", verifyToken, studentControllers.addStudent);
studentRouters.get(
  "/all",
  verifyToken,
  paginateMiddleware,
  studentControllers.getStudentList
);
studentRouters.patch(
  "/update/:slug",
  verifyToken,
  studentControllers.updateStudent
);
studentRouters.delete(
  "/delete/:slug",
  verifyToken,
  studentControllers.deleteStudent
);

export default studentRouters;
