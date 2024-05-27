import { Schema, model, Document } from "mongoose";

interface IResult extends Document {
  student: Schema.Types.ObjectId;
  interview: Schema.Types.ObjectId;
  result: "PASS" | "FAIL" | "On Hold" | "Didn’t Attempt";
}

const ResultSchema = new Schema<IResult>({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  interview: { type: Schema.Types.ObjectId, ref: "Interview", required: true },
  result: {
    type: String,
    enum: ["PASS", "FAIL", "On Hold", "Didn’t Attempt"],
    required: true,
  },
});

const Result = model<IResult>("Result", ResultSchema);

export default Result;
