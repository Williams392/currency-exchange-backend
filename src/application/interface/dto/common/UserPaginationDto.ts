import { DEFAULT_PAGINATION_FILTERS_DTO } from "@src/application/constants/Constants";
import { ModuleKeyName } from "@src/domain/constants/AppConstants";
import { typeOrder } from "@src/domain/entities/Pagination";
import { stringToBoolean } from "@src/domain/utils/utils";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UserPaginationDto {
  @IsOptional()
  @IsString()
  @IsEnum(ModuleKeyName)
  module?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  email?: string; 

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => stringToBoolean(value))
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => value || DEFAULT_PAGINATION_FILTERS_DTO.page)
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => value || DEFAULT_PAGINATION_FILTERS_DTO.limit)
  limit?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || DEFAULT_PAGINATION_FILTERS_DTO.order)
  order?: typeOrder;
}