"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const employeeControllers_1 = __importDefault(require("../controllers/employeeControllers"));
const employeeRouters = express_1.default.Router();
employeeRouters.get("/", verifyToken_1.verifyToken, employeeControllers_1.default.getUser);
exports.default = employeeRouters;
//# sourceMappingURL=employeeRouters.js.map