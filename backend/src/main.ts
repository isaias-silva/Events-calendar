import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
config()
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Events Callendar Api')
    .setDescription('api of Events callendar')
    .setVersion('1.0')
    .setContact("isaias silva","https://github.com/isaias-silva","isaiasgarraeluta@gmail.com")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
