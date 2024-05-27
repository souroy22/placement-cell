import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IEmployee extends Document {
  name: string;
  email: string;
  password: string;
}

const employeeSchema = new Schema<IEmployee>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (error) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  }
  return next();
});

const Employee = model<IEmployee>("Employee", employeeSchema);

export default Employee;
