import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], // Use the port your React dev server runs on
    credentials: true, // allow cookies (optional, only if you're using cookies for auth)
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
