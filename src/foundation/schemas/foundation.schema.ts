import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FoundationDocument = Foundation & Document;

@Schema({ timestamps: true })
export class Foundation {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, default: null })
  logo: string | null; 

  @Prop({ type: String, default: null })
  website: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const FoundationSchema = SchemaFactory.createForClass(Foundation);
