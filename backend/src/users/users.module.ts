import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Пример для PrismaService
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [],
  providers: [UsersService, PrismaService],  // Добавляем UsersService
  exports: [UsersService],  // Экспортируем UsersService, чтобы он был доступен в других модулях
  controllers: [UsersController],
})
export class UsersModule {}
