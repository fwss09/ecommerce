// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Получить все продукты
  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  // Получить продукт по ID
  async getProductById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // Создать новый продукт
  async createProduct(name: string, description: string, price: number, imageUrl?: string): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
      },
    });
  }

  // Обновить продукт
  async updateProduct(id: string, name: string, description: string, price: number, imageUrl?: string): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        imageUrl,
      },
    });
  }

  // Удалить продукт
  async deleteProduct(id: string): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
