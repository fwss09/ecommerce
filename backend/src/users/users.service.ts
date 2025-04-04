// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Импортируем PrismaService
import { User, Role } from '@prisma/client';  // Импортируем тип User из Prisma

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Метод для получения пользователя по email
  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Метод для создания пользователя
  async createUser(email: string, hashedPassword: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  // Метод для обновления пользователя
  async updateUser(id: string, email: string, password: string, role: Role): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        email,
        password,
        role,  // Добавляем обновление роли
      },
    });
  }

  // Метод для удаления пользователя
  async deleteUser(id: string): Promise<User> {  // id теперь строка
    return this.prisma.user.delete({
      where: { id },  // id - строка
    });
  }

  // Метод для получения всех пользователей
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();  // Возвращаем всех пользователей
  }
}
