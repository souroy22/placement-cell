import { verifyToken } from "../middlewares/verifyToken";
import express from "express";
import authControllers from "../controllers/authControllers";

const authRouters = express.Router();

authRouters.post("/signup", authControllers.signup);
authRouters.post("/signin", authControllers.signin);
authRouters.post("/signout", verifyToken, authControllers.signout);

export default authRouters;
