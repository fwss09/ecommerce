import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';  // Сервис для работы с заказами
import { CreateOrderDto } from '../dto/create-order.dto';  // DTO для создания заказа
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Создание заказа для авторизованного пользователя
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@GetUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(user.userId, createOrderDto); // Используем userId
  }

  // Создание заказа для неавторизованного пользователя (гостевой заказ)
  @Post('guest')
  async createGuestOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.createGuestOrder(createOrderDto);
  }

  // Получить все заказы текущего пользователя (для авторизованных пользователей)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Req() req) {
    const userId = req.user.userId; // Используем userId вместо sub
    console.log('Extracted userId:', userId);
    if (!userId) {
      throw new Error('User ID not found in token');
    }
    return await this.ordersService.getUserOrders(userId);
  }
}
