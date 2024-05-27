import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export type EMPLOYEE_TYPE = {
  name: string;
  email: string;
  id: Types.ObjectId;
};

const genarateToken = async (employee: EMPLOYEE_TYPE) => {
  const token = await jwt.sign({ employee }, process.env.SECRET_KEY || "", {
    expiresIn: "1d",
  });
  return token;
};

export default genarateToken;
