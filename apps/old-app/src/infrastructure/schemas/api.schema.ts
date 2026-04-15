export interface APIResponse<T> {
  meta: {
    message: string;
  };
  data?: T;
}
