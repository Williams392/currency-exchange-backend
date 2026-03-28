import { BadRequestException, Logger }   from '@nestjs/common';
import { ExchangeRateSnapshot, CreateExchangeRequestPayload } from '@src/application/interface/dto/ExchangeRequestPayload';
import { CreateExchangeRequestDto }      from '@src/application/interface/dto/request/exchange/CreateExchangeRequestDto';
import { Types } from 'mongoose';

export class ExchangePayloadBuilder {
  private readonly logger = new Logger(ExchangePayloadBuilder.name);
  private readonly dto:    CreateExchangeRequestDto;
  private readonly rates:  ExchangeRateSnapshot;
  private readonly userId: string;

  constructor(
    dto:    CreateExchangeRequestDto,
    rates:  ExchangeRateSnapshot,
    userId: string,
  ) {
    this.dto    = dto;
    this.rates  = rates;
    this.userId = userId;
  }

  private calculateAmountReceived(): number {
    const { exchange_type, amount_sent } = this.dto;
    const { purchase_price, sale_price } = this.rates;

    if (exchange_type === 'purchase') {
      return amount_sent * purchase_price;
    }

    if (sale_price === 0) {
      throw new BadRequestException('sale_price no puede ser cero');
    }

    return amount_sent / sale_price;
  }

  private buildRateSnapshot(): ExchangeRateSnapshot {
    return {
      rate_id:        this.rates.rate_id,
      purchase_price: this.rates.purchase_price,
      sale_price:     this.rates.sale_price,
    };
  }

  public pipelineBuildPayload(): CreateExchangeRequestPayload {
    return {
      exchange_type:   this.dto.exchange_type,
      exchange_rate:   this.buildRateSnapshot(),
      amount_sent:     Number(this.dto.amount_sent.toFixed(2)),
      amount_received: Number(this.calculateAmountReceived().toFixed(2)),
      user_id:         new Types.ObjectId(this.userId),
    };
  }
}