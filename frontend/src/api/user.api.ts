import AXIOS from "../configs/axiosConfig";

export const getUser = async () => {
  const res: any = await AXIOS.get("/user");
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
