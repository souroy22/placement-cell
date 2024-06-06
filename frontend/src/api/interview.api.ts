import AXIOS from "../configs/axiosConfig";
import { INTERVIEW_FORM_TYPE } from "../pages/interviews";

export const getAllInterviews = async (
  page: number = 1,
  searchValue: string = ""
) => {
  let query = "";
  query += `page=${page}`;
  if (searchValue.trim()) {
    query += `&searchValue=${searchValue}`;
  }
  const res = await AXIOS.get(`/interview/all?${query}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const createInterview = async (data: INTERVIEW_FORM_TYPE) => {
  const res = await AXIOS.post("/interview/create", { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
