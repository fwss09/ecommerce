// src/profile/profile.controller.ts
import { Controller, Get, UseGuards  } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  getProfile() {
    return { message: 'This is a protected route' };
  }
  
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAdminPage() {
    return { message: 'Admin content' };
  }
}