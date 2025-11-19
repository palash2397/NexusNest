import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Delete,
  Param,
} from '@nestjs/common';

import { CreateFoundationDto } from '../foundation/dto/create-foundation.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/roles/roles.guard';
import { FoundationService } from '../foundation/foundation.service';

@Controller('admin')
export class AdminFoundationController {
  constructor(private readonly foundationService: FoundationService) {}

  @Post('foundation/create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  createFoundation(@Body() dto: CreateFoundationDto, @Req() req) {
    return this.foundationService.create(dto, req.user.id!);
  }

  @Delete('foundation/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  deleteFoundation(@Param('id') id: string, @Req() req) {
    return this.foundationService.deleteFoundation(req.user.id!, id);
  }
}
