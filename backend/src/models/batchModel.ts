import { Schema, model, Document } from "mongoose";

export interface IBatch extends Document {
  name: string;
  slug: string;
}

const BatchSchema = new Schema<IBatch>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Batch = model<IBatch>("Batch", BatchSchema);

export default Batch;
