import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.usersService.verifyOtp(dto);
  }

  @Post('resend-otp')
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.usersService.resendOtp(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  myProfile(@Req() req) {
    return this.usersService.profile(req.user.id);
  }
}
