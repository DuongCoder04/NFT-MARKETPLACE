import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Tự động chuyển đổi DTO
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('NFT Marketplace API')
    .setDescription('Backend APIs for NFT Marketplace - login, mint, list, bid...')
    .setVersion('0.1')
    .addBearerAuth() // Cho phép test với JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger UI is available at: http://localhost:3000/api/docs`);
}
bootstrap();
