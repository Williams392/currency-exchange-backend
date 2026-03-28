import { UserPaginationDto } from "@src/application/interface/dto/common/UserPaginationDto";
import { PaginationResponseQuery } from "../entities/Pagination";
import { UserDto } from "@src/application/interface/dto/request/user/UserDto";
import { User } from "../entities/schemas/User.schema";
import { UpdateUserDto } from "@src/application/interface/dto/request/user/UpdateUserDto";
import { CreateExchangeRatePayload, CreateExchangeRequestPayload } from "@src/application/interface/dto/ExchangeRequestPayload";
import { ExchangeRequestPaginationDto } from "@src/application/interface/dto/request/exchange/ExchangeRequestPaginationDto";

export interface IDbRepository {
  getAllUsers(filters: UserPaginationDto): Promise<PaginationResponseQuery<User[]>>;
  getSpecificUser(userId: string): Promise<any>;
  createUser(payload: UserDto): Promise<any>;
  updateUser(userId: string, payload: Partial<UpdateUserDto>): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  findUserByEmail(email: string): Promise<any>;
  findRoleByName(roleName: string): Promise<any>;
  createExchangeRequest(payload: CreateExchangeRequestPayload): Promise<any>;
  getExchangeRequests(userId: string, filters: ExchangeRequestPaginationDto): Promise<PaginationResponseQuery<any[]>>;
  getExchangeRequestById(requestId: string, userId: string): Promise<any>;
  deleteExchangeRequest(requestId: string, userId: string): Promise<void>;
  createExchangeRate(payload: CreateExchangeRatePayload): Promise<any>;
  getActiveExchangeRate(): Promise<any>;
}