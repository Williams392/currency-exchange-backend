import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument }     from 'mongoose';

export type ExchangeRateDocument = HydratedDocument<ExchangeRate>;

@Schema({ collection: 'exchange_rates', timestamps: true })
export class ExchangeRate {
  @Prop({ required: true })
  rate_id!: string;

  @Prop({ required: true, type: Number })
  purchase_price!: number;

  @Prop({ required: true, type: Number })
  sale_price!: number;

  @Prop({ default: true })
  is_active!: boolean;
}

export const ExchangeRateSchema = SchemaFactory.createForClass(ExchangeRate);