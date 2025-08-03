import { getAuthToken } from "@/core/helpers/auth/token";
import { getServerToken } from "@/core/helpers/auth/token-from-server";
import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = (isServer: boolean) => {
  const axiosObject = axios.create();

  const getToken = async () => {
    if (isServer) {
      // If on the server, get the token from the request context
      const token = await getServerToken();

      return token;
    }
    const token = getAuthToken();
    return token;
  };

  axiosObject?.interceptors?.request?.use(
    async (config: InternalAxiosRequestConfig<any>) => {
      config.headers = {
        ...(config.headers as any),
        Authorization: `Bearer ${(await getToken()) ?? ""}`,
      };
      return config;
    }
  );

  return axiosObject;
};

export default axiosInstance;
