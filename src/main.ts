import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));

  // enable global validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes extra fields
      forbidNonWhitelisted: true, // throws error if extra fields present
      transform: true, // auto transform payloads to DTO classes
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('/api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
