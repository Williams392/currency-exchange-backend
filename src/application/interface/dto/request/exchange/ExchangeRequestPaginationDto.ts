import { IsOptional, IsEnum } from 'class-validator';
import { Type }               from 'class-transformer';
import { DEFAULT_PAGINATION_FILTERS_DTO } from '@src/application/constants/Constants';
import { ExchangeType } from '@src/domain/entities/schemas/ExchangeRequest.schema';

export class ExchangeRequestPaginationDto {
  @IsOptional()
  @Type(() => Number)
  page: number = DEFAULT_PAGINATION_FILTERS_DTO.page;

  @IsOptional()
  @Type(() => Number)
  limit: number = DEFAULT_PAGINATION_FILTERS_DTO.limit;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = DEFAULT_PAGINATION_FILTERS_DTO.order;

  @IsOptional()
  @IsEnum(['purchase', 'sale'])
  exchange_type?: ExchangeType;
}