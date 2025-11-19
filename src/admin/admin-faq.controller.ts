import { Controller, Post, UseGuards, Body } from '@nestjs/common';

import { CreateFaqDto } from '../faq/dto/create-faq.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/roles/roles.guard';
import { FaqService } from '../faq/faq.service';

@Controller('admin')
export class AdminFaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post('faq/create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  createFaq(@Body() dto: CreateFaqDto) {
    return this.faqService.createFaq(dto);
  }
}
