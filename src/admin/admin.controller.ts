import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateFoundationDto } from '../foundation/dto/create-foundation.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/roles/roles.guard';
import { FoundationService } from '../foundation/foundation.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly foundationService: FoundationService,
  ) {}
  @Post('foundation/create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  createFoundation(@Body() dto: CreateFoundationDto, @Req() req) {
    return this.foundationService.create(dto, req.user.id!);
  }
}
