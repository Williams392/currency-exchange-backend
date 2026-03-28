import { standardizeUserIdentity } from "@src/domain/utils/utils";
import { Transform } from "class-transformer";
import { IsString, IsEmail, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { BaseUserDto } from "../../common/BaseUserDto";

export class UpdateUserDto extends BaseUserDto {
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  role_id?: string;
}