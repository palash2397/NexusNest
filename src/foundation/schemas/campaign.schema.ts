import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ type: Types.ObjectId, ref: 'Foundation', required: true })
  foundationId: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, default: null })
  image: string | null;

  @Prop({ type: Number, default: 0 })
  raisedAmount: number;

  @Prop({ type: String })
  eventDate: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  participants: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ['active', 'completed', 'upcoming'],
    default: 'active',
  })
  status: string;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
