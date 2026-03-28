export type typeOrder = 'ASC' | 'DESC';

export interface PaginationFilter {
  page: number;
  limit: number;
  order: typeOrder;
}

export interface PaginationParams {
  total_pages: number;
  total_items: number;
}

export interface PaginationResponseQuery<T> {
  data: T;
  pagination: PaginationParams;
}