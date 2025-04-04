import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';  // Добавим DTO для создания пользователя
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // Проверяем, есть ли уже пользователь с таким email
    const existingUser = await this.usersService.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = await this.usersService.createUser(email, hashedPassword);

    // Генерируем JWT токен
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }
  async login(email: string, password: string) {
    // Ищем пользователя по email
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
  
    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
  
    // Генерируем JWT токен
    const payload = { email: user.email, sub: user.id, role: user.role };
    const expiresIn = user.role === 'ADMIN' ? '2h' : '10d';
    const token = this.jwtService.sign(payload, { expiresIn });
  
    return { user, access_token: token };
  }
}
