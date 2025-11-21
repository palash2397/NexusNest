// src/main.server.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverless from 'serverless-http';
import { NestExpressApplication } from '@nestjs/platform-express';

let server: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false,
  });

  // replicate any global setup you have in main.ts (pipes, cors, prefix)
  app.setGlobalPrefix('api/v1');
  app
    .useGlobalPipes
    // same config as in main.ts
    ();

  await app.init(); // important, don't call listen()
  const expressApp = app.getHttpAdapter().getInstance();
  return serverless(expressApp);
}

// exported handler for Vercel
export const handler = async (req: any, res: any) => {
  if (!server) server = await bootstrap();
  return server(req, res);
};
