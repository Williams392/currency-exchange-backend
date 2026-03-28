import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { standardizeUserIdentity } from '@src/domain/utils/utils';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => standardizeUserIdentity({ userIdentity: value }))
  first_name?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => standardizeUserIdentity({ userIdentity: value }))
  last_name?: string;
}