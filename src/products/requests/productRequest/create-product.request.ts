import { IsNotEmpty, IsOptional } from 'class-validator';

export class createProductRequest {
  // @IsNotEmpty()
  sku: string;
  // @IsNotEmpty()
  name_product: string;
  // @IsNotEmpty()
  description: string;
  // @IsNotEmpty()
  category: number;
  // @IsNotEmpty()
  unit_price: number;
  avatar: string;
  gallery: string;
}
