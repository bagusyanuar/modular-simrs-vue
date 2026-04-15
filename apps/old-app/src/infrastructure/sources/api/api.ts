import { mainInterceptors } from "./api.interceptors";
import { AxiosService } from "./api.provider";

const apiService = new AxiosService(
  {
    baseURL: import.meta.env.VITE_API_URL as string,
    headers: {
      "Content-Type": "application/json",
    },
  },
  mainInterceptors,
);

export default apiService.api;
