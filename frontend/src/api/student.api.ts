import AXIOS from "../configs/axiosConfig";

export const getAllStudents = async (
  page: number = 1,
  searchValue: string = ""
) => {
  let query = "";
  query += `page=${page}`;
  if (searchValue.trim()) {
    query += `&searchValue=${searchValue}`;
  }
  const res = await AXIOS.get(`/student/all?${query}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const createNewStudent = async (data: any) => {
  const res = await AXIOS.post(`/student/add`, { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const getNotAppliedStudents = async (slug: string) => {
  const res = await AXIOS.get(`/student/all/not-applied/${slug}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const updateStudentData = async (slug: string, data: any) => {
  const res = await AXIOS.patch(`/student/update/${slug}`, { ...data });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const deleteStudent = async (slug: string) => {
  const res = await AXIOS.delete(`/student/delete/${slug}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
