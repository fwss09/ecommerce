// src/users/users.controller.ts
import { Controller, Param, Body, Get, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Role } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    const role: Role = updateUserDto.role as Role;
    return this.usersService.updateUser(id, updateUserDto.email, updateUserDto.password, role);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser(id);
  }  
}
