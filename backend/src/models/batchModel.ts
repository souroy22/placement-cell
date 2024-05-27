import { Schema, model, Document } from "mongoose";

interface IBatch extends Document {
  name: string;
}

const BatchSchema = new Schema<IBatch>({
  name: { type: String, required: true },
});

const Batch = model<IBatch>("Batch", BatchSchema);

export default Batch;
