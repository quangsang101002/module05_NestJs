import { Module } from '@nestjs/common';
import { ProductController } from '../products/controllers/products.controller';
import { productService } from '../products/providers/products.service';
import { Product } from '../products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [productService],
})
export class ProductModule {}
