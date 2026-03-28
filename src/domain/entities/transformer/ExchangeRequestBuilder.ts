import { Logger }    from '@nestjs/common';
import { format }    from 'date-fns';
import { enUS }      from 'date-fns/locale';
import {
  ExchangeRateSnapshotDto,
  ExchangeRequestResponseDto,
  ExchangeRequestsResponseDto,
} from '@src/application/interface/dto/response/exchange/ExchangeRequestResponseDto';
import { PaginationResponseQuery } from '@src/domain/entities/Pagination';

export class ExchangeRequestBuilder {
  private readonly logger = new Logger(ExchangeRequestBuilder.name);
  private readonly doc: any;

  constructor(doc: any) {
    this.doc = doc;
  }

  private formatDate(date: any): string | null {
    return date
      ? format(new Date(date), 'dd/MMM/yyyy hh:mm a', { locale: enUS }).toLowerCase()
      : null;
  }

  private buildRateSnapshot(): ExchangeRateSnapshotDto {
    return {
      rate_id:        this.doc.exchange_rate.rate_id,
      purchase_price: Number(this.doc.exchange_rate.purchase_price.toFixed(4)),
      sale_price:     Number(this.doc.exchange_rate.sale_price.toFixed(4)),
    };
  }

  private transformDoc(): ExchangeRequestResponseDto {
    return {
      id:              this.doc._id.toString(),
      exchange_type:   this.doc.exchange_type,
      exchange_rate:   this.buildRateSnapshot(),
      amount_sent:     Number(this.doc.amount_sent.toFixed(2)),
      amount_received: Number(this.doc.amount_received.toFixed(2)),
      user_id:         this.doc.user_id?.toString(),
      created_at:      this.formatDate(this.doc.createdAt),
    };
  }

  public pipelineBuildOne(): ExchangeRequestResponseDto {
    return this.transformDoc();
  }

  public pipelineBuildList(result: PaginationResponseQuery<any[]>): ExchangeRequestsResponseDto {
    return {
      data:       result.data.map(doc => new ExchangeRequestBuilder(doc).pipelineBuildOne()),
      pagination: result.pagination,
    };
  }
}