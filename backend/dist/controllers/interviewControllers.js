"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const interviewModel_1 = __importDefault(require("../models/interviewModel"));
const checkValidDateFormat_1 = require("../utils/checkValidDateFormat");
const pagination_1 = require("../utils/pagination");
const resultModel_1 = __importDefault(require("../models/resultModel"));
const studentModel_1 = __importDefault(require("../models/studentModel"));
const interviewControllers = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { companyName, date } = req.body;
            if (!(0, checkValidDateFormat_1.isValidDateFormat)(date)) {
                return res.status(400).json({ error: "Invalid date format!" });
            }
            let slug = (0, slugify_1.default)(companyName, { lower: true });
            const isSlugExist = yield interviewModel_1.default.findOne({ slug });
            if (isSlugExist) {
                const uid = new short_unique_id_1.default({ length: 4 });
                slug = slug + uid.rnd();
            }
            const newInterView = new interviewModel_1.default({
                companyName,
                date,
                slug,
            });
            yield newInterView.save();
            return res.status(200).json({
                companyName: newInterView.companyName,
                date: newInterView.date,
                slug: newInterView.slug,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getAllInterviews: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { searchValue = "" } = req.query;
            // Build the search query
            const searchQuery = searchValue
                ? {
                    name: { $regex: searchValue, $options: "i" },
                }
                : {};
            // Fetch data with pagination, sorting, and searching
            const query = interviewModel_1.default.find(searchQuery, {
                companyName: 1,
                slug: 1,
                date: 1,
                _id: 0,
            });
            const result = yield (0, pagination_1.paginate)(query, req.pagination);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    updateInterview: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const interview = yield interviewModel_1.default.findOne({ slug });
            if (!interview) {
                return res.status(404).json({ error: "No Student found!" });
            }
            const updateData = {};
            const fields = ["companyName", "date"];
            if (req.body.date && !(0, checkValidDateFormat_1.isValidDateFormat)(req.body.date)) {
                return res.status(400).json({ error: "Invalid date format" });
            }
            fields.forEach((field) => {
                if (req.body[field] !== undefined &&
                    req.body[field] !== interview[field]) {
                    updateData[field] = req.body[field];
                }
            });
            if (!Object.keys(updateData).length) {
                return res.status(400).json({ error: "All data are same" });
            }
            const updatedStudent = yield interviewModel_1.default.findOneAndUpdate({ slug }, { $set: updateData }, { new: true }).select({
                companyName: 1,
                date: 1,
                slug: 1,
                _id: 0,
            });
            return res.status(200).json(updatedStudent);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    deleteInterview: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const deletedInterview = yield interviewModel_1.default.findOneAndDelete({ slug });
            if (!deletedInterview) {
                return res.status(404).json({ error: "No such interview found!" });
            }
            return res.status(200).json({ msg: "Interview successfully deleted" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    applyForInterview: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { interviewSlug, studentSlug, resultStatus = "PENDING" } = req.body;
            const student = yield studentModel_1.default.findOne({
                slug: studentSlug,
            }).populate("batch");
            if (!student) {
                return res.status(400).json({ error: "Invalid student" });
            }
            const interview = yield interviewModel_1.default.findOne({ slug: interviewSlug });
            if (!interview) {
                return res.status(400).json({ error: "Invalid interview" });
            }
            const isAlreadyApplied = yield resultModel_1.default.findOne({
                interview: interview.id,
                student: student.id,
            });
            if (isAlreadyApplied) {
                return res
                    .status(400)
                    .json({ error: "Already applied to this company!" });
            }
            const result = new resultModel_1.default({
                student: student.id,
                interview: interview.id,
                resultStatus,
            });
            yield result.save();
            const populatedBatch = student.batch;
            return res.status(200).json({
                student: {
                    name: student.name,
                    email: student.email,
                    slug: student.slug,
                    college: student.college,
                    status: student.status,
                    dsaScore: student.dsaScore,
                    webdScore: student.webdScore,
                    reactScore: student.reactScore,
                    batch: { name: populatedBatch.name, slug: populatedBatch.slug },
                },
                interview: {
                    companyName: interview.companyName,
                    slug: interview.slug,
                    date: interview.date,
                },
                result: resultStatus,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = interviewControllers;
//# sourceMappingURL=interviewControllers.js.map