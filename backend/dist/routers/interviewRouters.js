"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const pagination_1 = require("../utils/pagination");
const interviewControllers_1 = __importDefault(require("../controllers/interviewControllers"));
const interviewRouters = express_1.default.Router();
interviewRouters.post("/create", verifyToken_1.verifyToken, interviewControllers_1.default.create);
interviewRouters.get("/all", verifyToken_1.verifyToken, pagination_1.paginateMiddleware, interviewControllers_1.default.getAllInterviews);
interviewRouters.patch("/update/:slug", verifyToken_1.verifyToken, interviewControllers_1.default.updateInterview);
interviewRouters.delete("/delete/:slug", verifyToken_1.verifyToken, interviewControllers_1.default.deleteInterview);
interviewRouters.post("/apply", verifyToken_1.verifyToken, interviewControllers_1.default.applyForInterview);
exports.default = interviewRouters;
//# sourceMappingURL=interviewRouters.js.map