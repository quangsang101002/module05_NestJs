import { Module } from '@nestjs/common';
import { OrderController } from '../orders/controllers/orders.controller';
import { OrderService } from '../orders/providers/orders.service';
import { Order } from '../orders/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
