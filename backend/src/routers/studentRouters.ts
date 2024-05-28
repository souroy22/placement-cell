import express from "express";
import studentControllers from "../controllers/studentControllers";
import { verifyToken } from "../middlewares/verifyToken";

const studentRouters = express.Router();

studentRouters.post("/add", verifyToken, studentControllers.addStudent);

export default studentRouters;
