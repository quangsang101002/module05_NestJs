import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Link tài liệu: https://docs.nestjs.com/pipes#class-validator
  // Cài đặt thư viện: npm i --save class-validator class-transformer
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useStaticAssets(join(__dirname, '../../', 'public'), {
    prefix: '',
  });
  app.enableCors();
  await app.listen(8080);
}
bootstrap();
