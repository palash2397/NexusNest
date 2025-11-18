import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;
}
