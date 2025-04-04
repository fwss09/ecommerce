// src/profile/profile.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Импортируем PrismaService

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  // Пример метода для получения профиля пользователя по ID
  async getProfileById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },  // Ищем пользователя по его ID
    });
  }
}