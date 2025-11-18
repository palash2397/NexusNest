import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { FoundationModule } from 'src/foundation/foundation.module';

@Module({
  imports: [FoundationModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
