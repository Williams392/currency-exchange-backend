import { ExchangeRate } from "@src/domain/entities/schemas/ExchangeRate.schema";
import { ExchangeRequest } from "@src/domain/entities/schemas/ExchangeRequest.schema";
import { Permission } from "@src/domain/entities/schemas/Permission.schema";
import { Role } from "@src/domain/entities/schemas/Role.schema";
import { Module } from "@src/domain/entities/schemas/Module.schema";
import { RoleModulePermission } from "@src/domain/entities/schemas/RoleModulePermission.schema";
import { User } from "@src/domain/entities/schemas/User.schema";
import { ModelDefinition, SchemaFactory } from "@nestjs/mongoose";


const toModelDef = (cls: any): ModelDefinition => ({
  name: cls.name,
  schema: SchemaFactory.createForClass(cls),
});

export const DbEntities: ModelDefinition[] = [
  Role, Module,Permission,
  RoleModulePermission, User,
  ExchangeRate, ExchangeRequest,
].map(toModelDef);