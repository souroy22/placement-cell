import Employee from "../models/employee";

const getEmployeeData = async (email: string) => {
  if (!email?.trim()) {
    return null;
  }
  const isExist = await Employee.findOne({ email });
  return isExist ? isExist : null;
};

export default getEmployeeData;
