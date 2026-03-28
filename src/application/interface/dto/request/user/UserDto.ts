import { standardizeUserIdentity } from "@src/domain/utils/utils";
import { Transform } from "class-transformer";
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean, MinLength } from 'class-validator';
import { BaseUserDto } from "../../common/BaseUserDto";

export class UserDto extends BaseUserDto {
  @IsString()
  @MinLength(6)
  password!: string;

  @IsEmail()
  email!: string;

  @IsString()
  role_id!: string;
}