import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

@Schema({ collection: 'modules', timestamps: true })
export class Module {
  _id!: Types.ObjectId;

  @Prop({ required: true, unique: true, maxlength: 50 })
  name!: string;

  @Prop({ required: true, unique: true, maxlength: 50 })
  key_name!: string;

  @Prop({ type: String, default: null })
  description!: string | null;

  @Prop({ default: true })
  is_active!: boolean;
}

export const AppModuleSchema = SchemaFactory.createForClass(Module);