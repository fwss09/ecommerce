// src/dto/update-user.dto.ts
import { IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: Role;  // Убедитесь, что это тип Role
}