"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const pagination_1 = require("../utils/pagination");
const resultControllers_1 = __importDefault(require("../controllers/resultControllers"));
const resultRouters = express_1.default.Router();
resultRouters.get("/all", verifyToken_1.verifyToken, pagination_1.paginateMiddleware, resultControllers_1.default.getAllResults);
resultRouters.patch("/update-status", verifyToken_1.verifyToken, resultControllers_1.default.updateResultStatus);
resultRouters.get("/download", verifyToken_1.verifyToken, resultControllers_1.default.downloadResult);
exports.default = resultRouters;
//# sourceMappingURL=resultRouters.js.map