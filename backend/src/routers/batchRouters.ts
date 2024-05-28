import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import batchControllers from "../controllers/batchControllers";
import { paginateMiddleware } from "../utils/pagination";

const batchRouters = express.Router();

batchRouters.post("/create", verifyToken, batchControllers.createBatch);
batchRouters.get(
  "/all",
  verifyToken,
  paginateMiddleware,
  batchControllers.getAllBatches
);
batchRouters.patch("/update/:slug", verifyToken, batchControllers.updateBatch);
batchRouters.delete("/delete/:slug", verifyToken, batchControllers.deleteBatch);

export default batchRouters;
