import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types }     from 'mongoose';
import { ExchangeRate, ExchangeRateSchema } from './ExchangeRate.schema';

export type ExchangeRequestDocument = HydratedDocument<ExchangeRequest>;
export type ExchangeType = 'purchase' | 'sale';

@Schema({ collection: 'exchange_requests', timestamps: true })
export class ExchangeRequest {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: String, enum: ['purchase', 'sale'] })
  exchange_type!: ExchangeType;

  @Prop({ required: true, type: ExchangeRateSchema })
  exchange_rate!: ExchangeRate;

  @Prop({ required: true, type: Number })
  amount_sent!: number;

  @Prop({ required: true, type: Number })
  amount_received!: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id!: Types.ObjectId;
}

export const ExchangeRequestSchema = SchemaFactory.createForClass(ExchangeRequest);