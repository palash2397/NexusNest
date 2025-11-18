import { IsString, IsEmail } from 'class-validator';

export class ResendOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  purpose: string;
}
