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
const batchModel_1 = __importDefault(require("../models/batchModel"));
const pagination_1 = require("../utils/pagination");
const batchControllers = {
    createBatch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            let slug = (0, slugify_1.default)(name, { lower: true });
            const isSlugExist = yield batchModel_1.default.findOne({ slug });
            if (isSlugExist) {
                const uid = new short_unique_id_1.default({ length: 4 });
                slug = slug + uid.rnd();
            }
            const newBatch = new batchModel_1.default({
                name,
                slug,
            });
            yield newBatch.save();
            return res.status(200).json({ name: newBatch.name, slug: newBatch.slug });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    getAllBatches: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { searchValue = "" } = req.query;
            // Build the search query
            const searchQuery = searchValue
                ? {
                    name: { $regex: searchValue, $options: "i" },
                }
                : {};
            // Fetch data with pagination, sorting, and searching
            const query = batchModel_1.default.find(searchQuery, {
                name: 1,
                slug: 1,
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
    updateBatch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const { name } = req.body;
            const batch = yield batchModel_1.default.findOne({ slug });
            if (!batch) {
                return res.status(404).json({ error: "No batch found!" });
            }
            const updatedBatch = yield batchModel_1.default.findOneAndUpdate({ slug }, { name }, { new: true });
            return res.status(200).json(updatedBatch);
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
    deleteBatch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const batch = yield batchModel_1.default.findOne({ slug });
            if (!batch) {
                return res.status(404).json({ error: "No batch found!" });
            }
            yield batchModel_1.default.findOneAndDelete({ slug });
            return res.status(200).json({ msg: "Batch deleted successfully" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(`Error: ${error.message}`);
                return res.status(500).json({ error: "Something went wrong!" });
            }
        }
    }),
};
exports.default = batchControllers;
//# sourceMappingURL=batchControllers.js.map