// src/app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ProductsModule } from './products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, ProfileModule, ProductsModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'img'),
    serveRoot: '/img',
  })],
})
export class AppModule {}
