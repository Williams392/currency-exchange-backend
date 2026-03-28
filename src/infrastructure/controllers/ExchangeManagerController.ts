import {
  Controller, Post, Get, Delete,
  Param, Body, Query, Req,
  ValidationPipe, UseGuards,
} from '@nestjs/common';
import { Request }                      from 'express';
import { InternalJwtGuard }             from '@src/infrastructure/auth/guards/InternalJwtGuard';
import { CreateExchangeRequestDto }     from '@src/application/interface/dto/request/exchange/CreateExchangeRequestDto';
import { ExchangeRequestPaginationDto } from '@src/application/interface/dto/request/exchange/ExchangeRequestPaginationDto';
import {
  ExchangeRequestResponseDto,
  ExchangeRequestsResponseDto,
} from '@src/application/interface/dto/response/exchange/ExchangeRequestResponseDto';
import { ExchangeManagerService } from '@src/application/service/ExchangeManagerService';
import { RolePermissions } from '../auth/decorators/RolePermissions';
import { OnlyAdmin } from '../auth/decorators/OnlyAdmin';
import { PermissionGuard } from '../auth/guards/PermissionGuard';
import { ModuleEnum, PermissionEnum } from '@src/application/constants/Constants';

@Controller('/exchange-requests')
export class ExchangeManagerController {
    constructor(private readonly exchangeManagerService: ExchangeManagerService) {}

    @UseGuards(InternalJwtGuard, PermissionGuard)
    @RolePermissions(PermissionEnum.CREATE, ModuleEnum.EXCHANGE_RATES)
    @Post('')
    async createExchangeRequest(
        @Req() req: Request,
        @Body(new ValidationPipe({ transform: true })) dto: CreateExchangeRequestDto,
    ): Promise<ExchangeRequestResponseDto> {
        try {
        const userId = (req as any).user?.id;
        return await this.exchangeManagerService.createExchangeRequest(userId, dto);
        } catch (error) {
        console.log('Error createExchangeRequest', error);
        throw error;
        }
    }

    @UseGuards(InternalJwtGuard)
    @Get('')
    async getExchange(
        @Req() req: Request,
        @Query(new ValidationPipe({ transform: true })) filters: ExchangeRequestPaginationDto,
    ): Promise<ExchangeRequestsResponseDto> {
        try {
        const userId = (req as any).user?.id;
        return await this.exchangeManagerService.getExchangeRequests(userId, filters);
        } catch (error) {
        console.log('Error getExchangeRequests', error);
        throw error;
        }
    }

    @UseGuards(InternalJwtGuard)
    @Get(':id')
    async getExchangeById(
        @Req() req: Request,
        @Param('id') requestId: string,
    ): Promise<ExchangeRequestResponseDto> {
        try {
        const userId = (req as any).user?.id;
        return await this.exchangeManagerService.getExchangeRequestById(requestId, userId);
        } catch (error) {
        console.log('Error getExchangeRequestById', error);
        throw error;
        }
    }

    @UseGuards(InternalJwtGuard, PermissionGuard)
    @RolePermissions(PermissionEnum.DELETE)
    @OnlyAdmin()
    @Delete(':id')
    async deleteExchange(
        @Req() req: Request,
        @Param('id') requestId: string,
    ): Promise<{ message: string }> {
        try {
        const userId = (req as any).user?.id;
        await this.exchangeManagerService.deleteExchangeRequest(requestId, userId);
        return { message: 'Solicitud eliminada exitosamente' };
        } catch (error) {
        console.log('Error deleteExchangeRequest', error);
        throw error;
        }
    }

}