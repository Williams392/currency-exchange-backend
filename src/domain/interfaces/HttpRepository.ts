import { AxiosRequestConfig } from 'axios';

export interface IHttpRepository {
  post(args: {url: string, payload?: any, config?: AxiosRequestConfig}): Promise<any>
  get(args: { url: string; config?: AxiosRequestConfig }): Promise<any>;
}