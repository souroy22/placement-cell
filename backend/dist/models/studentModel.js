"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StudentSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    college: { type: String, required: true },
    batch: { type: mongoose_1.Schema.Types.ObjectId, ref: "Batch", required: true },
    status: {
        type: String,
        enum: ["placed", "not_placed"],
        default: "not_placed",
    },
    dsaScore: { type: Number, required: true },
    webdScore: { type: Number, required: true },
    reactScore: { type: Number, required: true },
}, { timestamps: true });
const Student = (0, mongoose_1.model)("Student", StudentSchema);
exports.default = Student;
//# sourceMappingURL=studentModel.js.map