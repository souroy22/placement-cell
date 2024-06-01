"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ResultSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student", required: true },
    interview: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Interview",
        required: true,
    },
    result: {
        type: String,
        enum: ["PASS", "FAIL", "On_Hold", "DIDNOT_ATTEMPT", "PENDING"],
        default: "PENDING",
    },
}, { timestamps: true });
const Result = (0, mongoose_1.model)("Result", ResultSchema);
exports.default = Result;
//# sourceMappingURL=resultModel.js.map