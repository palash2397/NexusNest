import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminFoundationController } from './admin-foundation.controller';
import { AdminCampaignController } from './admin-campaign.controller';
import { AdminFaqController } from './admin-faq.controller';

import { FoundationModule } from 'src/foundation/foundation.module';
import { FaqModule } from '../faq/faq.module';


@Module({
  imports: [FoundationModule, FaqModule],
  controllers: [
    AdminController,
    AdminFoundationController,
    AdminCampaignController,
    AdminFaqController
  ],
  providers: [AdminService],
})
export class AdminModule {}
