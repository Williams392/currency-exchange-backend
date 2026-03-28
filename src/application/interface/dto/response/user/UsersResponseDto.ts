import { PaginationParams } from "@src/domain/entities/Pagination";
import { UserResponse } from "@src/domain/entities/UserResponse";

export interface UsersResponseDto {
  data: UserResponse[];
  pagination: PaginationParams;
}