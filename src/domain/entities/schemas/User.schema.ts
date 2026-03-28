import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  _id!: Types.ObjectId; 

  @Prop({ required: true, maxlength: 50 })
  username!: string;

  @Prop({ required: true, maxlength: 255 })
  password!: string;

  @Prop({ maxlength: 100, default: null })
  first_name!: string;

  @Prop({ maxlength: 100, default: null })
  last_name!: string;

  @Prop({ required: true, unique: true, maxlength: 100 })
  email!: string;

  @Prop({ default: true })
  is_active!: boolean;

  @Prop({ default: null })
  last_connection!: Date;

  // Referencia al Role (reemplaza @ManyToOne)
  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  role_id!: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);