import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IHttpRepository } from '@src/domain/interfaces/HttpRepository';

@Injectable()
export class HttpRepository implements IHttpRepository {
constructor(
    private readonly httpService: HttpService
) {}

async post(args: {url: string, payload?: any, config?: Record<string, string>}): Promise<any> {
    try {
      const { url,  payload, config} = args;
      const response = await firstValueFrom(
        this.httpService.post(url, payload, config),
      );
      return response?.data;
    } catch (error) {
      console.error(`Error Post Method ${error}`);
      throw error;
    }
  }

  async get(args: { url: string; config?: Record<string, string> }): Promise<any> {
    try {
      const { url, config } = args;
      const response = await firstValueFrom(
        this.httpService.get(url, config),
      );
      return response?.data;
    } catch (error) {
      console.error(`Error Get Method ${error}`);
      throw error;
    }
  }
  
}
