import { Schema, model, Document } from "mongoose";

interface IStudent extends Document {
  name: string;
  college: string;
  batch: Schema.Types.ObjectId;
  status: "placed" | "not_placed";
  dsaScore: number;
  webdScore: number;
  reactScore: number;
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  college: { type: String, required: true },
  batch: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
  status: { type: String, enum: ["placed", "not_placed"], required: true },
  dsaScore: { type: Number, required: true },
  webdScore: { type: Number, required: true },
  reactScore: { type: Number, required: true },
});

const Student = model<IStudent>("Student", StudentSchema);

export default Student;
