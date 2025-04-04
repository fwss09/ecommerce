import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';  // Импортируем UsersModule
import { JwtModule } from '@nestjs/jwt';  // Импортируем JwtModule
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,  // Импортируем UsersModule
    JwtModule.register({  // Добавляем JwtModule и конфигурируем его
      secret: 'vN#7qP3r6@uL!g9W0zB#qL^8JxRv5D@1',  // Укажи свой секретный ключ
      signOptions: { expiresIn: '5m' },  // Пример настройки срока действия
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}