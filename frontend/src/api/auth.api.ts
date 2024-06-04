import { DATA_TYPE } from "../components/LoginForm";
import AXIOS from "../configs/axiosConfig";

export const signin = async (data: DATA_TYPE) => {
  const res: any = await AXIOS.post("/auth/signin", {
    ...data,
  });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const signup = async (data: DATA_TYPE) => {
  const res: any = await AXIOS.post("/auth/signup", {
    ...data,
  });
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};

export const signout = async () => {
  const res: any = await AXIOS.get("/auth/signout");
  if (res.data.error) {
    return Promise.reject(res.data.error);
  }
  return res.data;
};
