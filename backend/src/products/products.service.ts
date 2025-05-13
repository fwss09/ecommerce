// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(sort?: string): Promise<Product[]> {
    let orderBy;
  
    switch (sort) {
      case 'asc':
        orderBy = { price: 'asc' };
        break;
      case 'desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = undefined;
    }
  
    return this.prisma.product.findMany({
      ...(orderBy && { orderBy }),
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

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

  async deleteProduct(id: string): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
