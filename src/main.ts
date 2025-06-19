import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 👈 Thêm dòng này

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Inject ConfigService từ app container
  const configService = app.get(ConfigService);
  // console.log('✅ Loaded .env - PINATA_API_KEY:', configService.get('PINATA_API_KEY'));
  // console.log('✅ Loaded .env - PINATA_API_SECRET:', configService.get('PINATA_API_SECRET'));

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('NFT Marketplace API')
    .setDescription('Backend APIs for NFT Marketplace - login, mint, list, bid...')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`🚀 Application is running on: http://localhost:3000`);
  console.log(`📘 Swagger UI is available at: http://localhost:3000/api/docs`);
}
bootstrap();
