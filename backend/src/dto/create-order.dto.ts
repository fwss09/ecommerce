import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  email: string;

  @IsString()
  shippingAddress: string;

  @IsArray()
  items: OrderItemDto[];
}
