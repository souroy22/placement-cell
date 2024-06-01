import { Schema, model, Document } from "mongoose";

export interface IInterview extends Document {
  companyName: string;
  slug: string;
  date: string;
}

const InterviewSchema = new Schema<IInterview>(
  {
    companyName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const Interview = model<IInterview>("Interview", InterviewSchema);

export default Interview;
