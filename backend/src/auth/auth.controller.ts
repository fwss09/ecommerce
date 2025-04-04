import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Регистрация
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  // Логин
  @Post('login')
  async login(@Body() loginDto: { email: string, password: string }) {
    console.log('received login-request: ', loginDto)
    return await this.authService.login(loginDto.email, loginDto.password);
  }
}
