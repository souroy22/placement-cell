"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const authControllers_1 = __importDefault(require("../controllers/authControllers"));
const authRouters = express_1.default.Router();
authRouters.post("/signup", authControllers_1.default.signup);
authRouters.post("/signin", authControllers_1.default.signin);
authRouters.get("/signout", verifyToken_1.verifyToken, authControllers_1.default.signout);
exports.default = authRouters;
//# sourceMappingURL=authRouters.js.map