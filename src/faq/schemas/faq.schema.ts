import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FaqDocument = Faq & Document;

@Schema({ timestamps: true })
export class Faq {
  @Prop({ type: String, required: true })
  question: string;

  @Prop({ type: String, required: true })
  answer: string;
}

export const FaqSchema = SchemaFactory.createForClass(Faq);
