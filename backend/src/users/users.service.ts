// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(email: string, hashedPassword: string, name: string, phone: string, ): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone
      },
    });
  }

  async updateUser(id: string, name: string, phone: string, email: string, password: string, role: Role): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        email,
        password,
        role,
      },
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
