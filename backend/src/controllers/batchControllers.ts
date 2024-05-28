import { Request, Response } from "express";
import slugify from "slugify";
import ShortUniqueId from "short-unique-id";
import Batch from "../models/batchModel";

const batchControllers = {
  createBatch: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      let slug = slugify(name, { lower: true });
      const isSlugExist = await Batch.findOne({ slug });
      if (isSlugExist) {
        const uid = new ShortUniqueId({ length: 4 });
        slug = slug + uid.rnd();
      }
      const newBatch = new Batch({
        name,
        slug,
      });
      await newBatch.save();
      return res.status(200).json({ name: newBatch.name, slug: newBatch.slug });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  getAllBatches: async (req: Request, res: Response) => {
    try {
      const {
        limit = 30,
        page = 1,
        sortOrder = null,
        searchValue = "",
        sortBy = "createdAt",
      } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      const sortDirection = sortOrder === "desc" ? -1 : 1;

      // Build the search query
      const searchQuery = searchValue
        ? {
            name: { $regex: searchValue, $options: "i" },
          }
        : {};

      let sortQuery: {} = sortOrder
        ? { [sortBy as string]: sortDirection }
        : {};

      // Fetch data with pagination, sorting, and searching
      const batches = await Batch.find(searchQuery, {
        name: 1,
        slug: 1,
        _id: 0,
      })
        .sort(sortQuery)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

      // Get the total count of documents that match the search query
      const totalCount = await Batch.countDocuments(searchQuery);
      return res.status(200).json({
        data: batches,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        totalCount,
        limit: limitNumber,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  updateBatch: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const { name } = req.body;
      const batch = await Batch.findOne({ slug });
      if (!batch) {
        return res.status(404).json({ error: "No batch found!" });
      }
      const updatedBatch = await Batch.findOneAndUpdate(
        { slug },
        { name },
        { new: true }
      );
      return res.status(200).json(updatedBatch);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  deleteBatch: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const batch = await Batch.findOne({ slug });
      if (!batch) {
        return res.status(404).json({ error: "No batch found!" });
      }
      await Batch.findOneAndDelete({ slug });
      return res.status(200).json({ msg: "Batch deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default batchControllers;
