"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InterviewSchema = new mongoose_1.Schema({
    companyName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: String, required: true },
}, { timestamps: true });
const Interview = (0, mongoose_1.model)("Interview", InterviewSchema);
exports.default = Interview;
//# sourceMappingURL=interviewModel.js.map