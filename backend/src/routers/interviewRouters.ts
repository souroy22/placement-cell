import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { paginateMiddleware } from "../utils/pagination";
import interviewControllers from "../controllers/interviewControllers";

const interviewRouters = express.Router();

interviewRouters.post("/create", verifyToken, interviewControllers.create);
interviewRouters.get(
  "/all",
  verifyToken,
  paginateMiddleware,
  interviewControllers.getAllInterviews
);
interviewRouters.patch(
  "/update/:slug",
  verifyToken,
  interviewControllers.updateInterview
);
interviewRouters.delete(
  "/delete/:slug",
  verifyToken,
  interviewControllers.deleteInterview
);
interviewRouters.post(
  "/apply",
  verifyToken,
  interviewControllers.applyForInterview
);

export default interviewRouters;
