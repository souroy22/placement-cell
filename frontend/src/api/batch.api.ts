import AXIOS from "../configs/axiosConfig";

export const getAllBatches = async (
  page: number = 1,
  searchValue: string = "",
  limit: number = 100
) => {
  let query = "";
  query += `page=${page}`;
  if (searchValue.trim()) {
    query += `&searchValue=${searchValue}`;
  }
  query += `&limit=${limit}`;
  const res = await AXIOS.get(`/batch/all?${query}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const createBatch = async (name: string) => {
  const res = await AXIOS.post("/batch/create", { name });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const updateBatch = async (name: string, slug: string) => {
  const res = await AXIOS.patch(`/batch/update/${slug}`, { name });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const deleteBatch = async (slug: string) => {
  const res = await AXIOS.delete(`/batch/delete/${slug}`);
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
