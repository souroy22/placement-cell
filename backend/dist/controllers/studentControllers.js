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
const studentModel_1 = __importDefault(require("../models/studentModel"));
const batchModel_1 = __importDefault(require("../models/batchModel"));
const slugify_1 = __importDefault(require("slugify"));
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const pagination_1 = require("../utils/pagination");
const resultModel_1 = __importDefault(require("../models/resultModel"));
const interviewModel_1 = __importDefault(require("../models/interviewModel"));
const studentControllers = {
    addStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, college, status = "not_placed", dsaScore, webdScore, reactScore, batchSlug, } = req.body;
            const isExist = yield studentModel_1.default.findOne({ email });
            if (isExist) {
                return res.status(409).json({ error: "Email ID already exists." });
            }
            const batch = yield batchModel_1.default.findOne({
                slug: batchSlug,
            });
            if (!batch) {
                return res.status(400).json({ error: "Invalid Batch" });
            }
            let slug = (0, slugify_1.default)(name, { lower: true });
            const isSlugExist = yield studentModel_1.default.findOne({ slug });
            if (isSlugExist) {
                const uid = new short_unique_id_1.default({ length: 4 });
                slug = slug + uid.rnd();
            }
            const student = new studentModel_1.default({
                name,
                email,
                college,
                status,
                dsaScore,
                webdScore,
                reactScore,
                batch: batch.id,
                slug,
            });
            yield student.save();
            yield student.populate({ path: "batch", select: "name slug -_id" });
            return res.status(201).json({
                name: student.name,
                email: student.email,
                college: student.college,
                status: student.status,
                dsaScore: student.dsaScore,
                webdScore: student.webdScore,
                reactScore: student.reactScore,
                batch: student.batch,
                slug: student.slug,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getStudentList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { searchValue = "", status } = req.query;
            const query = {};
            if (searchValue) {
                query.$or = [
                    { name: { $regex: searchValue, $options: "i" } },
                    { email: { $regex: searchValue, $options: "i" } },
                    { college: { $regex: searchValue, $options: "i" } },
                ];
                // To search in batch name, we'll need to perform a subquery
                const batches = yield batchModel_1.default.find({
                    name: { $regex: searchValue, $options: "i" },
                }).select("_id");
                if (batches.length > 0) {
                    const batchIds = batches.map((batch) => batch._id);
                    query.$or.push({ batch: { $in: batchIds } });
                }
            }
            if (status) {
                query.status = status;
            }
            const studentQuery = studentModel_1.default.find(query, {
                name: 1,
                email: 1,
                college: 1,
                status: 1,
                dsaScore: 1,
                webdScore: 1,
                reactScore: 1,
                batch: 1,
                slug: 1,
                _id: 0,
            }).populate({ path: "batch", select: "name slug -_id" });
            const result = yield (0, pagination_1.paginate)(studentQuery, req.pagination);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    updateStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const student = yield studentModel_1.default.findOne({ slug });
            if (!student) {
                return res.status(404).json({ error: "No Student found!" });
            }
            const updateData = {};
            const fields = [
                "name",
                "email",
                "college",
                "status",
                "dsaScore",
                "webdScore",
                "reactScore",
                "batch",
            ];
            fields.forEach((field) => {
                if (req.body[field] !== undefined &&
                    req.body[field] !== student[field]) {
                    updateData[field] = req.body[field];
                }
            });
            if (!Object.keys(updateData).length) {
                return res.status(400).json({ error: "All data are same" });
            }
            const updatedStudent = yield studentModel_1.default.findOneAndUpdate({ slug }, { $set: updateData }, { new: true })
                .select({
                name: 1,
                email: 1,
                college: 1,
                status: 1,
                dsaScore: 1,
                webdScore: 1,
                reactScore: 1,
                batch: 1,
                _id: 0,
            })
                .populate({ path: "batch", select: "name slug -_id" });
            return res.status(200).json(updatedStudent);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    deleteStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const deletedStudent = yield studentModel_1.default.findOneAndDelete({ slug });
            if (!deletedStudent) {
                return res.status(404).json({ error: "No such student found!" });
            }
            return res.status(200).json({ msg: "Student deleted successfully!" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getNotAppliedStudents: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const interview = yield interviewModel_1.default.findOne({ slug }).select("_id");
            const students = yield studentModel_1.default.find().select("name slug");
            const results = [];
            for (let student of students) {
                const isApplied = yield resultModel_1.default.findOne({
                    student: student._id,
                    interview: interview._id,
                });
                if (!isApplied) {
                    results.push({ name: student.name, slug: student.slug });
                }
            }
            return res.status(200).json(results);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = studentControllers;
//# sourceMappingURL=studentControllers.js.map