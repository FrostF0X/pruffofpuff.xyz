import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with specific options (optional)
  app.enableCors({
    origin: 'http://localhost:8000', // Allow only specific origin
    credentials: true, // Enable credentials like cookies
  });
  await app.listen(3000);
}
bootstrap();
