import { Controller, Post, Body, UseGuards, Get, ValidationPipe, Query, Param, Patch, ParseIntPipe, Delete } from "@nestjs/common";
import { UserPaginationDto } from "@src/application/interface/dto/common/UserPaginationDto";
import { UpdateUserDto } from "@src/application/interface/dto/request/user/UpdateUserDto";
import { UserDto } from "@src/application/interface/dto/request/user/UserDto";
import { UserResponseDto } from "@src/application/interface/dto/response/user/UserResponseDto";
import { UsersResponseDto } from "@src/application/interface/dto/response/user/UsersResponseDto";
import { UserManagerService } from "@src/application/service/UserManagerService";
import { InternalJwtGuard } from "../auth/guards/InternalJwtGuard";
import { PermissionGuard } from "../auth/guards/PermissionGuard";
import { ModuleEnum, PermissionEnum } from "@src/application/constants/Constants";
import { RolePermissions } from "../auth/decorators/RolePermissions";
import { OnlyAdmin } from "../auth/decorators/OnlyAdmin";
import { UserGuard } from "../auth/guards/UserGuard";


@Controller('users')
export class UserManagerController {
  constructor(
    private readonly userManagerService: UserManagerService
  ) {}

  @UseGuards(InternalJwtGuard)
  @Get('')
  async getUsers(
    @Query(new ValidationPipe({ transform: true })) filters: UserPaginationDto
  ): Promise<UsersResponseDto> {
    try {
      return await this.userManagerService.getUsers(filters);
    } catch (error) {
      console.log('Error getUsers', error);
      throw error;
    }
  }

  @UseGuards(InternalJwtGuard)
  @Get(':id')
  async getSpecificUser(
    @Param('id') userId: string
  ): Promise<UserResponseDto> {
    try {
      return await this.userManagerService.getSpecificUser(userId);
    } catch (error) {
      console.log('Error getSpecificUser', error);
      throw error;
    }
  }

  @UseGuards(InternalJwtGuard, PermissionGuard)
  @RolePermissions(PermissionEnum.CREATE)
  @OnlyAdmin()
  @Post('')
  async createUser(
    @Body(new ValidationPipe({ transform: true })) payload: UserDto
  ): Promise<UserResponseDto> {
    try {
      return await this.userManagerService.createUser(payload);
    } catch (error) {
      console.log('Error createUser', error);
      throw error;
    }
  }

  @UseGuards(InternalJwtGuard, UserGuard)
  @RolePermissions(PermissionEnum.UPDATE)
  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body(new ValidationPipe({ transform: true })) payload: UpdateUserDto
  ): Promise<{ message: string }> {
    try {
      await this.userManagerService.updateUser(userId, payload);
      return { message: 'Usuario actualizado exitosamente' };
    } catch (error) {
      console.log('Error updateUser', error);
      throw error;
    }
  }

  @UseGuards(InternalJwtGuard, UserGuard)
  @RolePermissions(PermissionEnum.DELETE, ModuleEnum.USERS)
  @OnlyAdmin()
  @Delete(':id')
  async deleteUser(
    @Param('id') userId: string
  ): Promise<{ message: string }> {
    try {
      await this.userManagerService.deleteUser(userId);
      return { message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      console.log('Error deleteUser', error);
      throw error;
    }
  }
  
}