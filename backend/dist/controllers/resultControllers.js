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
const resultModel_1 = __importDefault(require("../models/resultModel"));
const studentModel_1 = __importDefault(require("../models/studentModel"));
const pagination_1 = require("../utils/pagination");
const csv_writer_1 = require("csv-writer");
const path_1 = __importDefault(require("path"));
const interviewModel_1 = __importDefault(require("../models/interviewModel"));
const resultControllers = {
    updateResultStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { studentSlug, resultStatus } = req.body;
            const student = yield studentModel_1.default.findOne({ slug: studentSlug });
            if (!student) {
                return res.status(400).json({ error: "No such student found!" });
            }
            const result = yield resultModel_1.default.findOne({
                student: student.id,
            });
            if (!result) {
                return res.status(400).json({ error: "No such result found!" });
            }
            if (result.result === resultStatus) {
                return res
                    .status(400)
                    .json({ error: "No need to update result. Already updated!" });
            }
            const updatedResult = yield resultModel_1.default.findByIdAndUpdate(result.id, { $set: { result: resultStatus } }, { new: true });
            return res.status(201).json({ result: updatedResult.result });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getAllResults: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = resultModel_1.default.find().populate([
                {
                    path: "student",
                    select: "name email college status dsaScore webdScore reactScore batch slug -_id",
                },
                {
                    path: "interview",
                    select: "companyName date slug -_id",
                },
            ]);
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
    downloadResult: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { studentSlug, interviewSlug, status } = req.query;
            const query = {};
            if (studentSlug) {
                const student = yield studentModel_1.default.findOne({ slug: studentSlug });
                if (!student) {
                    return res.status(400).json({ error: "Invalid student" });
                }
                query.student = student.id;
            }
            if (interviewSlug) {
                const interview = yield interviewModel_1.default.findOne({ slug: interviewSlug });
                if (!interview) {
                    return res.status(400).json({ error: "Invalid interview" });
                }
                query.interview = interview.id;
            }
            if (status) {
                query.result = status;
            }
            const results = yield resultModel_1.default.find(query)
                .populate("student")
                .populate("interview");
            const records = results.map((result) => {
                const student = result.student;
                const interview = result.interview;
                return {
                    studentId: student.id,
                    studentName: student.name,
                    studentCollege: student.college,
                    studentStatus: student.status,
                    DSAFinalScore: student.dsaScore,
                    WebDFinalScore: student.webdScore,
                    ReactFinalScore: student.reactScore,
                    interviewDate: interview.date,
                    interviewCompany: interview.companyName,
                    result: result.result,
                };
            });
            const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
                path: path_1.default.join(__dirname, "students.csv"),
                header: [
                    { id: "studentId", title: "Student ID" },
                    { id: "studentName", title: "Student Name" },
                    { id: "studentCollege", title: "Student College" },
                    { id: "studentStatus", title: "Student Status" },
                    { id: "DSAFinalScore", title: "DSA Final Score" },
                    { id: "WebDFinalScore", title: "WebD Final Score" },
                    { id: "ReactFinalScore", title: "React Final Score" },
                    { id: "interviewDate", title: "Interview Date" },
                    { id: "interviewCompany", title: "Interview Company" },
                    { id: "result", title: "Result" },
                ],
            });
            yield csvWriter.writeRecords(records);
            return res.status(200).download(path_1.default.join(__dirname, "students.csv"));
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = resultControllers;
//# sourceMappingURL=resultControllers.js.map