import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { paginateMiddleware } from "../utils/pagination";
import resultControllers from "../controllers/resultControllers";

const resultRouters = express.Router();

resultRouters.get(
  "/all",
  verifyToken,
  paginateMiddleware,
  resultControllers.getAllResults
);
resultRouters.patch(
  "/update-status",
  verifyToken,
  resultControllers.updateResultStatus
);
resultRouters.get("/download", verifyToken, resultControllers.downloadResult);

export default resultRouters;
