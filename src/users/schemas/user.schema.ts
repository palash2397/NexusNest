import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  fullName?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ unique: true, sparse: true })
  phone?: string;

  @Prop()
  password?: string;

  @Prop({ default: null })
  latitude?: string;

  @Prop({ default: null })
  longitude?: string;

  @Prop({ default: null })
  avatar?: string;

  @Prop({ default: null })
  googleId?: string;

  @Prop({ enum: ['local', 'google'], default: 'local' })
  provider: string;

  @Prop({ type: String, default: null })
  otp?: string | null;

  @Prop({ type: Date, default: null })
  otpExpireAt?: Date | null;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ enum: ['user', 'admin', 'superAdmin'], default: 'user' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  otpVerifiedForResetPassword: boolean;

  @Prop({ default: null })
  pin?: string;

  // -------- METHODS --------
  // async isPasswordCorrect(password: string): Promise<boolean> {
  //   if (!this.password) return false; // no password stored
  //   return await bcrypt.compare(password, this.password);
  // }
}

export const UserSchema = SchemaFactory.createForClass(User);

// -------- PRE-SAVE HOOK --------

// UserSchema.methods.isPasswordCorrect = async function (
//   this: UserDocument,
//   password: string,
// ): Promise<boolean> {
//   if (!this.password) return false;
//   return bcrypt.compare(password, this.password);
// };
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
