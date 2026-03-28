import { standardizeUserIdentity } from "@src/domain/utils/utils";
import { Transform } from "class-transformer";
import { IsString, IsEmail, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class BaseUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => standardizeUserIdentity({ userIdentity: value }))
  first_name?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => standardizeUserIdentity({ userIdentity: value }))
  last_name?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}