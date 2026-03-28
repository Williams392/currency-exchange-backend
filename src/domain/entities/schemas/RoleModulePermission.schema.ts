import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoleModulePermissionDocument = HydratedDocument<RoleModulePermission>;

@Schema({ collection: 'role_module_permissions', timestamps: true })
export class RoleModulePermission {
  _id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  role_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AppModule', required: true })
  module_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Permission', required: true })
  permission_id!: Types.ObjectId;

  @Prop({ default: true })
  is_allowed!: boolean;
}

export const RoleModulePermissionSchema = SchemaFactory.createForClass(RoleModulePermission);