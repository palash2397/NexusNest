import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtpMail(
    name: string,
    otp: string,
    to: string,
  ): Promise<SentMessageInfo> {
    return await this.mailerService.sendMail({
      to,
      subject: 'OTP Verification',
      template: './account', // account.hbs
      context: { name, otp },
    });
  }

  async sendForgotPasswordOtp(
    name: string,
    otp: string,
    to: string,
  ): Promise<SentMessageInfo> {
    return this.mailerService.sendMail({
      to,
      subject: 'Password Reset OTP',
      template: './password', // password.hbs
      context: { name, otp },
    });
  }
}
