"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentControllers_1 = __importDefault(require("../controllers/studentControllers"));
const verifyToken_1 = require("../middlewares/verifyToken");
const pagination_1 = require("../utils/pagination");
const studentRouters = express_1.default.Router();
studentRouters.post("/add", verifyToken_1.verifyToken, studentControllers_1.default.addStudent);
studentRouters.get("/all", verifyToken_1.verifyToken, pagination_1.paginateMiddleware, studentControllers_1.default.getStudentList);
studentRouters.patch("/update/:slug", verifyToken_1.verifyToken, studentControllers_1.default.updateStudent);
studentRouters.delete("/delete/:slug", verifyToken_1.verifyToken, studentControllers_1.default.deleteStudent);
studentRouters.get("/all/not-applied/:slug", verifyToken_1.verifyToken, studentControllers_1.default.getNotAppliedStudents);
exports.default = studentRouters;
//# sourceMappingURL=studentRouters.js.map