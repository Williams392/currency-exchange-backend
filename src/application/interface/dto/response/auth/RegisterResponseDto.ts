import { UserResponseDto } from '../user/UserResponseDto';

export class RegisterResponseDto {
  message!: string;
  user!: UserResponseDto;
}