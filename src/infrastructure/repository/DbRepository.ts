import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { IDbRepository } from '@src/domain/repository/DbRepository';
import { User, UserDocument } from '@src/domain/entities/schemas/User.schema';
import { ExchangeRequest, ExchangeRequestDocument } from '@src/domain/entities/schemas/ExchangeRequest.schema';
import { UserDto } from '@src/application/interface/dto/request/user/UserDto';
import { UserPaginationDto } from '@src/application/interface/dto/common/UserPaginationDto';
import { PaginationResponseQuery } from '@src/domain/entities/Pagination';
import { RoleModulePermission, RoleModulePermissionDocument } from '@src/domain/entities/schemas/RoleModulePermission.schema';
import { UpdateUserDto } from '@src/application/interface/dto/request/user/UpdateUserDto';
import { Role, RoleDocument } from '@src/domain/entities/schemas/Role.schema';
import { roundDivisionOperation } from '@src/domain/utils/utils';
import { ExchangeRequestPaginationDto } from '@src/application/interface/dto/request/exchange/ExchangeRequestPaginationDto';
import { CreateExchangeRatePayload, CreateExchangeRequestPayload } from '@src/application/interface/dto/ExchangeRequestPayload';
import { ExchangeRate, ExchangeRateDocument } from '@src/domain/entities/schemas/ExchangeRate.schema';

@Injectable()
export class DbRepository implements IDbRepository {
  private readonly logger = new Logger(DbRepository.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    @InjectModel(RoleModulePermission.name)
    private readonly roleModulePermissionModel: Model<RoleModulePermissionDocument>,
    @InjectModel(ExchangeRate.name)
    private readonly exchangeRateModel: Model<ExchangeRateDocument>,
    @InjectModel(ExchangeRequest.name)
    private readonly exchangeRequestModel: Model<ExchangeRequestDocument>,
  ) {}
  

  private async attachRolePermissions(users: any[]): Promise<any[]> {
    const roleIds = [...new Set(
      users
        .map(u => u.role_id?._id?.toString() ?? u.role_id?.toString())
        .filter(Boolean)
    )].map(id => new Types.ObjectId(id));

    if (!roleIds.length) return users;

    const rmps = await this.roleModulePermissionModel
      .find({ role_id: { $in: roleIds } })
      .populate({ path: 'module_id',     model: 'Module'     })
      .populate({ path: 'permission_id', model: 'Permission' })
      .lean();

    const byRole = rmps.reduce<Record<string, any[]>>((acc, rmp) => {
      const key = rmp.role_id.toString();
      (acc[key] ??= []).push(rmp);
      return acc;
    }, {});

    return users.map(u => {
      const roleId = u.role_id?._id?.toString() ?? u.role_id?.toString();
      return {
        ...u,
        role_id: {
          ...(typeof u.role_id === 'object' ? u.role_id : {}),
          roleModulePermissions: byRole[roleId] ?? [],
        },
      };
    });
  }


  async getAllUsers(filters: UserPaginationDto): Promise<PaginationResponseQuery<any[]>> {
    const { page = 1, limit = 10, order = 'DESC', role, email, is_active } = filters;

    const query: Record<string, any> = {};
    if (email)                   query.email     = { $regex: email, $options: 'i' };
    if (is_active !== undefined) query.is_active = is_active;

    const skip      = (page - 1) * limit;
    const sortOrder = order === 'ASC' ? 1 : -1;

    let users = await this.userModel
      .find(query)
      .populate('role_id')
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    if (role) {
      users = users.filter((u: any) => u.role_id?.rol === role);
    }

    const usersWithPermissions = await this.attachRolePermissions(users);
    const total = await this.userModel.countDocuments(query);

    return {
      data: usersWithPermissions,
      pagination: {
        total_pages: roundDivisionOperation(total, limit),
        total_items: total,
      },
    };
  }


  async getSpecificUser(userId: string): Promise<any> {
    const user = await this.userModel
      .findById(userId)
      .populate('role_id')
      .lean();

    if (!user) {
      throw new NotFoundException(`Usuario con id ${userId} no encontrado`);
    }

    const [userWithPermissions] = await this.attachRolePermissions([user]);

    this.logger.log(`Response getSpecificUser: ${userId}`);
    return userWithPermissions;
  }


  async findUserByEmail(email: string): Promise<any> {
    const user = await this.userModel
      .findOne({ email })
      .populate('role_id')
      .lean();

    if (!user) return null;

    const [userWithPermissions] = await this.attachRolePermissions([user]);
    return userWithPermissions;
  }


  async createUser(payload: UserDto): Promise<any> {
    const user = new this.userModel(payload);
    const saved = await user.save();
    this.logger.log(`Response createUser: ${saved._id}`);
    return saved;
  }


  async updateUser(userId: string, payload: Partial<UpdateUserDto>): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $set: payload },
      { new: true },
    ).exec();
    this.logger.log(`Response updateUser: ${userId}`);
  }


  async deleteUser(userId: string): Promise<void> {
    await this.userModel.findByIdAndDelete(userId).exec();
    this.logger.log(`Response deleteUser: ${userId}`);
  }


  async findRoleByName(roleName: string): Promise<any> {
    return await this.roleModel.findOne({ rol: roleName }).lean();
  }
  

  async createExchangeRate(payload: CreateExchangeRatePayload): Promise<any> {
    await this.exchangeRateModel.updateMany({ is_active: true }, { is_active: false });

    const doc   = new this.exchangeRateModel(payload);
    const saved = await doc.save();
    this.logger.log(`createExchangeRate: ${saved._id}`);
    return saved.toObject();
  }

  
  async getActiveExchangeRate(): Promise<any> {
    return this.exchangeRateModel
      .findOne({ is_active: true })
      .lean();
  }


  async createExchangeRequest(payload: CreateExchangeRequestPayload): Promise<any> {
    const doc   = new this.exchangeRequestModel(payload);
    const saved = await doc.save();
    this.logger.log(`createExchangeRequest: ${saved._id}`);
    return saved.toObject();
  }


  async getExchangeRequests(userId: string, filters: ExchangeRequestPaginationDto,
  ): Promise<PaginationResponseQuery<any[]>> {
    const { page = 1, limit = 10, order = 'DESC', exchange_type } = filters;

    const query: Record<string, any> = { user_id: new Types.ObjectId(userId) };
    if (exchange_type) query.exchange_type = exchange_type;

    const skip      = (page - 1) * limit;
    const sortOrder = order === 'ASC' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.exchangeRequestModel
        .find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.exchangeRequestModel.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        total_pages: roundDivisionOperation(total, limit),
        total_items: total,
      },
    };
  }


  async getExchangeRequestById(requestId: string, userId: string): Promise<any> {
    return this.exchangeRequestModel
      .findOne({
        _id:     new Types.ObjectId(requestId),
        user_id: new Types.ObjectId(userId),
      })
      .lean();
  }


  async deleteExchangeRequest(requestId: string, userId: string): Promise<void> {
    await this.exchangeRequestModel.findOneAndDelete({
      _id:     new Types.ObjectId(requestId),
      user_id: new Types.ObjectId(userId),
    });
    this.logger.log(`deleteExchangeRequest: ${requestId}`);
  }

}