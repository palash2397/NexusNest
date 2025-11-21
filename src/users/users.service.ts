import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { HttpException } from '@nestjs/common';
import { ApiResponse } from '../utils/ApiResponse';
import { generateOtp, getExpirationTime } from '../utils/helper';
import * as bcrypt from 'bcryptjs';
import * as Jwt from 'jsonwebtoken';

import { MailService } from '../mail/mail.service';

import { RegisterUserDto } from './dto/register-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { LoginUserDto } from './dto/login-user.dto';
// import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterUserDto) {
    try {
      const { fullName, email, phone, password } = dto;

      // 1. Check existing user
      const existingUser = await this.userModel.findOne({
        $or: [{ email }, { phone }],
      });

      if (existingUser) {
        // CASE: user exists but NOT verified → resend OTP
        if (!existingUser.isVerified) {
          const otp = generateOtp();
          existingUser.otp = otp;
          existingUser.otpExpireAt = getExpirationTime();
          await existingUser.save();

          return new ApiResponse(
            200,
            { userId: existingUser._id },
            `OTP resent to mobile`,
          );
        }

        // CASE: user exists & verified → throw error
        const message =
          existingUser.email === email
            ? `email already exists. Please use another one`
            : `mobile number already exists. Please use another one`;

        throw new HttpException(message, 400);
      }

      // 2. Create OTP + expiry
      const otp = generateOtp();
      const otpExpireAt = getExpirationTime();

      // 3. Create user
      const user = new this.userModel({
        fullName,
        email: email ? email.toLowerCase() : email,
        phone,
        password,
        otp,
        otpExpireAt,
      });

      // 4. Send SMS
      // const msg = `Your verification code is ${otp}. It will expire in 5 minutes.`;
      // const smsResult = await sendSms(phone, msg);

      // if (!smsResult.success)
      //   throw new HttpException(
      //     `Something went wrong while sending sms`,
      //     403,
      //   );

      // await this.mailService.sendOtpMail(fullName, otp, email);
      await user.save();
      console.log(`OTP generated --> ${otp}`);

      // 5. Final response
      return new ApiResponse(
        200,
        {},
        `OTP successfully sent to your email & phone`,
      );
    } catch (error) {
      console.log(`Error in register: `, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    try {
      const { email, otp, purpose } = dto;

      const user = await this.userModel.findOne({ email: email.toLowerCase() });

      if (!user) {
        return new ApiResponse(404, {}, `User not found`);
      }

      if (!user.otp || !user.otpExpireAt) {
        return new ApiResponse(
          400,
          {},
          `OTP not found. Please request a new OTP.`,
        );
      }

      if (user.otp !== otp || new Date() > user.otpExpireAt) {
        console.log(`Provided OTP: ${otp}, Expected OTP: ${user.otp}`);
        console.log(
          `Current Time: ${new Date().toISOString()}, OTP Expiry Time: ${
            user.otpExpireAt?.toISOString() ?? 'null'
          }`,
        );
        return new ApiResponse(400, {}, `Invalid or expired OTP.`);
      }

      // Forgot Password Flow
      if (purpose === 'password') {
        user.otp = null;
        user.otpExpireAt = null;
        user.otpVerifiedForResetPassword = true;
        await user.save();

        return new ApiResponse(
          200,
          {},
          `OTP verified. You may now reset your password.`,
        );
      }

      // Account Verification Flow
      if (user.isVerified) {
        return new ApiResponse(400, {}, `User already verified.`);
      }

      user.isVerified = true;
      user.otp = null;
      user.otpExpireAt = null;
      await user.save();

      return new ApiResponse(200, {}, `User account verified successfully.`);
    } catch (error) {
      console.log(`Error in verifyOtp: `, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }

  async resendOtp(dto: ResendOtpDto) {
    try {
      const { email, purpose } = dto;

      const user = await this.userModel.findOne({ email: email.toLowerCase() });

      if (!user) {
        return new ApiResponse(404, {}, `User not found`);
      }

      if (purpose === 'password') {
        const otp = generateOtp();
        const otpExpireAt = getExpirationTime();
        user.otp = otp;
        user.otpExpireAt = otpExpireAt;
        await user.save();
        // await sendOtpforgotPasswordMail(user.fullName, user.otp, user.email);

        console.log(` resend OTP ---------> ${otp} `);

        return new ApiResponse(
          200,
          {},
          `Password reset OTP sent successfully.`,
        );
      }

      if (user.isVerified)
        return new ApiResponse(400, {}, `User already verified.`);

      const otp = await generateOtp();
      const otpExpireAt = getExpirationTime();
      user.otp = otp;
      user.otpExpireAt = otpExpireAt;
      await user.save();
      // await sendOtpMail(user.fullName, user.otp, user.email);

      return new ApiResponse(200, {}, `OTP resent successfully.`);
    } catch (error) {
      console.log(`Error in resendOtp: `, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const { email, password } = dto;
      const user = await this.userModel.findOne({ email: email.toLowerCase() });

      if (!user) return new ApiResponse(404, {}, `User not found`);
      if (!user.isVerified)
        return new ApiResponse(404, {}, `User not verified. Please verify.`);

      if (!user.isActive)
        return new ApiResponse(
          403,
          {},
          `your account has been temporarily blocked.`,
        );

      if (!user.password) {
        return new ApiResponse(400, {}, 'Invalid credentials');
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return new ApiResponse(400, {}, `Invalid credentials`);
      }

      const token = Jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '30d' },
      );

      const userData = {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isPinCreated: user.pin ? true : false,
        token: token,
      };

      return new ApiResponse(200, userData, `Login successful`);
    } catch (error) {
      console.log(`Error in login: `, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }

  async profile(userId: String) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select(
          '-password -otp -otpExpireAt -__v -createdAt -updatedAt -pin -otpVerifiedForResetPassword',
        );

      if (!user) {
        return new ApiResponse(404, {}, `user not found`);
      }

      // 2. Check if active
      if (!user.isActive) {
        return new ApiResponse(404, {}, `user has been temporaily blocked`);
      }

      // 3. Attach avatar (same logic as Express)
      const BASE_URL = process.env.BASE_URL;
      const DEFAULT_PROFILE_PIC = process.env.DEFAULT_PROFILE_PIC;

      user.avatar = user.avatar
        ? `${BASE_URL}/profile/${user.avatar}`
        : DEFAULT_PROFILE_PIC;

      // 4. Return response
      return new ApiResponse(200, user, 'Profile fetched successfully.');
    } catch (error) {
      console.log(`Error while fetching profile :`, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }
}
