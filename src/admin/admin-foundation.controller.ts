import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';

import { CreateFoundationDto } from '../foundation/dto/create-foundation.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/roles/roles.guard';
import { FoundationService } from '../foundation/foundation.service';


@Controller('admin')
export class AdminFoundationController {
  constructor(private readonly foundationService: FoundationService) {}

  @Post('foundation/create')
  @UseInterceptors(FileInterceptor('logo', multerConfig(`foundation/logo`)))
  @UseGuards(JwtAuthGuard, RoleGuard)
  createFoundation(
    @Body() dto: CreateFoundationDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    return this.foundationService.create(dto, file, req.user.id!);
  }

  @Delete('foundation/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  deleteFoundation(@Param('id') id: string, @Req() req) {
    return this.foundationService.deleteFoundation(req.user.id!, id);
  }
}
