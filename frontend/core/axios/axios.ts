import { AxiosMethods } from "../types&enums/enums";
import axiosInstance from "./axiosObject";

export type MakeRequest = {
  isServer?: boolean; // Optional, default is false
  url: string;
  method: AxiosMethods;
  data?: any;
  params?: any;
  headers?: any;
};

export const makeRequest = async (req: MakeRequest) => {
  const { url, method, data, params, headers, isServer = false } = req;
  return axiosInstance(isServer)({
    url: "http://localhost:9000" + url,
    method,
    data,
    headers,
    params,
  }).then((res) => {
    return res.data;
  });
};
