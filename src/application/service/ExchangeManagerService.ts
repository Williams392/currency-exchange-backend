import { Injectable, Inject, Logger } from '@nestjs/common';
import { CreateExchangeRequestDto }      from '@src/application/interface/dto/request/exchange/CreateExchangeRequestDto';
import { ExchangeRequestPaginationDto }  from '@src/application/interface/dto/request/exchange/ExchangeRequestPaginationDto';
import {
  ExchangeRequestResponseDto,
  ExchangeRequestsResponseDto,
} from '@src/application/interface/dto/response/exchange/ExchangeRequestResponseDto';
import { ExchangeManagerDomainService } from '@src/domain/service/ExchangeManagerDomainService';

@Injectable()
export class ExchangeManagerService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly exchangeManagerDomainService: ExchangeManagerDomainService,
  ) {}

  async createExchangeRequest(
    userId: string,
    dto: CreateExchangeRequestDto,
  ): Promise<ExchangeRequestResponseDto> {
    try {
      return await this.exchangeManagerDomainService.createExchangeRequest(userId, dto);
    } catch (error) {
      this.logger.error(`Error createExchangeRequest: ${error}`);
      throw error;
    }
  }

  async getExchangeRequests(
    userId: string,
    filters: ExchangeRequestPaginationDto,
  ): Promise<ExchangeRequestsResponseDto> {
    try {
      return await this.exchangeManagerDomainService.getExchangeRequests(userId, filters);
    } catch (error) {
      this.logger.error(`Error getExchangeRequests: ${error}`);
      throw error;
    }
  }

  async getExchangeRequestById(
    requestId: string,
    userId: string,
  ): Promise<ExchangeRequestResponseDto> {
    try {
      return await this.exchangeManagerDomainService.getExchangeRequestById(requestId, userId);
    } catch (error) {
      this.logger.error(`Error getExchangeRequestById: ${error}`);
      throw error;
    }
  }

  async deleteExchangeRequest(requestId: string, userId: string): Promise<void> {
    try {
      return await this.exchangeManagerDomainService.deleteExchangeRequest(requestId, userId);
    } catch (error) {
      this.logger.error(`Error deleteExchangeRequest: ${error}`);
      throw error;
    }
  }
}