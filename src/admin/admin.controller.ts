import {
  Controller,
  // Post,
  // UseGuards,
  // Body,
  // Req
} from '@nestjs/common';
import { AdminService } from './admin.service';

// import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
// import { RoleGuard } from '../auth/roles/roles.guard';
// import { FoundationService } from '../foundation/foundation.service';
// import { CreateCampaignDto } from 'src/foundation/dto/create-campaign.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Post('campaign/create')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // createCampaign(@Body() dto: CreateCampaignDto, @Req() req) {
  //   return this.foundationService.createCampaign(dto, req.user.id!);
  // }
}
