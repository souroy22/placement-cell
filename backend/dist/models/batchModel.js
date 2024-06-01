"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BatchSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
}, { timestamps: true });
const Batch = (0, mongoose_1.model)("Batch", BatchSchema);
exports.default = Batch;
//# sourceMappingURL=batchModel.js.map