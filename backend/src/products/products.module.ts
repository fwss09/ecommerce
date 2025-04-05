// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    imports: [PrismaModule],
    controllers: [ProductsController],
    providers: [ProductsService, PrismaService],
})
export class ProductsModule {}