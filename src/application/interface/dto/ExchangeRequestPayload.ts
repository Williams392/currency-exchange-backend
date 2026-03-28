import { Types } from "mongoose";

export interface ExchangeRateSnapshot {
  rate_id: string;
  purchase_price: number;
  sale_price: number;
}

export interface CreateExchangeRequestPayload {
  exchange_type:   'purchase' | 'sale';
  exchange_rate:   ExchangeRateSnapshot;
  amount_sent:     number;
  amount_received: number;
  user_id:         Types.ObjectId;
}

export interface CreateExchangeRatePayload {
  purchase_price: number;
  sale_price:     number;
  is_active:      boolean;
}