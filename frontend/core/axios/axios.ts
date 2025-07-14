import { AxiosMethods } from "../types&enums/enums";
import axiosObject from "./axiosObject";

export type MakeRequest = {
  url: string;
  method: AxiosMethods;
  data?: any;
  params?: any;
  headers?: any;
};

export const makeRequest = async (req: MakeRequest) => {
  const { url, method, data, params, headers } = req;
  return axiosObject({
    url: "http://localhost:9000" + url,
    method,
    data,
    headers,
    params,
  }).then((res) => {
    return res.data;
  });
};
