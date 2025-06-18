import { ConfigModule, ConfigService } from '@nestjs/config';

async function main() {
  // Load cấu hình .env
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env', // nếu bạn đặt .env ở root
  });

  // Khởi tạo ConfigService để lấy biến
  const configService = new ConfigService();

  // In ra các biến môi trường
  console.log('📦 DATABASE CONFIG');
  console.log('DATABASE_HOST:', configService.get('DATABASE_HOST'));
  console.log('DATABASE_PORT:', configService.get('DATABASE_PORT'));
  console.log('DATABASE_USER:', configService.get('DATABASE_USER'));
  console.log('DATABASE_PASSWORD:', configService.get('DATABASE_PASSWORD'));
  console.log('DATABASE_NAME:', configService.get('DATABASE_NAME'));

  console.log('\n🔐 JWT CONFIG');
  console.log('JWT_SECRET:', configService.get('JWT_SECRET'));
  console.log('JWT_EXPIRES_IN:', configService.get('JWT_EXPIRES_IN'));

  console.log('\n🛰️ PINATA CONFIG');
  console.log('PINATA_API_KEY:', configService.get('PINATA_API_KEY'));
  console.log('PINATA_SECRET_API_KEY:', configService.get('PINATA_SECRET_API_KEY'));
  console.log('PINATA_JWT:', configService.get('PINATA_JWT'));
}

main();
