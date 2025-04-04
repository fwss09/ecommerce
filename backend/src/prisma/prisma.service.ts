// src/prisma/prisma.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  cart: any;
    cartItem: any;
  constructor() {
    super();
  }
}
