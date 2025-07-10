import useUserStore from "@/stores/user-store";
import axios, { InternalAxiosRequestConfig } from "axios";

const axiosObject = axios.create();

const getToken = () => {
  const { token } = useUserStore?.getState();
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
