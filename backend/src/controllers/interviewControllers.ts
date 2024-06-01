import { Request, Response } from "express";
import slugify from "slugify";
import ShortUniqueId from "short-unique-id";
import Interview, { IInterview } from "../models/interviewModel";
import { isValidDateFormat } from "../utils/checkValidDateFormat";
import { paginate } from "../utils/pagination";
import { HydratedDocument } from "mongoose";
import Result, { IResult } from "../models/resultModel";
import Student, { IStudent } from "../models/studentModel";
import { IBatch } from "../models/batchModel";

const interviewControllers = {
  create: async (req: Request, res: Response) => {
    try {
      const { companyName, date } = req.body;
      if (!isValidDateFormat(date)) {
        return res.status(400).json({ error: "Invalid date format!" });
      }
      let slug = slugify(companyName, { lower: true });
      const isSlugExist = await Interview.findOne({ slug });
      if (isSlugExist) {
        const uid = new ShortUniqueId({ length: 4 });
        slug = slug + uid.rnd();
      }
      const newInterView = new Interview({
        companyName,
        date,
        slug,
      });
      await newInterView.save();
      return res.status(200).json({
        companyName: newInterView.companyName,
        date: newInterView.date,
        slug: newInterView.slug,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  getAllInterviews: async (req: Request, res: Response) => {
    try {
      const { searchValue = "" } = req.query;
      // Build the search query
      const searchQuery = searchValue
        ? {
            name: { $regex: searchValue, $options: "i" },
          }
        : {};
      // Fetch data with pagination, sorting, and searching
      const query = Interview.find(searchQuery, {
        companyName: 1,
        slug: 1,
        date: 1,
        _id: 0,
      });
      const result = await paginate(query, req.pagination);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  updateInterview: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const interview = await Interview.findOne({ slug });
      if (!interview) {
        return res.status(404).json({ error: "No Student found!" });
      }
      const updateData: Partial<Record<keyof IInterview, any>> = {};

      const fields: (keyof IInterview)[] = ["companyName", "date"];
      if (req.body.date && !isValidDateFormat(req.body.date)) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      fields.forEach((field) => {
        if (
          req.body[field] !== undefined &&
          req.body[field] !== interview[field]
        ) {
          updateData[field] = req.body[field];
        }
      });
      if (!Object.keys(updateData).length) {
        return res.status(400).json({ error: "All data are same" });
      }

      const updatedStudent: HydratedDocument<IInterview> | null =
        await Interview.findOneAndUpdate(
          { slug },
          { $set: updateData },
          { new: true }
        ).select({
          companyName: 1,
          date: 1,
          slug: 1,
          _id: 0,
        });
      return res.status(200).json(updatedStudent);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  deleteInterview: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const deletedInterview = await Interview.findOneAndDelete({ slug });
      if (!deletedInterview) {
        return res.status(404).json({ error: "No such interview found!" });
      }
      return res.status(200).json({ msg: "Interview successfully deleted" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  applyForInterview: async (req: Request, res: Response) => {
    try {
      const { interviewSlug, studentSlug, resultStatus = "PENDING" } = req.body;
      const student: HydratedDocument<IStudent> | null = await Student.findOne({
        slug: studentSlug,
      }).populate("batch");
      if (!student) {
        return res.status(400).json({ error: "Invalid student" });
      }
      const interview: HydratedDocument<IInterview> | null =
        await Interview.findOne({ slug: interviewSlug });
      if (!interview) {
        return res.status(400).json({ error: "Invalid interview" });
      }
      const isAlreadyApplied = await Result.findOne({
        interview: interview.id,
        student: student.id,
      });
      if (isAlreadyApplied) {
        return res
          .status(400)
          .json({ error: "Already applied to this company!" });
      }

      const result: HydratedDocument<IResult> | null = new Result({
        student: student.id,
        interview: interview.id,
        resultStatus,
      });
      await result.save();
      const populatedBatch = student.batch as HydratedDocument<IBatch>;
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
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default interviewControllers;
