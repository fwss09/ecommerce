// src/products/products.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseInterceptors, UploadedFile  } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Multer } from 'multer';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAllProducts(@Query('sort') sort: string) {
    const products = await this.productsService.getAllProducts(sort);
    return products.map(product => ({
      ...product,
      imageUrl: product.imageUrl ? `http://localhost:5000${product.imageUrl}` : null,
    }));
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    const product = await this.productsService.getProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './img',
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

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: { name: string; description: string; price: number; imageUrl?: string }
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductDto.name, updateProductDto.description, updateProductDto.price, updateProductDto.imageUrl);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteProduct(@Param('id') id: string): Promise<Product> {
    return this.productsService.deleteProduct(id);
  }
}
