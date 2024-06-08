import AXIOS from "../configs/axiosConfig";

export const getResults = async (slug: string) => {
  let query = "";
  if (slug) {
    query += `slug=${slug}`;
  }
  const res = await AXIOS.get(`/result/all?${query}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const apply = async (interviewSlug: string, studentSlug: string) => {
  const res = await AXIOS.post("/interview/apply", {
    interviewSlug,
    studentSlug,
  });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const downloadResult = async () => {
  const res = await AXIOS.get("/result/download");
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
