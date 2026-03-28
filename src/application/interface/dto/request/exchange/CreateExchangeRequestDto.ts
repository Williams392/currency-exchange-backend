import { IsEnum, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ExchangeType } from '@src/domain/entities/schemas/ExchangeRequest.schema';

export class CreateExchangeRequestDto {
  @IsNotEmpty()
  @IsEnum(['purchase', 'sale'], {
    message: 'exchange_type debe ser "purchase" o "sale"',
  })
  exchange_type!: ExchangeType;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  @Type(() => Number)
  amount_sent!: number;
}