// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // Экспортируем PrismaService для использования в других модулях
})
export class PrismaModule {}
