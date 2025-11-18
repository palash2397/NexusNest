import { Module } from '@nestjs/common';
import { FoundationService } from './foundation.service';
import { FoundationController } from './foundation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Foundation, FoundationSchema } from './schemas/foundation.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Foundation.name, schema: FoundationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FoundationController],
  providers: [FoundationService],
  exports: [FoundationService],
})
export class FoundationModule {}
