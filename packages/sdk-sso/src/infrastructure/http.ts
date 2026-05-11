import { HttpClient } from '@genossys-hospital/http-sdk';

export class SSOHttp {
  public readonly client: HttpClient;

  constructor(baseUrl: string) {
    this.client = new HttpClient({
      baseURL: baseUrl,
      withCredentials: true,
      timeout: 15_000,
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
