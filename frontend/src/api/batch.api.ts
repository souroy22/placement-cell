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
