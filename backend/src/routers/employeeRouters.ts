import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import employeeControllers from "../controllers/employeeControllers";

const employeeRouters = express.Router();

employeeRouters.get("/", verifyToken, employeeControllers.getUser);

export default employeeRouters;
