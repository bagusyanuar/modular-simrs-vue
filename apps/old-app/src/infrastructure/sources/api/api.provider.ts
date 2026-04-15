import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
  type CreateAxiosDefaults,
} from "axios";

/**
 * Interface untuk mendefinisikan interceptors.
 * Menggunakan 'unknown' atau 'Promise<never>' untuk menggantikan 'any'
 * agar sesuai dengan aturan ESLint yang ketat.
 */
export interface AxiosInterceptors {
  onRequest?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  onRequestError?: (error: AxiosError) => Promise<unknown> | unknown;
  onResponse?: (
    response: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>;
  onResponseError?: (error: AxiosError) => Promise<unknown> | unknown;
}

export class AxiosService {
  private instance: AxiosInstance;

  constructor(config: CreateAxiosDefaults, interceptors: AxiosInterceptors) {
    this.instance = axios.create(config);

    // Setup Request Interceptor
    this.instance.interceptors.request.use(
      interceptors.onRequest,
      interceptors.onRequestError
    );

    // Setup Response Interceptor
    this.instance.interceptors.response.use(
      interceptors.onResponse,
      interceptors.onResponseError
    );
  }

  /**
   * Mengembalikan instance axios yang sudah dikonfigurasi.
   */
  public get api(): AxiosInstance {
    return this.instance;
  }
}