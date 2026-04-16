import { mainInterceptors } from "./api.interceptors";
import { AxiosService } from "./api.provider";

const apiService = new AxiosService(
  {
    baseURL: import.meta.env.VITE_GLOBAL_API_BASE_URL as string,
    headers: {
      "Content-Type": "application/json",
    },
  },
  mainInterceptors,
);

export default apiService.api;
