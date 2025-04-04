// src/profile/profile.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER') // Можно указать роли
  getProfile() {
    return { message: 'This is a protected route' };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Только админ может доступить этот маршрут
  getAdminPage() {
    return { message: 'Admin content' };
  }
}
