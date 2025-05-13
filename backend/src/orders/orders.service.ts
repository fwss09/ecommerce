import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // Создание заказа для авторизованного пользователя
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { fullName, phoneNumber, email, shippingAddress, items } = createOrderDto;
  
    // Вычисление общей цены заказа
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    // Проверка на наличие товара в наличии
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product?.inStock) {
        throw new Error(`Продукта ${product?.name || 'с этим ID'} нет в наличии или недостаточно на складе.`);
      }
    }

    // Проверяем, существует ли пользователь с таким userId
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!userExists) {
      throw new Error('Пользователь с таким ID не найден');
    }
  
    console.log('User exists:', userExists); // Для отладки
  
    console.log('Creating order for userId:', userId);

    console.log('Creating order with data:', {
        userId,
        fullName,
        phoneNumber,
        email,
        shippingAddress,
        totalPrice,
        items,
      });

    // Создаем заказ
    const order = await this.prisma.order.create({
      data: {
        userId: userId, // Убедись, что передаешь правильный userId
        fullName,
        phoneNumber,
        email,
        shippingAddress,
        totalPrice,
        status: OrderStatus.PENDING,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
  
    return order;
  }
  
  // Создание гостевого заказа
  async createGuestOrder(createOrderDto: CreateOrderDto) {
    const { fullName, phoneNumber, email, shippingAddress, items } = createOrderDto;

    // Вычисление общей цены заказа
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Проверка на наличие товара в наличии
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product?.inStock) {
        throw new Error(`Продукта ${product?.name || 'с этим ID'} нет в наличии или недостаточно на складе.`);
      }
    }

    // Создаем гостевой заказ
    const guestOrder = await this.prisma.guestOrder.create({
      data: {
        fullName,
        phoneNumber,
        email,
        shippingAddress,
        totalPrice,
        status: OrderStatus.PENDING,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return guestOrder;
  }

  // Получить все заказы пользователя
  async getUserOrders(userId: string) {
    console.log('Получаем заказы для пользователя с ID:', userId);
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
