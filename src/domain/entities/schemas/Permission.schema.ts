import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ collection: 'permissions', timestamps: true })
export class Permission {
  @Prop({ required: true, unique: true, maxlength: 20 })
  key_name!: string;

  @Prop({ required: true, maxlength: 100 })
  description!: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);