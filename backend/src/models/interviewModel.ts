import { Schema, model, Document } from "mongoose";

interface IInterview extends Document {
  companyName: string;
  date: Date;
}

const InterviewSchema = new Schema<IInterview>({
  companyName: { type: String, required: true },
  date: { type: Date, required: true },
});

const Interview = model<IInterview>("Interview", InterviewSchema);

export default Interview;
