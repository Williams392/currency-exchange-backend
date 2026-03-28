import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IDbRepository } from '../repository/DbRepository';
import { UserPaginationDto } from '@src/application/interface/dto/common/UserPaginationDto';
import { UsersResponseDto } from '@src/application/interface/dto/response/user/UsersResponseDto';
import { UserResponseDto } from '@src/application/interface/dto/response/user/UserResponseDto';
import { UserDto } from '@src/application/interface/dto/request/user/UserDto';
import { UserBuilder } from '../entities/transformer/UserBuilder';
import { UsersResponseBuilder } from '../entities/transformer/UsersResponseBuilder';
import { UserResponse } from '../entities/UserResponse';
import { PaginationResponseQuery } from '../entities/Pagination';
import { UpdateUserDto } from '@src/application/interface/dto/request/user/UpdateUserDto';
import { UserProfileRaw } from '../entities/UserRawData';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserManagerDomainService{

  constructor(
    @Inject('DbRepository') private readonly dbRepository: IDbRepository
  ) { }

  async getUsers(filters: UserPaginationDto): Promise<PaginationResponseQuery<UserResponse[]>> {
    try {
      const paginatedUsers = await this.dbRepository.getAllUsers(filters);
      const builder = new UsersResponseBuilder(paginatedUsers.data);

      return {
        data: builder.pipelineBuildUsers(),
        pagination: paginatedUsers.pagination,
      };
    } catch (error) {
      console.log(`Error getUsers: ${error}`);
      throw error;
    }
  }

  async getSpecificUser(userId: string): Promise<any> {
    try {
      const userRaw = await this.dbRepository.getSpecificUser(userId);
      const builder = new UserBuilder(userRaw);
      return builder.buildUserInformation();
    } catch (error) {
      console.log(`Error getSpecificUser: ${error}`);
      throw error;
    }
  }

  async createUser(payload: UserDto): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(payload.password, 10);

      const userData = {
        username:        payload.username,
        password:        hashedPassword,
        first_name:      payload.first_name,
        last_name:       payload.last_name,
        email:           payload.email,
        role_id:         payload.role_id,
        is_active:       payload.is_active
      };

      return await this.dbRepository.createUser(userData);
    } catch (error) {
      console.log(`Error createUser: ${error}`);
      throw error;
    }
  }

  async updateUser(userId: string, payload: UpdateUserDto): Promise<void> {
    try {
      await this.dbRepository.updateUser(userId, payload);
    } catch (error) {
      console.log(`Error updateUser: ${error}`);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.dbRepository.deleteUser(userId);
    } catch (error) {
      console.log(`Error deleteUser: ${error}`);
      throw error;
    }
  }

}