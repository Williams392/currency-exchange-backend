import { UserResponseDto } from '../user/UserResponseDto';

export class LoginResponseDto {
  token!: string;
  expiresIn!: number;
  user!: UserResponseDto;
}