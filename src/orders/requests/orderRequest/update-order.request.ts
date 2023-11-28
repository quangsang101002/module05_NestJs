import { IsNotEmpty, IsOptional } from 'class-validator';
export class updateOrderRequest {
  @IsNotEmpty()
  serial_number: string;
  @IsNotEmpty()
  phone_number: string;
  @IsNotEmpty()
  delivery_address: string;
  @IsNotEmpty()
  status: number;
  @IsOptional()
  note: string;
}
