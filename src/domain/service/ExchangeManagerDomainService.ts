import { Injectable, Logger, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IDbRepository }                from '@src/domain/repository/DbRepository';
import { CreateExchangeRequestDto }     from '@src/application/interface/dto/request/exchange/CreateExchangeRequestDto';
import { ExchangeRequestPaginationDto } from '@src/application/interface/dto/request/exchange/ExchangeRequestPaginationDto';
import { ExchangeRequestResponseDto, ExchangeRequestsResponseDto } from '@src/application/interface/dto/response/exchange/ExchangeRequestResponseDto';
import { ExchangePayloadBuilder } from '../entities/transformer/ExchangePayloadBuilder';
import { ExchangeRequestBuilder } from '../entities/transformer/ExchangeRequestBuilder';
import { IHttpRepository } from '../interfaces/HttpRepository';
import { ConfigService } from '@nestjs/config';
import { ExchangeRateSnapshot } from '@src/application/interface/dto/ExchangeRequestPayload';

@Injectable()
export class ExchangeManagerDomainService {
  private readonly logger = new Logger(ExchangeManagerDomainService.name);

  constructor(
    @Inject('DbRepository') private readonly dbRepository: IDbRepository,
    @Inject('HttpRepository') private readonly httpRepository: IHttpRepository,
    private readonly configService: ConfigService,
  ) {}

  async createExchangeRequest(
    userId: string,
    dto: CreateExchangeRequestDto,
  ): Promise<ExchangeRequestResponseDto> {
    try {
      const ratesUrl = this.configService.getOrThrow<string>('app.rates.url');
      const apiResponse = await this.httpRepository.get({ url: ratesUrl });

      if (apiResponse?.error || !apiResponse?.data) {
        throw new BadRequestException('No se pudo obtener la tasa de cambio externa');
      }

      const externalRate = apiResponse.data;

      const rateSnapshot: ExchangeRateSnapshot = {
        rate_id:        externalRate._id,
        purchase_price: externalRate.purchase_price,
        sale_price:     externalRate.sale_price,
      };

      const payload = new ExchangePayloadBuilder(dto, rateSnapshot, userId).pipelineBuildPayload();
      const saved   = await this.dbRepository.createExchangeRequest(payload);

      return new ExchangeRequestBuilder(saved).pipelineBuildOne();
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
      const result = await this.dbRepository.getExchangeRequests(userId, filters);
      return new ExchangeRequestBuilder(null).pipelineBuildList(result);
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
      const doc = await this.dbRepository.getExchangeRequestById(requestId, userId);
      if (!doc) throw new NotFoundException(`Solicitud ${requestId} no encontrada`);

      return new ExchangeRequestBuilder(doc).pipelineBuildOne();
    } catch (error) {
      this.logger.error(`Error getExchangeRequestById: ${error}`);
      throw error;
    }
  }

  async deleteExchangeRequest(requestId: string, userId: string): Promise<void> {
    try {
      const doc = await this.dbRepository.getExchangeRequestById(requestId, userId);
      if (!doc) throw new NotFoundException(`Solicitud ${requestId} no encontrada`);

      await this.dbRepository.deleteExchangeRequest(requestId, userId);
    } catch (error) {
      this.logger.error(`Error deleteExchangeRequest: ${error}`);
      throw error;
    }
  }

}