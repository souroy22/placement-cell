import { Request, Response } from "express";
import getEmployeeData from "../utils/getEmployee";
import Employee, { IEmployee } from "../models/employee";
import genarateToken, { EMPLOYEE_TYPE } from "../utils/genarateToken";
import { HydratedDocument } from "mongoose";
import verifyPassword from "../utils/verifyPassword";
import destroyToken from "./../utils/destroyToken";

const authControllers = {
  signup: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      if (!(name && email && password)) {
        return res.status(400).json({ error: "Please fill all the details" });
      }
      const isExist = await getEmployeeData(email);
      if (isExist !== null) {
        return res.status(409).json({ error: "Email ID already exists." });
      }
      const newEmployee: HydratedDocument<IEmployee> = new Employee({
        name,
        email,
        password,
      });
      await newEmployee.save();
      const employee: EMPLOYEE_TYPE = {
        name: newEmployee.name,
        email: newEmployee.email,
        id: newEmployee.id,
      };
      const token = await genarateToken(employee);
      return res.status(200).json({
        employee,
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  signin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return res.status(400).json({ error: "Please fill all the details" });
      }
      const employee: HydratedDocument<IEmployee> = await getEmployeeData(
        email
      );
      if (employee === null) {
        return res.status(404).json({ error: "Email ID not found" });
      }
      if (!verifyPassword(password, employee.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const structuredEmployee: EMPLOYEE_TYPE = {
        name: employee.name,
        email: employee.email,
        id: employee.id,
      };
      const token = await genarateToken(structuredEmployee);
      return res.status(200).json({
        employee: structuredEmployee,
        token,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong!" });
      }
    }
  },
  signout: async (req: Request, res: Response) => {
    try {
      destroyToken(req);
      return res.status(200).json({ msg: "Successfully logged out!" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
        return res.status(500).json({ error: "Something went wrong" });
      }
    }
  },
};

export default authControllers;
