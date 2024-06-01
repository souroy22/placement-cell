"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDateFormat = void 0;
const moment_1 = __importDefault(require("moment"));
const isValidDateFormat = (dateStr, format = "DD/MM/YYYY") => {
    // Parse the date with strict format validation
    const date = (0, moment_1.default)(dateStr, format, true);
    // Return whether the date is valid
    return date.isValid();
};
exports.isValidDateFormat = isValidDateFormat;
//# sourceMappingURL=checkValidDateFormat.js.map