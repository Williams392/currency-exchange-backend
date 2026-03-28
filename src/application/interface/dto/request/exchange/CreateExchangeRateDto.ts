import { IsNumber, IsPositive, Min } from 'class-validator';

export class CreateExchangeRateDto {
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive()
  @Min(0.0001)
  purchase_price!: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive()
  @Min(0.0001)
  sale_price!: number;
}