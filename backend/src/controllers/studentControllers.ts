import { Request, Response } from "express";
import Student, { IStudent } from "../models/studentModel";
import Batch, { IBatch } from "../models/batchModel";
import { HydratedDocument } from "mongoose";
import slugify from "slugify";
import ShortUniqueId from "short-unique-id";

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
};

export default studentControllers;
