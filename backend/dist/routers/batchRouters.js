"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const batchControllers_1 = __importDefault(require("../controllers/batchControllers"));
const pagination_1 = require("../utils/pagination");
const batchRouters = express_1.default.Router();
batchRouters.post("/create", verifyToken_1.verifyToken, batchControllers_1.default.createBatch);
batchRouters.get("/all", verifyToken_1.verifyToken, pagination_1.paginateMiddleware, batchControllers_1.default.getAllBatches);
batchRouters.patch("/update/:slug", verifyToken_1.verifyToken, batchControllers_1.default.updateBatch);
batchRouters.delete("/delete/:slug", verifyToken_1.verifyToken, batchControllers_1.default.deleteBatch);
exports.default = batchRouters;
//# sourceMappingURL=batchRouters.js.map