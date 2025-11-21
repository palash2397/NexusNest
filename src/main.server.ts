import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import serverless from 'serverless-http';
import { ValidationPipe } from '@nestjs/common';
import morgan from 'morgan';

let server: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Logger (optional)
  app.use(morgan('dev'));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS enable
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
  });

  // Initialize Nest in serverless mode
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverless(expressApp);
}

// This is the handler Vercel will call
export const handler = async (req: any, res: any) => {
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
};
