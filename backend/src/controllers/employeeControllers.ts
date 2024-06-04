import { Request, Response } from "express";
import Employee from "../models/employee";

const employeeControllers = {
  getUser: async (req: Request, res: Response) => {
    try {
      const { employee } = req.user;
      if (!employee) {
        return res.status(401).json({ error: "Invalid User" });
      }
      const isExist = await Employee.findById(employee.id);
      if (!isExist) {
        return res.status(401).json({ error: "No user found" });
      }
      return res.status(200).json({ name: isExist.name, email: isExist.email });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
};

export default employeeControllers;
