import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ collection: 'roles', timestamps: true })
export class Role {
  _id!: Types.ObjectId;

  @Prop({ required: true, unique: true, maxlength: 50 })
  rol!: string;

  @Prop({ type: String, default: null })
  description!: string | null;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

