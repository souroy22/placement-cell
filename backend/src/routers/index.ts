import express from "express";
import authRouters from "./authRouters";
import batchRouters from "./batchRouters";
import studentRouters from "./studentRouters";

const routers = express.Router();

routers.use("/auth", authRouters);
routers.use("/batch", batchRouters);
routers.use("/student", studentRouters);

export default routers;
