import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import authControllers from "../controllers/authControllers";

const authRouters = express.Router();

authRouters.post("/signup", authControllers.signup);
authRouters.post("/signin", authControllers.signin);
authRouters.get("/signout", verifyToken, authControllers.signout);

export default authRouters;
