// src/users/users.controller.ts
import { Controller, Param, Body, Get, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';  // Импортируем UsersService
import { User, Role } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Эндпоинт для получения всех пользователей
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();  // Используем новый метод из UsersService
  }

  // Обновление пользователя
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    const role: Role = updateUserDto.role as Role;
    return this.usersService.updateUser(id, updateUserDto.email, updateUserDto.password, role);
  }

  // Удаление пользователя
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {  // id теперь строка
    return this.usersService.deleteUser(id);
  }  
}
