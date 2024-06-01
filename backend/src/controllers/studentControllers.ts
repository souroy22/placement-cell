import { Request, Response } from "express";
import Student, { IStudent } from "../models/studentModel";
import Batch, { IBatch } from "../models/batchModel";
import { HydratedDocument } from "mongoose";
import slugify from "slugify";
import ShortUniqueId from "short-unique-id";
import { paginate } from "../utils/pagination";

const studentControllers = {
  addStudent: async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        college,
        status = "not_placed",
        dsaScore,
        webdScore,
        reactScore,
        batchSlug,
      } = req.body;
      const isExist = await Student.findOne({ email });
      if (isExist) {
        return res.status(409).json({ error: "Email ID already exists." });
      }
      const batch: HydratedDocument<IBatch> = await Batch.findOne({
        slug: batchSlug,
      });
      if (!batch) {
        return res.status(400).json({ error: "Invalid Batch" });
      }
      let slug = slugify(name, { lower: true });
      const isSlugExist = await Student.findOne({ slug });
      if (isSlugExist) {
        const uid = new ShortUniqueId({ length: 4 });
        slug = slug + uid.rnd();
      }
      const student: HydratedDocument<IStudent> = new Student({
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
      await student.save();
      await student.populate({ path: "batch", select: "name slug -_id" });
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
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  getStudentList: async (req: Request, res: Response) => {
    try {
      const { searchValue = "" } = req.query;

      // Build the search query
      const searchQuery = searchValue
        ? {
            name: { $regex: searchValue, $options: "i" },
          }
        : {};
      const query = Student.find(searchQuery, {
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
      const result = await paginate(query, req.pagination);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  updateStudent: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const student = await Student.findOne({ slug });
      if (!student) {
        return res.status(404).json({ error: "No Student found!" });
      }
      const updateData: Partial<Record<keyof IStudent, any>> = {};

      const fields: (keyof IStudent)[] = [
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
        if (
          req.body[field] !== undefined &&
          req.body[field] !== student[field]
        ) {
          updateData[field] = req.body[field];
        }
      });
      if (!Object.keys(updateData).length) {
        return res.status(400).json({ error: "All data are same" });
      }

      const updatedStudent: HydratedDocument<IStudent> | null =
        await Student.findOneAndUpdate(
          { slug },
          { $set: updateData },
          { new: true }
        )
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
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  deleteStudent: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const deletedStudent = await Student.findOneAndDelete({ slug });
      if (!deletedStudent) {
        return res.status(404).json({ error: "No such student found!" });
      }
      return res.status(200).json({ msg: "Student deleted successfully!" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default studentControllers;
