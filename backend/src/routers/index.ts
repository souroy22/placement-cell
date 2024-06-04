import express from "express";
import authRouters from "./authRouters";
import batchRouters from "./batchRouters";
import studentRouters from "./studentRouters";
import interviewRouters from "./interviewRouters";
import resultRouters from "./resultRouters";
import employeeRouters from "./employeeRouters";

const routers = express.Router();

routers.use("/auth", authRouters);
routers.use("/batch", batchRouters);
routers.use("/student", studentRouters);
routers.use("/interview", interviewRouters);
routers.use("/result", resultRouters);
routers.use("/user", employeeRouters);

export default routers;
