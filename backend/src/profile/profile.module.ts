// src/profile/profile.module.ts
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';  // Импортируем контроллер
import { ProfileService } from './profile.service';  // Если есть сервис
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], 
  controllers: [ProfileController],  // Добавляем контроллер
  providers: [ProfileService],  // Если есть сервис
})
export class ProfileModule {}
