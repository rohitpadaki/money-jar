import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'], // Use the port your React dev server runs on
    credentials: true, // allow cookies (optional, only if you're using cookies for auth)
  });
  const config = new DocumentBuilder()
    .setTitle("Money Jar API")
    .setDescription("API Docutmentation for Money Jar: Sweet Money Management with Your Hive")
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
