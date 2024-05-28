import { Schema, model, Document } from "mongoose";

export interface IStudent extends Document {
  name: string;
  email: string;
  slug: string;
  college: string;
  batch: Schema.Types.ObjectId;
  status: "placed" | "not_placed";
  dsaScore: number;
  webdScore: number;
  reactScore: number;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    college: { type: String, required: true },
    batch: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    status: {
      type: String,
      enum: ["placed", "not_placed"],
      default: "not_placed",
    },
    dsaScore: { type: Number, required: true },
    webdScore: { type: Number, required: true },
    reactScore: { type: Number, required: true },
  },
  { timestamps: true }
);

const Student = model<IStudent>("Student", StudentSchema);

export default Student;
