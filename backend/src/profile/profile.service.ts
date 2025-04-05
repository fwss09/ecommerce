// src/profile/profile.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfileById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}