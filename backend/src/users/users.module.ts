import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Пример для PrismaService
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
