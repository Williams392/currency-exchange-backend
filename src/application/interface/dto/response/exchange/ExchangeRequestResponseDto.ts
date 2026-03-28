export interface ExchangeRateSnapshotDto {
  rate_id:        string;
  purchase_price: number;
  sale_price:     number;
}

export interface ExchangeRequestResponseDto {
  id:              string;
  exchange_type:   string;
  exchange_rate:   ExchangeRateSnapshotDto;
  amount_sent:     number;
  amount_received: number;
  user_id:         string;
  created_at:      string | null;
}

export interface ExchangeRequestsResponseDto {
  data: ExchangeRequestResponseDto[];
  pagination: {
    total_pages: number;
    total_items: number;
  };
}