import useUserStore from "@/core/stores/user-store";
import { getAuthToken } from "@/helpers/auth/token";
import axios, { InternalAxiosRequestConfig } from "axios";

const axiosObject = axios.create();

const getToken = () => {
  const token = getAuthToken();
  return token;
};

axiosObject?.interceptors?.request?.use(
  async (config: InternalAxiosRequestConfig<any>) => {
    config.headers = {
      ...(config.headers as any),
      Authorization: `Bearer ${getToken()}`,
    };
    return config;
  }
);

export default axiosObject;
