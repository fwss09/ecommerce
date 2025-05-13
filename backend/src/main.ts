import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  const config = new DocumentBuilder()
    .setTitle('API Example')
    .setDescription('The API for my application')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // app.enableCors({
  //   origin: 'http://localhost:3000',
  // });
  // app.enableCors({
  //   origin: 'http://192.168.0.100:3000',
  // });
  const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.0.100:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  };
  app.enableCors(corsOptions);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
