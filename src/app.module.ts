import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { FoundationModule } from './foundation/foundation.module';
import { FaqModule } from './faq/faq.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // .env available everywhere
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    UsersModule,
    AdminModule,
    FoundationModule,
    FaqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
