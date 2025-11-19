import { Module } from '@nestjs/common';
import { FoundationService } from './foundation.service';
import { FoundationController } from './foundation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Foundation, FoundationSchema } from './schemas/foundation.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Foundation.name, schema: FoundationSchema },
      { name: User.name, schema: UserSchema },
      { name: Campaign.name, schema: CampaignSchema },
    ]),
  ],
  controllers: [FoundationController],
  providers: [FoundationService],
  exports: [FoundationService],
})
export class FoundationModule {}
