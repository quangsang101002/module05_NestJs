import { IsOptional } from 'class-validator';

export class UpdateProductRequest {
  @IsOptional()
  sku: string;
  @IsOptional()
  name_product: string;
  @IsOptional()
  description: string;
  @IsOptional()
  category: number;
  @IsOptional()
  avatar: string;
  @IsOptional()
  gallery: string;
}
