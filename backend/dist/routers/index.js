"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouters_1 = __importDefault(require("./authRouters"));
const batchRouters_1 = __importDefault(require("./batchRouters"));
const studentRouters_1 = __importDefault(require("./studentRouters"));
const interviewRouters_1 = __importDefault(require("./interviewRouters"));
const resultRouters_1 = __importDefault(require("./resultRouters"));
const routers = express_1.default.Router();
routers.use("/auth", authRouters_1.default);
routers.use("/batch", batchRouters_1.default);
routers.use("/student", studentRouters_1.default);
routers.use("/interview", interviewRouters_1.default);
routers.use("/result", resultRouters_1.default);
exports.default = routers;
//# sourceMappingURL=index.js.map