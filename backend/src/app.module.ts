// src/app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';  // Импортируем UsersModule
import { PrismaModule } from './prisma/prisma.module';  // Импортируем PrismaModule
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ProductsModule } from './products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'; // Для работы с путями

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, ProfileModule, ProductsModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'img'),  // Указываем путь к папке с изображениями
    serveRoot: '/img',  // Делаем папку доступной по URL "/images"
  })],  // Импортируем нужные модули
})
export class AppModule {}
