import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserManagerDomainService } from "@src/domain/service/UserManagerDomainService";
import { UserPaginationDto } from "../interface/dto/common/UserPaginationDto";
import { UsersResponseDto } from "../interface/dto/response/user/UsersResponseDto";
import { UserResponseDto } from "../interface/dto/response/user/UserResponseDto";
import { UserDto } from "../interface/dto/request/user/UserDto";
import { UpdateUserDto } from "../interface/dto/request/user/UpdateUserDto";

export class UserManagerService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly userManagerDomainService: UserManagerDomainService,
  ) { }

  async getUsers(filters: UserPaginationDto): Promise<UsersResponseDto> {
    try {
      const { page, limit, order, role, email, is_active } = filters;
      const updatedFilters = { page, limit, order, role, email, is_active };
      return await this.userManagerDomainService.getUsers(updatedFilters);
    } catch (error) {
      this.logger.error(`Error getUsers: ${error}`);
      throw error;
    }
  }

  async getSpecificUser(userId: string): Promise<UserResponseDto> {
    try {
      return await this.userManagerDomainService.getSpecificUser(userId);
    } catch (error) {
      this.logger.error(`Error getSpecificUser: ${error}`);
      throw error;
    }
  }

  async createUser(payload: UserDto): Promise<UserResponseDto> {
    try {
      return await this.userManagerDomainService.createUser(payload);
    } catch (error) {
      this.logger.error(`Error createUser: ${error}`);
      throw error;
    }
  }

  async updateUser(userId: string, payload: UpdateUserDto): Promise<void> {
    try {
      await this.userManagerDomainService.updateUser(userId, payload);
    } catch (error) {
      this.logger.error(`Error updateUser: ${error}`);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.userManagerDomainService.deleteUser(userId);
    } catch (error) {
      this.logger.error(`Error deleteUser: ${error}`);
      throw error;
    }
  }

}