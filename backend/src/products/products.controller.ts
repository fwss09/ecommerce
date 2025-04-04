// src/products/products.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseInterceptors, UploadedFile  } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Multer } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // Получить все продукты (доступно всем)
  @Get()
  async getAllProducts() {
    const products = await this.productsService.getAllProducts();
    return products.map(product => ({
      ...product,
      imageUrl: product.imageUrl ? `http://localhost:5000${product.imageUrl}` : null,
    }));
  }

  // Получить продукт по ID (доступно всем)
  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // Создать новый продукт (доступно только админам)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Защищаем этот маршрут
  @Roles('ADMIN') // Только админ может создавать продукты
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './img', // Папка для загрузки
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createProduct(
    @Body() createProductDto: { name: string; description: string; price: string },
    @UploadedFile() file: Express.Multer.File
  ): Promise<Product> {
    const imageUrl = file ? `/img/${file.filename}` : undefined;
    return this.productsService.createProduct(createProductDto.name, createProductDto.description, Number(createProductDto.price), imageUrl);
  }

  // Обновить продукт (доступно только админам)
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Только админ может обновлять продукты
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: { name: string; description: string; price: number; imageUrl?: string }
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductDto.name, updateProductDto.description, updateProductDto.price, updateProductDto.imageUrl);
  }

  // Удалить продукт (доступно только админам)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Только админ может удалять продукты
  async deleteProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.deleteProduct(id);
  }
}
