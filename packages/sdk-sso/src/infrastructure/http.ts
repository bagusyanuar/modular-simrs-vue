import { HttpClient } from '@genossys-hospital/http-sdk';

export class SSOHttp {
  public readonly client: HttpClient;

  constructor(baseUrl: string) {
    this.client = new HttpClient({
      baseURL: baseUrl,
    });
  }
}
