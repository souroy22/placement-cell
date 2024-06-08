import { Request, Response } from "express";
import Result, { IResult, RESULT_STATUS } from "../models/resultModel";
import Student, { IStudent } from "../models/studentModel";
import { HydratedDocument, ObjectId } from "mongoose";
import { paginate } from "../utils/pagination";
import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import Interview, { IInterview } from "../models/interviewModel";

type QUERY_TYPE = {
  student?: ObjectId;
  interview?: ObjectId;
  result?: RESULT_STATUS;
};

const resultControllers = {
  updateResultStatus: async (req: Request, res: Response) => {
    try {
      const { studentSlug, resultStatus } = req.body;
      const student = await Student.findOne({ slug: studentSlug });
      if (!student) {
        return res.status(400).json({ error: "No such student found!" });
      }
      const result: HydratedDocument<IResult> | null = await Result.findOne({
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
      const updatedResult = await Result.findByIdAndUpdate(
        result.id,
        { $set: { result: resultStatus } },
        { new: true }
      );
      return res.status(201).json({ result: updatedResult.result });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  getAllResults: async (req: Request, res: Response) => {
    const { slug } = req.query;
    let searchQuery = {};
    if (slug) {
      const interview = await Interview.findOne({ slug });
      if (interview) {
        searchQuery = {
          interview: interview._id,
        };
      }
    }

    try {
      const query = Result.find(searchQuery)
        .select("-_id -createdAt -updatedAt")
        .populate([
          {
            path: "student",
            select:
              "name email college status dsaScore webdScore reactScore batch slug -_id",
            populate: { path: "batch", select: "name slug -_id" },
          },
          {
            path: "interview",
            select: "companyName date slug -_id",
          },
        ]);
      const result = await paginate(query, req.pagination);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  downloadResult: async (req: Request, res: Response) => {
    try {
      const { studentSlug, interviewSlug, status } = req.query as {
        studentSlug?: string;
        interviewSlug?: string;
        status?: RESULT_STATUS;
      };
      const query: QUERY_TYPE = {};
      if (studentSlug) {
        const student = await Student.findOne({ slug: studentSlug });
        if (!student) {
          return res.status(400).json({ error: "Invalid student" });
        }
        query.student = student.id;
      }
      if (interviewSlug) {
        const interview = await Interview.findOne({ slug: interviewSlug });
        if (!interview) {
          return res.status(400).json({ error: "Invalid interview" });
        }
        query.interview = interview.id;
      }
      if (status) {
        query.result = status;
      }

      const results = await Result.find(query)
        .populate<{ student: IStudent }>("student")
        .populate<{ interview: IInterview }>("interview");

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

      const csvWriter = createObjectCsvWriter({
        path: path.join(__dirname, "students.csv"),
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

      await csvWriter.writeRecords(records);
      return res.status(200).download(path.join(__dirname, "students.csv"));
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default resultControllers;
